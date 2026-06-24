from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
from chatbot_knowledge import SYSTEM_PROMPT


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ============ AI CHATBOT ============

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatHistoryItem(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    ts: str


async def _load_history(session_id: str) -> List[dict]:
    doc = await db.chat_sessions.find_one({"session_id": session_id}, {"_id": 0})
    return (doc or {}).get("messages", [])


async def _append_messages(session_id: str, user_text: str, assistant_text: str):
    now = datetime.now(timezone.utc).isoformat()
    user_msg = {"role": "user", "content": user_text, "ts": now}
    bot_msg = {"role": "assistant", "content": assistant_text, "ts": now}
    await db.chat_sessions.update_one(
        {"session_id": session_id},
        {
            "$push": {"messages": {"$each": [user_msg, bot_msg]}},
            "$setOnInsert": {"session_id": session_id, "created_at": now},
        },
        upsert=True,
    )


@api_router.post("/chat")
async def chat(req: ChatRequest):
    """Streaming chat endpoint (SSE). Sends incremental text deltas."""
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty message")

    chat_inst = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=req.session_id,
        system_message=SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    # Rehydrate history into the LlmChat by replaying as send-only context is
    # not exposed; instead, we rely on the message we send + system prompt.
    # We persist on our own side after the stream completes.
    full_response = []

    async def event_generator():
        try:
            async for event in chat_inst.stream_message(UserMessage(text=req.message)):
                if isinstance(event, TextDelta):
                    full_response.append(event.content)
                    yield f"data: {json.dumps({'delta': event.content})}\n\n"
                elif isinstance(event, StreamDone):
                    break
        except Exception as e:
            logger.exception("Chat stream failed")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            assistant_text = "".join(full_response)
            if assistant_text:
                try:
                    await _append_messages(req.session_id, req.message, assistant_text)
                except Exception:
                    logger.exception("Failed to persist chat history")
            yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@api_router.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    """Return the message history for a given session."""
    messages = await _load_history(session_id)
    return {"session_id": session_id, "messages": messages}


# Include the router in the main app (must be after all route definitions)
app.include_router(api_router)


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()