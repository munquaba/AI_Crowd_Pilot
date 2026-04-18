"use client";
import { motion } from "framer-motion";

export default function Dashboard({ data }) {
  if (!data) return null;
  const { gates, stalls, washrooms, sections } = data;

  const bestGate = [...gates].sort((a, b) => a.density - b.density)[0];
  const worstGate = [...gates].sort((a, b) => b.density - a.density)[0];
  const bestStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];
  const bestWashroom = [...washrooms].sort((a, b) => a.waitTime - b.waitTime)[0];

  const getCrowdColor = (crowd) => {
    switch (crowd) {
      case "low": return "from-emerald-500 to-emerald-400";
      case "medium": return "from-amber-500 to-amber-400";
      case "high": return "from-red-500 to-red-400";
      default: return "from-gray-500 to-gray-400";
    }
  };

  const getCrowdBorder = (crowd) => {
    switch (crowd) {
      case "low": return "border-emerald-500/20 bg-emerald-500/5";
      case "medium": return "border-amber-500/20 bg-amber-500/5";
      case "high": return "border-red-500/20 bg-red-500/5";
      default: return "border-gray-500/20 bg-gray-500/5";
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: "🚪", label: "Best Gate", value: bestGate.name, sub: `${bestGate.density}% crowd`, color: "from-blue-500/15 to-blue-600/15", badge: "badge-best", badgeText: "GO" },
          { icon: "🍔", label: "Best Food", value: bestStall.name, sub: `${bestStall.waitTime} min wait`, color: "from-purple-500/15 to-purple-600/15", badge: "badge-best", badgeText: "BEST" },
          { icon: "🚻", label: "Best Washroom", value: bestWashroom.name, sub: `${bestWashroom.waitTime} min wait`, color: "from-cyan-500/15 to-cyan-600/15", badge: "badge-best", badgeText: "FREE" },
          { icon: "⚠️", label: "Avoid", value: worstGate.name, sub: `${worstGate.density}% packed`, color: "from-red-500/10 to-red-600/10", badge: "badge-avoid", badgeText: "AVOID" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className={`glass-card p-4 bg-gradient-to-br ${stat.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-[11px] text-gray-400">{stat.label}</span>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${stat.badge}`}>
                {stat.badgeText}
              </span>
            </div>
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Gates Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="text-base">🚪</span> Gate Crowd Levels
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot" />
            <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gates.map((gate, idx) => {
            const isBest = gate.id === bestGate.id;
            const isWorst = gate.id === worstGate.id;
            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.04 }}
                className={`rounded-xl p-3 border ${getCrowdBorder(gate.crowd)} transition-all duration-700
                  ${isBest ? "ring-1 ring-emerald-500/30" : ""} ${isWorst ? "ring-1 ring-red-500/30" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{gate.name}</span>
                  <div className="flex items-center gap-1">
                    {isBest && <span className="text-[8px] font-bold px-1 py-0.5 rounded badge-best">BEST</span>}
                    {isWorst && <span className="text-[8px] font-bold px-1 py-0.5 rounded badge-avoid">AVOID</span>}
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      gate.crowd === "low" ? "status-low" : gate.crowd === "medium" ? "status-medium" : "status-high"
                    }`}>
                      {gate.crowd}
                    </span>
                  </div>
                </div>
                <div className="progress-bar h-2">
                  <div
                    className={`progress-fill bg-gradient-to-r ${getCrowdColor(gate.crowd)}`}
                    style={{ width: `${gate.density}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-gray-500">{gate.location}</span>
                  <span className={`text-[10px] font-semibold ${
                    gate.crowd === "low" ? "text-emerald-400" : gate.crowd === "medium" ? "text-amber-400" : "text-red-400"
                  }`}>
                    {gate.density}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <QueueList title="🍔 Food Stalls" items={stalls} bestId={bestStall.id} maxWait={30} />
        <QueueList title="🚻 Washrooms" items={washrooms} bestId={bestWashroom.id} maxWait={25} showCrowd />
      </div>
    </div>
  );
}

function QueueList({ title, items, bestId, maxWait, showCrowd }) {
  const sorted = [...items].sort((a, b) => a.waitTime - b.waitTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">{title}</h3>
      <div className="space-y-2.5">
        {sorted.map((item, i) => {
          const isBest = item.id === bestId;
          const waitColor = item.waitTime <= 5 ? "text-emerald-400" : item.waitTime <= 12 ? "text-amber-400" : "text-red-400";
          const barColor = item.waitTime <= 5 ? "from-emerald-500 to-emerald-400" : item.waitTime <= 12 ? "from-amber-500 to-amber-400" : "from-red-500 to-red-400";
          return (
            <div key={item.id} className={`flex items-center gap-3 ${isBest ? "bg-emerald-500/5 rounded-lg p-2 -mx-2 border border-emerald-500/10" : ""}`}>
              <span className="text-xs w-5 text-center">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="text-gray-600">{i + 1}</span>}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-white truncate">{item.name}</span>
                    {isBest && <span className="text-[8px] font-bold px-1 py-0.5 rounded badge-best">BEST</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {showCrowd && item.crowd && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        item.crowd === "low" ? "status-low" : item.crowd === "medium" ? "status-medium" : "status-high"
                      }`}>
                        {item.crowd}
                      </span>
                    )}
                    <span className={`text-xs font-semibold ${waitColor}`}>{item.waitTime} min</span>
                  </div>
                </div>
                <div className="progress-bar h-1.5">
                  <div
                    className={`progress-fill bg-gradient-to-r ${barColor}`}
                    style={{ width: `${Math.min(100, (item.waitTime / maxWait) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">{item.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
