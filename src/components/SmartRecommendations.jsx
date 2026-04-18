"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function SmartRecommendations({ data, userLocation }) {
  if (!data) return null;

  const { gates, stalls, washrooms, sections } = data;

  // Find best options
  const bestGate = [...gates].sort((a, b) => a.density - b.density)[0];
  const worstGate = [...gates].sort((a, b) => b.density - a.density)[0];
  const bestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];
  const bestWashroom = [...washrooms].sort((a, b) => a.waitTime - b.waitTime)[0];
  const bestSection = [...sections].sort((a, b) => a.density - b.density)[0];
  const worstSection = [...sections].sort((a, b) => b.density - a.density)[0];

  // Generate smart recommendations based on current state
  const recommendations = [];

  // Gate recommendation
  if (worstGate.density > 75) {
    recommendations.push({
      type: "avoid",
      icon: "🚪",
      title: `Avoid ${worstGate.name}`,
      description: `${worstGate.density}% crowded — use ${bestGate.name} instead (${bestGate.density}%)`,
      action: `Go to ${bestGate.name}`,
      priority: 1,
    });
  }

  // Best food
  recommendations.push({
    type: "best",
    icon: "🍔",
    title: `Eat at ${bestStall.name}`,
    description: `Only ${bestStall.waitTime} min wait in ${bestStall.location}`,
    action: "View menu",
    priority: 2,
  });

  // Best washroom
  if (bestWashroom.waitTime <= 5) {
    recommendations.push({
      type: "best",
      icon: "🚻",
      title: `${bestWashroom.name} is free`,
      description: `${bestWashroom.waitTime} min wait — go now before it fills up`,
      action: "Get directions",
      priority: 3,
    });
  }

  // Section advice
  if (worstSection.density > 80) {
    recommendations.push({
      type: "avoid",
      icon: "👥",
      title: `${worstSection.name} is packed`,
      description: `${worstSection.density}% full — try ${bestSection.name} (${bestSection.density}%)`,
      action: `Move to ${bestSection.name}`,
      priority: 4,
    });
  }

  // Best exit
  recommendations.push({
    type: "recommended",
    icon: "🏃",
    title: `Best exit: ${bestGate.name}`,
    description: `${bestGate.location} — only ${bestGate.density}% crowd right now`,
    action: "Navigate there",
    priority: 5,
  });

  // Seat recommendation
  recommendations.push({
    type: "best",
    icon: "💺",
    title: `Best seats in ${bestSection.name}`,
    description: `Only ${bestSection.density}% full — plenty of room`,
    action: "View section",
    priority: 6,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-base">
            🧠
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">What should I do now?</h3>
            <p className="text-[11px] text-gray-500">
              Smart suggestions based on real-time data
              {userLocation && <span> • You're at {userLocation}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot" />
          <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {recommendations.slice(0, 6).map((rec, idx) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className={`${
                rec.type === "avoid" ? "insight-card-warning" : "insight-card"
              } p-3.5 cursor-default`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl flex-shrink-0 mt-0.5">{rec.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      rec.type === "avoid" ? "badge-avoid" : rec.type === "best" ? "badge-best" : "badge-recommended"
                    }`}>
                      {rec.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-white truncate">{rec.title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{rec.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
