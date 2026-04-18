"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserLocationSelector({ sections, gates, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const locations = [
    { group: "Gates", items: gates?.map((g) => ({ id: g.name, label: g.name, sub: g.location, crowd: g.crowd })) || [] },
    { group: "Sections", items: sections?.map((s) => ({ id: s.name, label: s.name, sub: `${s.density}% full`, crowd: s.status })) || [] },
  ];

  const getCrowdDot = (crowd) => {
    switch (crowd) {
      case "low": return "bg-emerald-400";
      case "medium": return "bg-amber-400";
      case "high": return "bg-red-400";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10
                 hover:bg-white/8 hover:border-white/15 transition-all duration-200 cursor-pointer"
      >
        <span className="text-base">📍</span>
        <span className="text-gray-300 text-xs">
          {value || "Set your location"}
        </span>
        <svg className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 right-0 z-50 w-64 max-h-80 overflow-y-auto 
                       glass-card p-2 shadow-2xl shadow-black/50"
            >
              {value && (
                <button
                  onClick={() => { onChange(null); setIsOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 
                           hover:bg-white/5 transition-colors cursor-pointer mb-1"
                >
                  ✕ Clear location
                </button>
              )}
              {locations.map((group) => (
                <div key={group.group}>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider px-3 py-1.5 font-medium">
                    {group.group}
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { onChange(item.id); setIsOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 
                               hover:bg-white/5 transition-colors cursor-pointer ${
                                 value === item.id ? "bg-blue-500/10 border border-blue-500/20" : ""
                               }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${getCrowdDot(item.crowd)} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white">{item.label}</div>
                        <div className="text-[10px] text-gray-500">{item.sub}</div>
                      </div>
                      {value === item.id && (
                        <span className="text-[10px] text-blue-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
