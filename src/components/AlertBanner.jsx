"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlertBanner({ alerts }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeAlerts = alerts?.filter((a) => a.active) || [];

  useEffect(() => {
    if (activeAlerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAlerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeAlerts.length]);

  if (activeAlerts.length === 0) return null;

  const current = activeAlerts[currentIndex % activeAlerts.length];
  if (!current) return null;

  const getStyle = (type) => {
    switch (type) {
      case "warning": return "from-red-500/15 via-orange-500/8 to-transparent border-red-500/20 text-red-200";
      case "info": return "from-blue-500/15 via-cyan-500/8 to-transparent border-blue-500/20 text-blue-200";
      case "success": return "from-emerald-500/15 via-green-500/8 to-transparent border-emerald-500/20 text-emerald-200";
      default: return "from-gray-500/15 via-gray-500/8 to-transparent border-gray-500/20 text-gray-200";
    }
  };

  const getIcon = (type) => {
    switch (type) { case "warning": return "⚠️"; case "info": return "ℹ️"; case "success": return "✅"; default: return "📢"; }
  };

  return (
    <div className={`rounded-xl p-3 border bg-gradient-to-r ${getStyle(current.type)} overflow-hidden relative`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-base flex-shrink-0">{getIcon(current.type)}</span>
            <p className="text-sm truncate">{current.message}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {activeAlerts.length > 1 && (
              <span className="text-[10px] text-gray-500">
                {(currentIndex % activeAlerts.length) + 1}/{activeAlerts.length}
              </span>
            )}
            {current.priority === "high" && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full badge-avoid font-bold uppercase tracking-wider">
                urgent
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
