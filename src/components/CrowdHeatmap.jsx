"use client";

export default function CrowdHeatmap({ sections }) {
  if (!sections) return null;

  const getDensityColor = (density) => {
    if (density > 80) return "bg-red-500/80";
    if (density > 70) return "bg-red-500/60";
    if (density > 60) return "bg-orange-500/60";
    if (density > 50) return "bg-amber-500/50";
    if (density > 40) return "bg-yellow-500/40";
    if (density > 30) return "bg-lime-500/40";
    if (density > 20) return "bg-emerald-500/40";
    return "bg-emerald-500/30";
  };

  const getDensityBorder = (density) => {
    if (density > 70) return "border-red-500/40";
    if (density > 40) return "border-amber-500/30";
    return "border-emerald-500/30";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "high": return { text: "Packed", color: "text-red-400" };
      case "medium": return { text: "Moderate", color: "text-amber-400" };
      case "low": return { text: "Open", color: "text-emerald-400" };
      default: return { text: "Unknown", color: "text-gray-400" };
    }
  };

  // Arrange sections in a stadium-like oval: top row, sides, bottom row
  const topSections = sections.slice(0, 3);     // 1,2,3
  const rightSections = sections.slice(3, 6);    // 4,5,6
  const bottomSections = sections.slice(6, 9);   // 7,8,9
  const leftSections = sections.slice(9, 12);    // 10,11,12

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-lg">🗺️</span> Stadium Crowd Heatmap
      </h3>

      {/* Stadium Layout */}
      <div className="relative mx-auto max-w-md">
        {/* Stadium oval border */}
        <div className="border-2 border-white/10 rounded-[50%] p-6 aspect-[4/3] flex flex-col justify-between relative">
          {/* Field center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl mb-1">🏟️</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Playing Field</div>
            </div>
          </div>

          {/* Top row */}
          <div className="flex justify-center gap-2 -mt-2 relative z-10">
            {topSections.map((s) => (
              <SectionCell key={s.id} section={s} getDensityColor={getDensityColor} getDensityBorder={getDensityBorder} getStatusLabel={getStatusLabel} />
            ))}
          </div>

          {/* Middle rows (left + right) */}
          <div className="flex justify-between items-center px-0 relative z-10">
            <div className="flex flex-col gap-2">
              {leftSections.map((s) => (
                <SectionCell key={s.id} section={s} getDensityColor={getDensityColor} getDensityBorder={getDensityBorder} getStatusLabel={getStatusLabel} />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {rightSections.map((s) => (
                <SectionCell key={s.id} section={s} getDensityColor={getDensityColor} getDensityBorder={getDensityBorder} getStatusLabel={getStatusLabel} />
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex justify-center gap-2 -mb-2 relative z-10">
            {bottomSections.map((s) => (
              <SectionCell key={s.id} section={s} getDensityColor={getDensityColor} getDensityBorder={getDensityBorder} getStatusLabel={getStatusLabel} />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500/50" />
          <span className="text-[11px] text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500/50" />
          <span className="text-[11px] text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500/50" />
          <span className="text-[11px] text-gray-400">High</span>
        </div>
      </div>
    </div>
  );
}

function SectionCell({ section, getDensityColor, getDensityBorder, getStatusLabel }) {
  const status = getStatusLabel(section.status);
  return (
    <div
      className={`${getDensityColor(section.density)} ${getDensityBorder(section.density)} 
                  border rounded-lg px-2.5 py-1.5 text-center min-w-[70px] 
                  transition-all duration-700 hover:scale-105 cursor-default`}
      title={`${section.name}: ${section.density}% full`}
    >
      <div className="text-[10px] text-white/80 font-medium">S{section.id}</div>
      <div className="text-sm font-bold text-white">{section.density}%</div>
      <div className={`text-[9px] ${status.color} font-medium`}>{status.text}</div>
    </div>
  );
}
