"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStadiumData } from "@/hooks/useStadiumData";
import ChatAssistant from "@/components/ChatAssistant";
import Dashboard from "@/components/Dashboard";
import AlertBanner from "@/components/AlertBanner";
import StadiumMap from "@/components/StadiumMap";
import NavigationPanel from "@/components/NavigationPanel";
import QueueManagement from "@/components/QueueManagement";
import SmartRecommendations from "@/components/SmartRecommendations";
import UserLocationSelector from "@/components/UserLocationSelector";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "map", label: "Map", icon: "🏟️" },
  { id: "navigation", label: "Navigate", icon: "🧭" },
  { id: "queues", label: "Queues", icon: "⏱️" },
];

export default function Home() {
  const { data, loading } = useStadiumData(5000);
  const [activeView, setActiveView] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06060f]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-5xl mb-4"
          >
            🏟️
          </motion.div>
          <div className="text-xl font-semibold gradient-text mb-2">AI Crowd Pilot</div>
          <div className="flex items-center gap-2 justify-center text-sm text-gray-500">
            <span className="inline-block w-4 h-4 border-2 border-blue-500/40 border-t-blue-400 rounded-full animate-spin" />
            Connecting to stadium systems...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#06060f]">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/6 bg-[#06060f]/90 backdrop-blur-2xl sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-lg shadow-lg shadow-purple-500/20">
                🏟️
              </div>
              <div>
                <h1 className="text-sm font-bold gradient-text">AI Crowd Pilot</h1>
                <div className="flex items-center gap-1.5">
                  <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
                  <span className="text-[10px] text-gray-500">Live — Updates every 5s</span>
                </div>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`tab-button flex items-center gap-1.5 ${activeView === item.id ? "active" : ""}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <UserLocationSelector
                sections={data?.sections}
                gates={data?.gates}
                value={userLocation}
                onChange={setUserLocation}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer
                         bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/20
                         text-blue-300 hover:from-blue-500/25 hover:to-purple-500/25 transition-all duration-200
                         shadow-lg shadow-blue-500/10"
              >
                <span>🤖</span>
                <span className="hidden sm:inline text-xs">AI Chat</span>
              </motion.button>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1 mt-2 overflow-x-auto pb-1 -mx-1 px-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`tab-button flex items-center gap-1 whitespace-nowrap text-xs ${activeView === item.id ? "active" : ""}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-4 lg:p-6 space-y-4">
          {/* Alert — always visible */}
          {data?.alerts && <AlertBanner alerts={data.alerts} />}

          {/* Smart Recommendations — visible on dashboard */}
          {activeView === "dashboard" && (
            <SmartRecommendations data={data} userLocation={userLocation} />
          )}

          {/* Active view */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeView === "dashboard" && <Dashboard data={data} />}
              {activeView === "map" && (
                <StadiumMap
                  data={data}
                  userLocation={userLocation}
                  onSelectLocation={setUserLocation}
                />
              )}
              {activeView === "navigation" && (
                <NavigationPanel data={data} userLocation={userLocation} />
              )}
              {activeView === "queues" && <QueueManagement data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600
                 text-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30
                 hover:shadow-blue-500/50 transition-shadow z-30 cursor-pointer
                 md:hidden animate-pulse-glow"
      >
        🤖
      </motion.button>

      {/* Full-screen Chat Modal */}
      <ChatAssistant isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
