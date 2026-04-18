"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function StadiumMap({ data, userLocation, onSelectLocation }) {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  if (!data) return null;

  const { sections, gates } = data;

  // Stadium is a circle with 12 sections arranged around it
  const cx = 200, cy = 200, r = 155;
  const gateR = 180;

  // Generate section positions around the oval
  const sectionPositions = sections.map((s, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180); // 30 deg each, start from top
    return {
      ...s,
      x: cx + r * 0.75 * Math.cos(angle),
      y: cy + r * 0.75 * Math.sin(angle),
      angle: i * 30,
    };
  });

  // Gate positions (8 gates, spread around)
  const gateAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  const gatePositions = gates.map((g, i) => ({
    ...g,
    x: cx + gateR * Math.cos((gateAngles[i] - 90) * (Math.PI / 180)),
    y: cy + gateR * Math.sin((gateAngles[i] - 90) * (Math.PI / 180)),
  }));

  const getDensityColor = (density) => {
    if (density > 70) return "#ef4444";
    if (density > 40) return "#f59e0b";
    return "#10b981";
  };

  const getDensityOpacity = (density) => {
    return 0.15 + (density / 100) * 0.5;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="text-base">🏟️</span> Interactive Stadium Map
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="relative w-2 h-2 rounded-full bg-emerald-400 live-dot" />
          <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* SVG Map */}
        <div className="flex-1 flex justify-center">
          <svg viewBox="0 0 400 400" className="w-full max-w-md" style={{ filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.1))" }}>
            {/* Stadium rings */}
            <ellipse cx={cx} cy={cy} rx={r + 30} ry={r + 30} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <ellipse cx={cx} cy={cy} rx={r + 10} ry={r + 10} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <ellipse cx={cx} cy={cy} rx={r - 20} ry={r - 20} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

            {/* Playing field */}
            <ellipse cx={cx} cy={cy} rx={55} ry={35} fill="rgba(16, 185, 129, 0.06)" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
            <line x1={cx - 55} y1={cy} x2={cx + 55} y2={cy} stroke="rgba(16,185,129,0.1)" strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r={10} fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="0.5" />
            <text x={cx} y={cy + 3} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="Inter">
              FIELD
            </text>

            {/* Route lines for selected route */}
            {selectedRoute && (
              <line
                x1={selectedRoute.fromPos.x}
                y1={selectedRoute.fromPos.y}
                x2={selectedRoute.toPos.x}
                y2={selectedRoute.toPos.y}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="0.5s" repeatCount="indefinite" />
              </line>
            )}

            {/* User location indicator */}
            {userLocation && sectionPositions.find((s) => s.name === userLocation) && (() => {
              const pos = sectionPositions.find((s) => s.name === userLocation);
              return (
                <g>
                  <circle cx={pos.x} cy={pos.y} r="20" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1" opacity="0.5">
                    <animate attributeName="r" values="20;28;20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })()}

            {/* Section nodes */}
            {sectionPositions.map((section) => {
              const isHovered = hoveredSection === section.id;
              const isUserLoc = userLocation === section.name;
              const color = getDensityColor(section.density);
              const r = isHovered ? 18 : 15;

              return (
                <g
                  key={section.id}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={() => onSelectLocation?.(section.name)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={section.x}
                    cy={section.y}
                    r={r}
                    fill={color}
                    opacity={getDensityOpacity(section.density)}
                    stroke={isUserLoc ? "#3b82f6" : color}
                    strokeWidth={isUserLoc ? "2" : "1"}
                    style={{ transition: "all 0.5s ease" }}
                  />
                  <text
                    x={section.x}
                    y={section.y - 3}
                    textAnchor="middle"
                    fill="white"
                    fontSize="7"
                    fontWeight="600"
                    fontFamily="Inter"
                  >
                    S{section.id}
                  </text>
                  <text
                    x={section.x}
                    y={section.y + 6}
                    textAnchor="middle"
                    fill="white"
                    fontSize="6"
                    opacity="0.7"
                    fontFamily="Inter"
                  >
                    {section.density}%
                  </text>

                  {/* Tooltip */}
                  {isHovered && (
                    <g>
                      <rect
                        x={section.x - 40}
                        y={section.y - 38}
                        width="80"
                        height="20"
                        rx="4"
                        fill="rgba(0,0,0,0.85)"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="0.5"
                      />
                      <text
                        x={section.x}
                        y={section.y - 24}
                        textAnchor="middle"
                        fill="white"
                        fontSize="7"
                        fontFamily="Inter"
                      >
                        {section.name} · {section.density}% · {section.status}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Gate nodes */}
            {gatePositions.map((gate) => {
              const color = getDensityColor(gate.density);
              const isUserLoc = userLocation === gate.name;
              return (
                <g
                  key={gate.id}
                  onClick={() => onSelectLocation?.(gate.name)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={gate.x - 12}
                    y={gate.y - 8}
                    width="24"
                    height="16"
                    rx="3"
                    fill={color}
                    opacity={getDensityOpacity(gate.density) * 0.8}
                    stroke={isUserLoc ? "#3b82f6" : "rgba(255,255,255,0.1)"}
                    strokeWidth={isUserLoc ? "1.5" : "0.5"}
                    style={{ transition: "all 0.5s ease" }}
                  />
                  <text
                    x={gate.x}
                    y={gate.y + 3}
                    textAnchor="middle"
                    fill="white"
                    fontSize="6"
                    fontWeight="500"
                    fontFamily="Inter"
                  >
                    G{gates.indexOf(gate) + 1}
                  </text>
                </g>
              );
            })}

          </svg>
        </div>

        {/* Legend + Info */}
        <div className="lg:w-48 space-y-3">
          {/* Legend */}
          <div className="space-y-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Crowd Level</div>
            {[
              { color: "bg-emerald-500", label: "Low (< 40%)" },
              { color: "bg-amber-500", label: "Medium (40-70%)" },
              { color: "bg-red-500", label: "High (> 70%)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${item.color}`} style={{ opacity: 0.6 }} />
                <span className="text-[11px] text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Symbols */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Symbols</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-white/20" />
              <span className="text-[11px] text-gray-400">Section</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 rounded-sm border border-white/20" />
              <span className="text-[11px] text-gray-400">Gate</span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-blue-400" />
                <span className="text-[11px] text-blue-400">You</span>
              </div>
            )}
          </div>

          {/* Click hint */}
          <div className="pt-2 border-t border-white/5">
            <p className="text-[10px] text-gray-500">Click on any section or gate to set your location</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
