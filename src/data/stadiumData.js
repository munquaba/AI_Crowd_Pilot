// Mock Stadium Data with real-time simulation capabilities

const initialData = {
  gates: [
    { id: "gate-1", name: "Gate 1", crowd: "high", density: 85, location: "North", coordinates: { x: 50, y: 5 } },
    { id: "gate-2", name: "Gate 2", crowd: "medium", density: 55, location: "North-East", coordinates: { x: 85, y: 20 } },
    { id: "gate-3", name: "Gate 3", crowd: "low", density: 25, location: "East", coordinates: { x: 95, y: 50 } },
    { id: "gate-4", name: "Gate 4", crowd: "medium", density: 60, location: "South-East", coordinates: { x: 85, y: 80 } },
    { id: "gate-5", name: "Gate 5", crowd: "high", density: 90, location: "South", coordinates: { x: 50, y: 95 } },
    { id: "gate-6", name: "Gate 6", crowd: "low", density: 20, location: "South-West", coordinates: { x: 15, y: 80 } },
    { id: "gate-7", name: "Gate 7", crowd: "medium", density: 45, location: "West", coordinates: { x: 5, y: 50 } },
    { id: "gate-8", name: "Gate 8", crowd: "low", density: 30, location: "North-West", coordinates: { x: 15, y: 20 } },
  ],

  stalls: [
    { id: "stall-a", name: "Burger Barn", type: "food", waitTime: 20, location: "Section 1", section: 1, menu: ["Burgers", "Fries", "Shakes"] },
    { id: "stall-b", name: "Pizza Palace", type: "food", waitTime: 5, location: "Section 3", section: 3, menu: ["Pizza", "Garlic Bread", "Soda"] },
    { id: "stall-c", name: "Taco Town", type: "food", waitTime: 12, location: "Section 5", section: 5, menu: ["Tacos", "Nachos", "Burritos"] },
    { id: "stall-d", name: "Noodle House", type: "food", waitTime: 8, location: "Section 7", section: 7, menu: ["Ramen", "Stir Fry", "Spring Rolls"] },
    { id: "stall-e", name: "Hot Dog Haven", type: "food", waitTime: 3, location: "Section 9", section: 9, menu: ["Hot Dogs", "Pretzels", "Lemonade"] },
    { id: "stall-f", name: "Ice Cream Island", type: "food", waitTime: 15, location: "Section 11", section: 11, menu: ["Ice Cream", "Waffles", "Smoothies"] },
  ],

  washrooms: [
    { id: "wr-1", name: "Washroom A", waitTime: 5, location: "Section 1", section: 1, crowd: "low", capacity: 20 },
    { id: "wr-2", name: "Washroom B", waitTime: 12, location: "Section 3", section: 3, crowd: "medium", capacity: 15 },
    { id: "wr-3", name: "Washroom C", waitTime: 3, location: "Section 5", section: 5, crowd: "low", capacity: 25 },
    { id: "wr-4", name: "Washroom D", waitTime: 18, location: "Section 7", section: 7, crowd: "high", capacity: 10 },
    { id: "wr-5", name: "Washroom E", waitTime: 8, location: "Section 9", section: 9, crowd: "medium", capacity: 20 },
    { id: "wr-6", name: "Washroom F", waitTime: 2, location: "Section 11", section: 11, crowd: "low", capacity: 30 },
  ],

  sections: [
    { id: 1, name: "Section 1", density: 75, status: "high" },
    { id: 2, name: "Section 2", density: 40, status: "medium" },
    { id: 3, name: "Section 3", density: 60, status: "medium" },
    { id: 4, name: "Section 4", density: 30, status: "low" },
    { id: 5, name: "Section 5", density: 85, status: "high" },
    { id: 6, name: "Section 6", density: 20, status: "low" },
    { id: 7, name: "Section 7", density: 55, status: "medium" },
    { id: 8, name: "Section 8", density: 90, status: "high" },
    { id: 9, name: "Section 9", density: 35, status: "low" },
    { id: 10, name: "Section 10", density: 70, status: "high" },
    { id: 11, name: "Section 11", density: 25, status: "low" },
    { id: 12, name: "Section 12", density: 50, status: "medium" },
  ],

  routes: [
    { from: "Gate 1", to: "Section 1", distance: 120, crowd: "high", time: 8 },
    { from: "Gate 1", to: "Section 2", distance: 200, crowd: "medium", time: 10 },
    { from: "Gate 2", to: "Section 3", distance: 100, crowd: "low", time: 5 },
    { from: "Gate 2", to: "Section 4", distance: 180, crowd: "low", time: 7 },
    { from: "Gate 3", to: "Section 5", distance: 150, crowd: "medium", time: 8 },
    { from: "Gate 3", to: "Section 6", distance: 90, crowd: "low", time: 4 },
    { from: "Gate 4", to: "Section 7", distance: 130, crowd: "medium", time: 7 },
    { from: "Gate 4", to: "Section 8", distance: 170, crowd: "high", time: 12 },
    { from: "Gate 5", to: "Section 9", distance: 110, crowd: "low", time: 5 },
    { from: "Gate 5", to: "Section 10", distance: 200, crowd: "high", time: 14 },
    { from: "Gate 6", to: "Section 11", distance: 80, crowd: "low", time: 3 },
    { from: "Gate 6", to: "Section 12", distance: 160, crowd: "medium", time: 8 },
    { from: "Gate 7", to: "Section 1", distance: 190, crowd: "medium", time: 9 },
    { from: "Gate 7", to: "Section 12", distance: 100, crowd: "low", time: 5 },
    { from: "Gate 8", to: "Section 2", distance: 95, crowd: "low", time: 4 },
    { from: "Gate 8", to: "Section 11", distance: 210, crowd: "medium", time: 10 },
    { from: "Section 1", to: "Section 2", distance: 60, crowd: "medium", time: 3 },
    { from: "Section 2", to: "Section 3", distance: 60, crowd: "low", time: 3 },
    { from: "Section 3", to: "Section 4", distance: 60, crowd: "low", time: 2 },
    { from: "Section 4", to: "Section 5", distance: 60, crowd: "medium", time: 3 },
    { from: "Section 5", to: "Section 6", distance: 60, crowd: "high", time: 5 },
    { from: "Section 6", to: "Section 7", distance: 60, crowd: "low", time: 2 },
    { from: "Section 7", to: "Section 8", distance: 60, crowd: "medium", time: 3 },
    { from: "Section 8", to: "Section 9", distance: 60, crowd: "high", time: 5 },
    { from: "Section 9", to: "Section 10", distance: 60, crowd: "low", time: 2 },
    { from: "Section 10", to: "Section 11", distance: 60, crowd: "medium", time: 3 },
    { from: "Section 11", to: "Section 12", distance: 60, crowd: "low", time: 2 },
    { from: "Section 12", to: "Section 1", distance: 60, crowd: "medium", time: 3 },
  ],

  alerts: [
    { id: 1, type: "warning", message: "Gate 1 is overcrowded — use Gate 8 for faster entry", active: true, priority: "high" },
    { id: 2, type: "info", message: "Hot Dog Haven (Section 9) has the shortest food queue — only 3 min wait!", active: true, priority: "medium" },
    { id: 3, type: "warning", message: "Washroom D is at full capacity — try Washroom F in Section 11", active: true, priority: "high" },
    { id: 4, type: "info", message: "Gate 6 has smooth entry flow — recommended for late arrivals", active: true, priority: "low" },
    { id: 5, type: "success", message: "Section 6 has plenty of open seats available", active: true, priority: "low" },
  ],
};

