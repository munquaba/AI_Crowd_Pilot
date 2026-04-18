"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_ACTIONS = [
  { label: "🚻 Nearest washroom", message: "Where is the nearest washroom?" },
  { label: "🍔 Shortest food queue", message: "Which food stall has the shortest queue?" },
  { label: "🚪 Best exit gate", message: "Which gate should I use to exit?" },
  { label: "👥 Crowd report", message: "Show me the crowd density report" },
  { label: "🧭 Best route", message: "Give me navigation suggestions" },
  { label: "❓ Help", message: "What can you help me with?" },
];

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, intent: data.intent, timestamp: data.timestamp },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I encountered an error. Please try again.", timestamp: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    return content.split("\n").map((line, i) => {
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      line = line.replace(/\*(.+?)\*/g, '<em class="text-blue-300/60 text-xs">$1</em>');
      return <span key={i} className="block" dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
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
            <div className="flex-shrink-0 p-4 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-purple-500/20">
                  🤖
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">AI Crowd Pilot</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot" />
                    <span className="text-[11px] text-emerald-400">Analyzing real-time data</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                         text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx === messages.length - 1 ? 0.1 : 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user" ? "chat-message-user" : "chat-message-ai"
                  }`}>
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
                      {formatMessage(msg.content)}
                    </div>
                    <div className="text-[10px] text-gray-600 mt-1.5 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="chat-message-ai rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-medium text-blue-400">AI Crowd Pilot</span>
                    </div>
                    <div className="flex items-center gap-1.5">
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
            <div className="flex-shrink-0 px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(action.message)}
                    disabled={isLoading}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400
                             hover:bg-white/8 hover:border-white/15 hover:text-white transition-all duration-200
                             disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t border-white/8">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about food, washrooms, navigation..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                           placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:ring-1
                           focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white
                           font-medium text-sm transition-all duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
                           shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  {isLoading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
