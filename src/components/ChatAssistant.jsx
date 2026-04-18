"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseMessageText, formatTime } from "@/lib/utils";

/**
 * Quick action buttons available in the chat interface.
 * @type {Array<{label: string, message: string}>}
 */
const QUICK_ACTIONS = [
  { label: "🚻 Nearest washroom", message: "Where is the nearest washroom?" },
  { label: "🍔 Shortest food queue", message: "Which food stall has the shortest queue?" },
  { label: "🚪 Best exit gate", message: "Which gate should I use to exit?" },
  { label: "👥 Crowd report", message: "Show me the crowd density report" },
  { label: "🧭 Best route", message: "Give me navigation suggestions" },
  { label: "❓ Help", message: "What can you help me with?" },
];

/**
 * Safely renders a message text with bold and italic formatting.
 * Uses parseMessageText from utils instead of dangerouslySetInnerHTML.
 * @param {{ content: string }} props
 * @returns {import("react").ReactNode}
 */
function SafeMessageContent({ content }) {
  return content.split("\n").map((line, lineIdx) => {
    const parts = parseMessageText(line);
    return (
      <span key={lineIdx} className="block">
        {parts.length === 0 ? "\u00A0" : parts.map((part, i) => {
          if (part.type === "bold") {
            return <strong key={i} className="text-white font-semibold">{part.content}</strong>;
          }
          if (part.type === "italic") {
            return <em key={i} className="text-blue-300/60 text-xs">{part.content}</em>;
          }
          return <span key={i}>{part.content}</span>;
        })}
      </span>
    );
  });
}

/**
 * Full-screen chat modal component with AI-powered responses.
 * Features: safe rendering, keyboard accessibility, ARIA labels, auto-focus.
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function ChatAssistant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 **Welcome to AI Crowd Pilot!**\n\nI'm here to help you navigate the stadium, find the shortest queues, and avoid crowded areas.\n\n💡 *Try asking me about food stalls, washrooms, gates, or navigation!*",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const sendMessage = useCallback(async (text) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, intent: data.intent, timestamp: data.timestamp },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ ${err.message || "Sorry, I encountered an error. Please try again."}`, timestamp: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="AI Crowd Pilot Chat Assistant"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-2xl h-[85vh] flex flex-col glass-card glow-border overflow-hidden z-10"
          >
            {/* Header */}
            <header className="flex-shrink-0 p-4 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-purple-500/20" aria-hidden="true">
                  🤖
                </div>
                <div>
                  <h2 id="chat-title" className="text-sm font-semibold text-white">AI Crowd Pilot</h2>
                  <div className="flex items-center gap-1.5" aria-label="Status: Online, analyzing real-time data">
                    <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot" aria-hidden="true" />
                    <span className="text-[11px] text-emerald-400">Analyzing real-time data</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close chat"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                         text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                ✕
              </button>
            </header>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx === messages.length - 1 ? 0.1 : 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user" ? "chat-message-user" : "chat-message-ai"
                    }`}
                    role={msg.role === "assistant" ? "status" : undefined}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-medium text-blue-400">AI Crowd Pilot</span>
                        {msg.intent && msg.intent !== "general" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 uppercase tracking-wider font-medium">
                            {msg.intent}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed text-gray-200">
                      <SafeMessageContent content={msg.content} />
                    </div>
                    <div className="text-[10px] text-gray-600 mt-1.5 text-right" aria-label={`Sent at ${formatTime(msg.timestamp)}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                  role="status"
                  aria-label="AI is typing a response"
                >
                  <div className="chat-message-ai rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-medium text-blue-400">AI Crowd Pilot</span>
                    </div>
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: "typing 1s infinite 0s" }} />
                      <span className="w-2 h-2 rounded-full bg-purple-400" style={{ animation: "typing 1s infinite 0.2s" }} />
                      <span className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: "typing 1s infinite 0.4s" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <nav className="flex-shrink-0 px-4 pb-2" aria-label="Quick chat actions">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(action.message)}
                    disabled={isLoading}
                    aria-label={`Ask: ${action.message}`}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400
                             hover:bg-white/8 hover:border-white/15 hover:text-white transition-all duration-200
                             disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t border-white/8">
              <form
                className="flex gap-2"
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                aria-label="Chat message form"
              >
                <label htmlFor="chat-input" className="sr-only">Type your message</label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about food, washrooms, navigation..."
                  disabled={isLoading}
                  maxLength={500}
                  autoComplete="off"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                           placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:ring-2
                           focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white
                           font-medium text-sm transition-all duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
                           shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  {isLoading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
