#!/usr/bin/env python3
"""
Backend API tests for AI Chat endpoint
Tests the streaming chat endpoint and history retrieval
"""
import requests
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Load frontend .env to get REACT_APP_BACKEND_URL
frontend_env = Path("/app/frontend/.env")
if frontend_env.exists():
    load_dotenv(frontend_env)

BACKEND_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://prime-interface.preview.emergentagent.com")
BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing backend at: {BASE_URL}")
print("=" * 80)


def test_chat_streaming(session_id: str, message: str, test_name: str):
    """Test the streaming chat endpoint"""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")
    print(f"Session ID: {session_id}")
    print(f"Message: {message}")
    
    url = f"{BASE_URL}/chat"
    payload = {
        "session_id": session_id,
        "message": message
    }
    
    try:
        response = requests.post(
            url,
            json=payload,
            headers={"Accept": "text/event-stream"},
            stream=True,
            timeout=60
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        # Check content-type
        content_type = response.headers.get('content-type', '')
        if 'text/event-stream' not in content_type:
            print(f"❌ FAILED: Expected content-type 'text/event-stream', got '{content_type}'")
            return False
        
        # Parse SSE stream
        deltas = []
        done_received = False
        error_received = False
        
        print("\nStreaming response:")
        print("-" * 80)
        
        for line in response.iter_lines(decode_unicode=True):
            if line.startswith('data: '):
                data_str = line[6:]  # Remove 'data: ' prefix
                try:
                    data = json.loads(data_str)
                    
                    if 'delta' in data:
                        delta_text = data['delta']
                        deltas.append(delta_text)
                        print(delta_text, end='', flush=True)
                    
                    if 'done' in data and data['done']:
                        done_received = True
                        print("\n" + "-" * 80)
                        print("✓ Stream completed with 'done' signal")
                    
                    if 'error' in data:
                        error_received = True
                        print(f"\n❌ Error in stream: {data['error']}")
                        
                except json.JSONDecodeError as e:
                    print(f"\n❌ Failed to parse JSON: {data_str}")
                    print(f"Error: {e}")
        
        full_response = "".join(deltas)
        
        print(f"\nFull response length: {len(full_response)} characters")
        print(f"Number of deltas: {len(deltas)}")
        print(f"Done signal received: {done_received}")
        
        if error_received:
            print("❌ FAILED: Error received in stream")
            return False
        
        if not done_received:
            print("❌ FAILED: No 'done' signal received")
            return False
        
        if len(full_response) < 10:
            print(f"❌ FAILED: Response too short ({len(full_response)} chars)")
            return False
        
        print("✅ PASSED: Streaming chat endpoint working correctly")
        return True
        
    except requests.exceptions.Timeout:
        print("❌ FAILED: Request timed out")
        return False
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_chat_history(session_id: str, expected_min_messages: int):
    """Test the chat history endpoint"""
    print(f"\n{'='*80}")
    print(f"TEST: Chat History Retrieval")
    print(f"{'='*80}")
    print(f"Session ID: {session_id}")
    
    url = f"{BASE_URL}/chat/history/{session_id}"
    
    try:
        response = requests.get(url, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        print(f"Response structure: {json.dumps(data, indent=2)}")
        
        # Validate response structure
        if 'session_id' not in data:
            print("❌ FAILED: Missing 'session_id' in response")
            return False
        
        if data['session_id'] != session_id:
            print(f"❌ FAILED: session_id mismatch. Expected '{session_id}', got '{data['session_id']}'")
            return False
        
        if 'messages' not in data:
            print("❌ FAILED: Missing 'messages' in response")
            return False
        
        messages = data['messages']
        
        if not isinstance(messages, list):
            print(f"❌ FAILED: 'messages' should be a list, got {type(messages)}")
            return False
        
        print(f"\nNumber of messages: {len(messages)}")
        
        if len(messages) < expected_min_messages:
            print(f"❌ FAILED: Expected at least {expected_min_messages} messages, got {len(messages)}")
            return False
        
        # Validate message structure
        for i, msg in enumerate(messages):
            print(f"\nMessage {i+1}:")
            print(f"  Role: {msg.get('role', 'N/A')}")
            print(f"  Content length: {len(msg.get('content', ''))} chars")
            print(f"  Timestamp: {msg.get('ts', 'N/A')}")
            
            if 'role' not in msg or msg['role'] not in ['user', 'assistant']:
                print(f"❌ FAILED: Invalid role in message {i+1}")
                return False
            
            if 'content' not in msg or not msg['content']:
                print(f"❌ FAILED: Missing or empty content in message {i+1}")
                return False
        
        # Check alternating user/assistant pattern
        roles = [msg['role'] for msg in messages]
        for i in range(0, len(roles)-1, 2):
            if i < len(roles) and roles[i] != 'user':
                print(f"⚠️  Warning: Expected 'user' at position {i}, got '{roles[i]}'")
            if i+1 < len(roles) and roles[i+1] != 'assistant':
                print(f"⚠️  Warning: Expected 'assistant' at position {i+1}, got '{roles[i+1]}'")
        
        print("\n✅ PASSED: Chat history endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_empty_message():
    """Test that empty message returns 400"""
    print(f"\n{'='*80}")
    print(f"TEST: Empty Message Validation")
    print(f"{'='*80}")
    
    url = f"{BASE_URL}/chat"
    payload = {
        "session_id": "test_empty_session",
        "message": ""
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected 400 for empty message, got {response.status_code}")
            return False
        
        print("✅ PASSED: Empty message correctly returns 400")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("BACKEND API TESTS - AI CHAT ENDPOINT")
    print("="*80)
    
    results = {}
    
    # Test 1: Chat about Roti Project
    results['test1_roti_project'] = test_chat_streaming(
        session_id="test_session_001",
        message="What is the Roti Project?",
        test_name="Chat about Roti Project"
    )
    
    # Test 2: Follow-up question
    results['test2_followup'] = test_chat_streaming(
        session_id="test_session_001",
        message="How much does ₹500 fund?",
        test_name="Follow-up question about ₹500 funding"
    )
    
    # Test 3: Chat history
    results['test3_history'] = test_chat_history(
        session_id="test_session_001",
        expected_min_messages=4
    )
    
    # Test 4: Empty message validation
    results['test4_empty'] = test_empty_message()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    total = len(results)
    passed = sum(results.values())
    failed = total - passed
    
    print(f"\nTotal: {total} | Passed: {passed} | Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed")
        return 1


if __name__ == "__main__":
    exit(main())
