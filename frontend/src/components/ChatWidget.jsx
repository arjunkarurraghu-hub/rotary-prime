import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STORAGE_KEY = "rbp_chat_session";

const SUGGESTIONS = [
  "What is the Roti Project?",
  "How can my company support via CSR?",
  "Do you give 80G receipts?",
  "Where do you meet?"
];

function getOrCreateSessionId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id =
        "sess_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 9);
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return "sess_" + Date.now();
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingAssistant, setPendingAssistant] = useState("");
  const sessionId = useRef(getOrCreateSessionId());
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Hydrate history on first open
  useEffect(() => {
    if (!open) return;
    if (messages.length > 0) return;
    (async () => {
      try {
        const res = await fetch(`${API}/chat/history/${sessionId.current}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.messages) && data.messages.length) {
            setMessages(data.messages);
            return;
          }
        }
      } catch {
        /* ignore */
      }
      // Seed with welcome message
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm Falcon, the assistant for Rotary Bangalore Prime. Ask me anything about our projects, donations, CSR partnerships or how to give. How can I help?"
        }
      ]);
    })();
  }, [open, messages.length]);

  // Auto-scroll on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pendingAssistant]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const send = async (text) => {
    const t = (text ?? input).trim();
    if (!t || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: t }]);
    setBusy(true);
    setPendingAssistant("");

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId.current, message: t })
      });
      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // SSE messages are separated by double newlines
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const p of parts) {
          const line = p.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          try {
            const ev = JSON.parse(payload);
            if (ev.delta) {
              acc += ev.delta;
              setPendingAssistant(acc);
            } else if (ev.error) {
              acc += `\n\n_Sorry — ${ev.error}_`;
              setPendingAssistant(acc);
            } else if (ev.done) {
              // finalize
              setMessages((m) => [...m, { role: "assistant", content: acc }]);
              setPendingAssistant("");
            }
          } catch {
            /* ignore parse errors */
          }
        }
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I'm having trouble reaching the server right now. Please try again in a moment — or reach us on WhatsApp."
        }
      ]);
      setPendingAssistant("");
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50 bg-[#17458b] hover:bg-[#0e2a52] text-white rounded-full shadow-[0_10px_30px_-8px_rgba(20,35,59,0.6)] w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all hover:scale-105"
        >
          <span className="absolute -top-1 -right-1 bg-[#d99a1c] text-[#3a2a05] text-[10px] font-extrabold px-2 py-[2px] rounded-full">
            AI
          </span>
          <MessageCircle size={26} strokeWidth={2.2} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-5 sm:right-5 md:bottom-7 md:right-7 z-50 w-auto sm:w-[380px] max-h-[78vh] sm:max-h-[640px] bg-white border border-[#eceae4] rounded-[20px] shadow-[0_30px_60px_-20px_rgba(20,35,59,0.45)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#0e2a52] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d6a72a]/20 flex items-center justify-center">
              <Sparkles size={18} className="text-[#d6a72a]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-extrabold tracking-tight">
                Falcon · AI Assistant
              </div>
              <div className="text-[11px] text-[#a9c2ea]">
                Rotary Bangalore Prime · usually replies instantly
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-4 bg-[#f7f6f2] space-y-3"
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} text={m.content} />
            ))}
            {pendingAssistant && (
              <Bubble role="assistant" text={pendingAssistant} streaming />
            )}
            {busy && !pendingAssistant && (
              <Bubble role="assistant" text="..." streaming />
            )}
          </div>

          {/* Suggestion chips */}
          {messages.length <= 1 && !busy && (
            <div className="px-3 pt-1 pb-2 bg-[#f7f6f2] flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[12px] text-[#15233b] bg-white border border-[#e7e5df] hover:border-[#17458b] hover:text-[#17458b] rounded-full px-3 py-[6px] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-[#eceae4] bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask about projects, donations, CSR..."
                rows={1}
                disabled={busy}
                className="flex-1 resize-none border border-[#e7e5df] rounded-[12px] px-3 py-2 text-[14px] text-[#15233b] placeholder:text-[#9a958a] outline-none focus:border-[#17458b] max-h-24"
              />
              <button
                onClick={() => send()}
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="bg-[#17458b] hover:bg-[#0e2a52] disabled:opacity-40 text-white w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send size={17} />
              </button>
            </div>
            <div className="text-[10px] text-[#9a958a] mt-2 text-center">
              AI replies may be imperfect — for specifics, message us on WhatsApp.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ role, text, streaming }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] text-[14px] leading-relaxed whitespace-pre-wrap rounded-[14px] px-3.5 py-2.5 ${
          isUser
            ? "bg-[#17458b] text-white rounded-br-sm"
            : "bg-white border border-[#eceae4] text-[#15233b] rounded-bl-sm"
        }`}
      >
        {text}
        {streaming && text !== "..." && (
          <span className="inline-block w-1.5 h-3 bg-[#9a958a] ml-1 animate-pulse align-middle" />
        )}
        {streaming && text === "..." && (
          <span className="inline-flex gap-1">
            <Dot delay={0} />
            <Dot delay={150} />
            <Dot delay={300} />
          </span>
        )}
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 bg-[#9a958a] rounded-full animate-bounce"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
