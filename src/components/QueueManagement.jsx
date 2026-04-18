"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function QueueManagement({ data }) {
  const [activeTab, setActiveTab] = useState("food");
  const [sortBy, setSortBy] = useState("waitTime");

  if (!data) return null;
  const { stalls, washrooms } = data;
  const items = activeTab === "food" ? stalls : washrooms;

  const sorted = [...items].sort((a, b) => {
    if (sortBy === "waitTime") return a.waitTime - b.waitTime;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const bestItem = [...items].sort((a, b) => a.waitTime - b.waitTime)[0];
  const worstItem = [...items].sort((a, b) => b.waitTime - a.waitTime)[0];

  const getWaitColor = (wt) => {
    if (wt <= 5) return { text: "text-emerald-400", bg: "bg-emerald-500", bar: "from-emerald-500 to-emerald-400" };
    if (wt <= 12) return { text: "text-amber-400", bg: "bg-amber-500", bar: "from-amber-500 to-amber-400" };
    return { text: "text-red-400", bg: "bg-red-500", bar: "from-red-500 to-red-400" };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="text-base">⏱️</span> Queue Management
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot" />
            <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-[10px] bg-white/5 border border-white/8 rounded-lg px-2 py-1 text-gray-400
                     focus:outline-none cursor-pointer appearance-none"
          >
            <option value="waitTime" className="bg-gray-900">Wait Time</option>
            <option value="name" className="bg-gray-900">Name</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("food")}
          className={`tab-button ${activeTab === "food" ? "active" : ""}`}
        >🍔 Food Stalls</button>
        <button
          onClick={() => setActiveTab("washroom")}
          className={`tab-button ${activeTab === "washroom" ? "active" : ""}`}
        >🚻 Washrooms</button>
      </div>

      {/* Best / Worst summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="insight-card p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full badge-best inline-block mb-1.5">
            GO NOW
          </span>
          <div className="text-sm font-medium text-white">{bestItem?.name}</div>
          <div className="text-[11px] text-gray-400">{bestItem?.waitTime} min · {bestItem?.location}</div>
        </div>
        <div className="insight-card-warning p-3">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full badge-avoid inline-block mb-1.5">
            SKIP
          </span>
          <div className="text-sm font-medium text-white">{worstItem?.name}</div>
          <div className="text-[11px] text-gray-400">{worstItem?.waitTime} min · {worstItem?.location}</div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {sorted.map((item, idx) => {
          const isBest = item.id === bestItem?.id;
          const isWorst = item.id === worstItem?.id;
          const colors = getWaitColor(item.waitTime);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl p-3 border transition-all duration-300
                ${isBest ? "bg-emerald-500/5 border-emerald-500/15 ring-1 ring-emerald-500/20" :
                  isWorst ? "bg-red-500/5 border-red-500/10" :
                  "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs w-5 text-center">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : <span className="text-gray-600">{idx + 1}</span>}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-white">{item.name}</span>
                      {isBest && <span className="text-[8px] font-bold px-1 py-0.5 rounded badge-best">BEST</span>}
                      {isWorst && <span className="text-[8px] font-bold px-1 py-0.5 rounded badge-avoid">AVOID</span>}
                    </div>
                    <span className="text-[10px] text-gray-500">{item.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-base font-bold ${colors.text}`}>{item.waitTime} min</div>
                  {item.crowd && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      item.crowd === "low" ? "status-low" : item.crowd === "medium" ? "status-medium" : "status-high"
                    }`}>
                      {item.crowd}
                    </span>
                  )}
                </div>
              </div>
              <div className="progress-bar h-1.5 mt-1">
                <div
                  className={`progress-fill bg-gradient-to-r ${colors.bar}`}
                  style={{ width: `${Math.min(100, (item.waitTime / (activeTab === "food" ? 30 : 25)) * 100)}%` }}
                />
              </div>
              {item.menu && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.menu.map((m, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{m}</span>
                  ))}
                </div>
              )}
              {item.capacity && (
                <div className="mt-1.5 text-[10px] text-gray-500">Capacity: {item.capacity}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