// Deep clone utility
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Simulate real-time changes
function simulateChanges(data) {
  const updated = deepClone(data);

  // Randomly adjust gate crowd densities
  updated.gates.forEach((gate) => {
    gate.density = Math.max(5, Math.min(98, gate.density + Math.floor(Math.random() * 21) - 10));
    if (gate.density > 70) gate.crowd = "high";
    else if (gate.density > 40) gate.crowd = "medium";
    else gate.crowd = "low";
  });

  // Randomly adjust stall wait times
  updated.stalls.forEach((stall) => {
    stall.waitTime = Math.max(1, Math.min(30, stall.waitTime + Math.floor(Math.random() * 11) - 5));
  });

  // Randomly adjust washroom wait times
  updated.washrooms.forEach((wr) => {
    wr.waitTime = Math.max(1, Math.min(25, wr.waitTime + Math.floor(Math.random() * 9) - 4));
    if (wr.waitTime > 12) wr.crowd = "high";
    else if (wr.waitTime > 6) wr.crowd = "medium";
    else wr.crowd = "low";
  });

  // Randomly adjust section densities
  updated.sections.forEach((section) => {
    section.density = Math.max(5, Math.min(98, section.density + Math.floor(Math.random() * 15) - 7));
    if (section.density > 70) section.status = "high";
    else if (section.density > 40) section.status = "medium";
    else section.status = "low";
  });

  // Update route crowd levels based on connected sections
  updated.routes.forEach((route) => {
    const roll = Math.random();
    if (roll < 0.3) route.crowd = "high";
    else if (roll < 0.6) route.crowd = "medium";
    else route.crowd = "low";
    route.time = route.crowd === "high" ? Math.ceil(route.distance / 15) : route.crowd === "medium" ? Math.ceil(route.distance / 20) : Math.ceil(route.distance / 30);
  });

  // Regenerate alerts based on current state
  const newAlerts = [];
  const mostCrowdedGate = updated.gates.reduce((a, b) => (a.density > b.density ? a : b));
  const leastCrowdedGate = updated.gates.reduce((a, b) => (a.density < b.density ? a : b));
  newAlerts.push({
    id: 1, type: "warning", priority: "high", active: true,
    message: `${mostCrowdedGate.name} is overcrowded (${mostCrowdedGate.density}%) — use ${leastCrowdedGate.name} instead`,
  });

  const bestStall = updated.stalls.reduce((a, b) => (a.waitTime < b.waitTime ? a : b));
  newAlerts.push({
    id: 2, type: "info", priority: "medium", active: true,
    message: `${bestStall.name} (${bestStall.location}) has the shortest food queue — only ${bestStall.waitTime} min wait!`,
  });

  const worstWashroom = updated.washrooms.reduce((a, b) => (a.waitTime > b.waitTime ? a : b));
  const bestWashroom = updated.washrooms.reduce((a, b) => (a.waitTime < b.waitTime ? a : b));
  newAlerts.push({
    id: 3, type: "warning", priority: "high", active: true,
    message: `${worstWashroom.name} has long queue (${worstWashroom.waitTime} min) — try ${bestWashroom.name} in ${bestWashroom.location}`,
  });

  const bestSection = updated.sections.reduce((a, b) => (a.density < b.density ? a : b));
  newAlerts.push({
    id: 4, type: "success", priority: "low", active: true,
    message: `${bestSection.name} has plenty of open seats (${bestSection.density}% full)`,
  });

  newAlerts.push({
    id: 5, type: "info", priority: "low", active: true,
    message: `${leastCrowdedGate.name} has smooth entry flow — recommended for arrivals`,
  });

  updated.alerts = newAlerts;
  return updated;
}

// Server-side state (persists across requests within the same server instance)
let currentData = deepClone(initialData);

export function getStadiumData() {
  currentData = simulateChanges(currentData);
  return deepClone(currentData);
}

export function getCurrentDataSnapshot() {
  return deepClone(currentData);
}
