"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function NavigationPanel({ data, userLocation }) {
  const [fromLocation, setFromLocation] = useState(userLocation || "");
  const [toLocation, setToLocation] = useState("");

  if (!data) return null;
  const { routes, gates, sections } = data;

  // Update from when userLocation changes
  if (userLocation && fromLocation !== userLocation && !fromLocation) {
    // Will apply on next render
  }

  const getCombinedCrowd = (a, b) => {
    const scores = { low: 0, medium: 1, high: 2 };
    const avg = ((scores[a] || 0) + (scores[b] || 0)) / 2;
    if (avg < 0.7) return "low";
    if (avg < 1.5) return "medium";
    return "high";
  };

  const getRoutes = () => {
    if (!fromLocation || !toLocation || fromLocation === toLocation) return [];
    const direct = routes.filter(
      (r) => (r.from === fromLocation && r.to === toLocation) || (r.from === toLocation && r.to === fromLocation)
    );
    const indirect = [];
    const fromConns = routes.filter((r) => r.from === fromLocation || r.to === fromLocation);
    for (const first of fromConns) {
      const mid = first.from === fromLocation ? first.to : first.from;
      if (mid === toLocation) continue;
      const second = routes.find(
        (r) => (r.from === mid && r.to === toLocation) || (r.from === toLocation && r.to === mid)
      );
      if (second) {
        indirect.push({
          from: fromLocation, to: toLocation, via: mid,
          distance: first.distance + second.distance,
          time: first.time + second.time,
          crowd: getCombinedCrowd(first.crowd, second.crowd),
          type: "indirect",
        });
      }
    }
    return [
      ...direct.map((r) => ({ ...r, type: "direct", via: null })),
      ...indirect,
    ].sort((a, b) => {
      const s = { low: 0, medium: 1, high: 2 };
      return (s[a.crowd] || 0) - (s[b.crowd] || 0) || a.time - b.time;
    }).slice(0, 5);
  };

  const getCrowdStyle = (crowd) => {
    switch (crowd) {
      case "low": return { bg: "bg-emerald-500/8", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" };
      case "medium": return { bg: "bg-amber-500/8", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" };
      case "high": return { bg: "bg-red-500/8", border: "border-red-500/20", text: "text-red-400", dot: "bg-red-400" };
      default: return { bg: "bg-gray-500/8", border: "border-gray-500/20", text: "text-gray-400", dot: "bg-gray-400" };
    }
  };

  const foundRoutes = getRoutes();

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-base">🧭</span> Smart Navigation
        {userLocation && <span className="text-[10px] text-blue-400 font-normal ml-auto">📍 {userLocation}</span>}
      </h3>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider font-medium">From</label>
          <select
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white
                     focus:outline-none focus:border-blue-500/40 appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900">Select starting point</option>
            <optgroup label="Gates" className="bg-gray-900">
              {gates.map((g) => (
                <option key={g.id} value={g.name} className="bg-gray-900">{g.name} ({g.location})</option>
              ))}
            </optgroup>
            <optgroup label="Sections" className="bg-gray-900">
              {sections.map((s) => (
                <option key={s.id} value={s.name} className="bg-gray-900">{s.name} — {s.density}% full</option>
              ))}
            </optgroup>
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider font-medium">To</label>
          <select
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white
                     focus:outline-none focus:border-blue-500/40 appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900">Select destination</option>
            <optgroup label="Gates" className="bg-gray-900">
              {gates.map((g) => (
                <option key={g.id} value={g.name} className="bg-gray-900">{g.name} ({g.location})</option>
              ))}
            </optgroup>
            <optgroup label="Sections" className="bg-gray-900">
              {sections.map((s) => (
                <option key={s.id} value={s.name} className="bg-gray-900">{s.name} — {s.density}% full</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Routes */}
      {fromLocation && toLocation && fromLocation !== toLocation && (
        <div className="space-y-2.5">
          {foundRoutes.length > 0 ? (
            <>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                {foundRoutes.length} route{foundRoutes.length > 1 ? "s" : ""} found
              </div>
              {foundRoutes.map((route, idx) => {
                const style = getCrowdStyle(route.crowd);
                const isRec = idx === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`rounded-xl p-3 border ${style.bg} ${style.border}
                              ${isRec ? "glow-border ring-1 ring-blue-500/20" : ""}`}
                  >
                    {isRec && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full badge-recommended mb-2 inline-block">
                        ⭐ Recommended
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-sm text-white">
                        <span className="font-medium">{route.from}</span>
                        {route.via ? (
                          <>
                            <span className="text-gray-600">→</span>
                            <span className="text-xs text-gray-500">{route.via}</span>
                            <span className="text-gray-600">→</span>
                          </>
                        ) : (
                          <span className="text-gray-600">→</span>
                        )}
                        <span className="font-medium">{route.to}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                      <span>📏 {route.distance}m</span>
                      <span>⏱️ ~{route.time} min</span>
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        {route.crowd}
                      </span>
                      <span className="text-gray-600">{route.type}</span>
                    </div>
                  </motion.div>
                );
              })}
            </>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">No routes found for this combination.</div>
          )}
        </div>
      )}

      {(!fromLocation || !toLocation) && (
        <div className="text-center py-8 text-gray-600 text-sm">
          <div className="text-2xl mb-2 animate-float">🗺️</div>
          Select a starting point and destination
        </div>
      )}

      {/* Quick tips */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider font-medium">Clear routes right now</div>
        <div className="space-y-1.5">
          {routes.filter((r) => r.crowd === "low").slice(0, 3).map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              {r.from} → {r.to} (~{r.time} min)
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
