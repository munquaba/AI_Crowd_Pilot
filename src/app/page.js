/**
 * @module page
 * @description Main application page for AI Crowd Pilot.
 * Integrates all dashboard views with real-time data, error handling,
 * accessibility, and dynamic imports for performance.
 */
"use client";
import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStadiumData } from "@/hooks/useStadiumData";
import ErrorBoundary from "@/components/ErrorBoundary";
import Dashboard from "@/components/Dashboard";
import AlertBanner from "@/components/AlertBanner";
import SmartRecommendations from "@/components/SmartRecommendations";
import UserLocationSelector from "@/components/UserLocationSelector";

// Dynamic imports for heavy components (efficiency)
const ChatAssistant = lazy(() => import("@/components/ChatAssistant"));
const StadiumMap = lazy(() => import("@/components/StadiumMap"));
const NavigationPanel = lazy(() => import("@/components/NavigationPanel"));
const QueueManagement = lazy(() => import("@/components/QueueManagement"));

/**
 * Navigation items for the main app tabs.
 * @type {Array<{id: string, label: string, icon: string}>}
 */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "map", label: "Map", icon: "🏟️" },
  { id: "navigation", label: "Navigate", icon: "🧭" },
  { id: "queues", label: "Queues", icon: "⏱️" },
];

/**
 * Loading fallback component for Suspense boundaries.
 * @returns {import("react").ReactNode}
 */
function LoadingFallback() {
  return (
    <div className="glass-card p-8 text-center shimmer" role="status" aria-label="Loading">
      <div className="text-2xl mb-2 animate-float">⏳</div>
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}

/**
 * Main Home page component.
 * Manages app state, navigation, user location, and renders all dashboard views.
 */
export default function Home() {
  const { data, loading } = useStadiumData(5000);
  const [activeView, setActiveView] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  /** Memoized callback for toggling chat */
  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  /** Memoized active alerts */
  const activeAlerts = useMemo(() => data?.alerts?.filter((a) => a.active) || [], [data?.alerts]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06060f]" role="status" aria-label="Loading application">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-5xl mb-4"
            aria-hidden="true"
          >
            🏟️
          </motion.div>
          <div className="text-xl font-semibold gradient-text mb-2">AI Crowd Pilot</div>
          <div className="flex items-center gap-2 justify-center text-sm text-gray-500">
            <span className="inline-block w-4 h-4 border-2 border-blue-500/40 border-t-blue-400 rounded-full animate-spin" aria-hidden="true" />
            Connecting to stadium systems...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#06060f]">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-white/6 bg-[#06060f]/90 backdrop-blur-2xl sticky top-0 z-30">
          <div className="max-w-[1600px] mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-lg shadow-lg shadow-purple-500/20" aria-hidden="true">
                  🏟️
                </div>
                <div>
                  <h1 className="text-sm font-bold gradient-text">AI Crowd Pilot</h1>
                  <div className="flex items-center gap-1.5" aria-label="Status: Live updates every 5 seconds">
                    <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" aria-hidden="true" />
                    <span className="text-[10px] text-gray-500">Live — Updates every 5s</span>
                  </div>
                </div>
              </div>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    aria-current={activeView === item.id ? "page" : undefined}
                    aria-label={`${item.label} view`}
                    className={`tab-button flex items-center gap-1.5 ${activeView === item.id ? "active" : ""}`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
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
                  onClick={openChat}
                  aria-label="Open AI Chat Assistant"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-pointer
                           bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/20
                           text-blue-300 hover:from-blue-500/25 hover:to-purple-500/25 transition-all duration-200
                           shadow-lg shadow-blue-500/10"
                >
                  <span aria-hidden="true">🤖</span>
                  <span className="hidden sm:inline text-xs">AI Chat</span>
                </motion.button>
              </div>
            </div>

            {/* Mobile nav */}
            <nav className="flex md:hidden items-center gap-1 mt-2 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  aria-current={activeView === item.id ? "page" : undefined}
                  aria-label={`${item.label} view`}
                  className={`tab-button flex items-center gap-1 whitespace-nowrap text-xs ${activeView === item.id ? "active" : ""}`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main id="main-content" className="flex-1 overflow-y-auto" role="main">
          <div className="max-w-[1200px] mx-auto p-4 lg:p-6 space-y-4">
            {/* Alert — always visible */}
            {activeAlerts.length > 0 && (
              <section aria-label="Stadium alerts" aria-live="polite">
                <AlertBanner alerts={data.alerts} />
              </section>
            )}

            {/* Smart Recommendations — visible on dashboard */}
            {activeView === "dashboard" && (
              <section aria-label="Smart recommendations">
                <ErrorBoundary>
                  <SmartRecommendations data={data} userLocation={userLocation} />
                </ErrorBoundary>
              </section>
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
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    {activeView === "dashboard" && (
                      <section aria-label="Dashboard overview">
                        <Dashboard data={data} />
                      </section>
                    )}
                    {activeView === "map" && (
                      <section aria-label="Interactive stadium map">
                        <StadiumMap
                          data={data}
                          userLocation={userLocation}
                          onSelectLocation={setUserLocation}
                        />
                      </section>
                    )}
                    {activeView === "navigation" && (
                      <section aria-label="Smart navigation">
                        <NavigationPanel data={data} userLocation={userLocation} />
                      </section>
                    )}
                    {activeView === "queues" && (
                      <section aria-label="Queue management">
                        <QueueManagement data={data} />
                      </section>
                    )}
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Floating Chat Button (mobile) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openChat}
          aria-label="Open AI Chat Assistant"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600
                   text-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30
                   hover:shadow-blue-500/50 transition-shadow z-30 cursor-pointer
                   md:hidden animate-pulse-glow"
        >
          <span aria-hidden="true">🤖</span>
        </motion.button>

        {/* Full-screen Chat Modal */}
        <Suspense fallback={null}>
          <ChatAssistant isOpen={chatOpen} onClose={closeChat} />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
