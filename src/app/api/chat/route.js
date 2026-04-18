/**
 * @module chat/route
 * @description AI Chat API endpoint for the AI Crowd Pilot application.
 * Handles user queries with intent detection, rate limiting, and input sanitization.
 * Returns contextual, data-driven recommendations based on real-time stadium data.
 */
import { NextResponse } from "next/server";
import { getCurrentDataSnapshot } from "@/data/stadiumData";
import { sanitizeInput, getCrowdEmoji } from "@/lib/utils";

/**
 * In-memory rate limiter. Tracks request timestamps per IP.
 * Allows MAX_REQUESTS per WINDOW_MS milliseconds.
 * @type {Map<string, number[]>}
 */
const rateLimitMap = new Map();
const MAX_REQUESTS = 20;
const WINDOW_MS = 60_000; // 1 minute

/**
 * Checks if a given IP has exceeded the rate limit.
 * @param {string} ip - Client IP address
 * @returns {boolean} True if rate limited
 */
function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  return false;
}

/**
 * Intent detection keyword map.
 * Maps user intent categories to their associated keywords.
 * @type {Record<string, string[]>}
 */
const INTENTS = {
  navigation: ["navigate", "route", "direction", "way", "reach", "get to", "go to", "path", "how to reach", "where is gate", "find gate", "exit"],
  food: ["food", "eat", "hungry", "stall", "restaurant", "snack", "burger", "pizza", "taco", "noodle", "hot dog", "ice cream", "drink", "menu"],
  washroom: ["washroom", "bathroom", "restroom", "toilet", "loo", "lavatory", "wc"],
  queue: ["queue", "wait", "line", "waiting time", "shortest", "fastest", "least crowded", "busy"],
  crowd: ["crowd", "crowded", "packed", "empty", "density", "busy", "congested", "section"],
  gate: ["gate", "entry", "entrance", "exit", "leave", "depart"],
  help: ["help", "what can you do", "assist", "features", "commands"],
};

/**
 * Detects user intent by scoring keywords against the message.
 * @param {string} message - User's chat message
 * @returns {string} Detected intent category or "general"
 */
function detectIntent(message) {
  const lower = message.toLowerCase();
  const scores = {};

  for (const [intent, keywords] of Object.entries(INTENTS)) {
    scores[intent] = keywords.reduce((score, keyword) => {
      return score + (lower.includes(keyword) ? 1 : 0);
    }, 0);
  }

  const bestIntent = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a));
  if (bestIntent[1] === 0) return "general";
  return bestIntent[0];
}

/**
 * Generates a contextual response based on intent and real-time stadium data.
 * @param {string} intent - Detected intent category
 * @param {string} message - Original user message
 * @param {object} data - Current stadium data snapshot
 * @returns {string} Formatted response string with markdown
 */
function generateResponse(intent, message, data) {
  const lower = message.toLowerCase();

  switch (intent) {
    case "navigation": {
      let fromLocation = null;
      let toLocation = null;

      for (const gate of data.gates) {
        if (lower.includes(gate.name.toLowerCase())) {
          if (!fromLocation) fromLocation = gate.name;
          else toLocation = gate.name;
        }
      }
      for (const section of data.sections) {
        if (lower.includes(section.name.toLowerCase())) {
          if (!fromLocation) fromLocation = section.name;
          else toLocation = section.name;
        }
      }

      if (toLocation || fromLocation) {
        const target = toLocation || fromLocation;
        const relevantRoutes = data.routes
          .filter((r) => r.from === target || r.to === target)
          .sort((a, b) => {
            const crowdScore = { low: 0, medium: 1, high: 2 };
            return crowdScore[a.crowd] - crowdScore[b.crowd] || a.time - b.time;
          });

        if (relevantRoutes.length > 0) {
          const best = relevantRoutes[0];
          const alternatives = relevantRoutes.slice(1, 3);
          let response = `🧭 **Best route to ${target}:**\n\n`;
          response += `➡️ From **${best.from}** → **${best.to}** (${best.distance}m, ~${best.time} min, crowd: ${getCrowdEmoji(best.crowd)} ${best.crowd})\n\n`;
          if (alternatives.length > 0) {
            response += `📋 **Alternative routes:**\n`;
            alternatives.forEach((r) => {
              response += `• ${r.from} → ${r.to} (${r.distance}m, ~${r.time} min, crowd: ${getCrowdEmoji(r.crowd)} ${r.crowd})\n`;
            });
          }
          response += `\n💡 *I recommend the top route — it has less crowd even if slightly longer.*`;
          return response;
        }
      }

      const leastCrowdedGate = data.gates.reduce((a, b) => (a.density < b.density ? a : b));
      const leastCrowdedRoutes = data.routes.filter((r) => r.crowd === "low").slice(0, 3);
      let response = `🧭 **Navigation Suggestions:**\n\n`;
      response += `🟢 **Best gate for entry/exit:** ${leastCrowdedGate.name} (${leastCrowdedGate.location}, ${leastCrowdedGate.density}% crowd)\n\n`;
      if (leastCrowdedRoutes.length > 0) {
        response += `📋 **Low-crowd routes right now:**\n`;
        leastCrowdedRoutes.forEach((r) => {
          response += `• ${r.from} → ${r.to} (~${r.time} min)\n`;
        });
      }
      response += `\n💡 *Tell me your current location and destination for a personalized route!*`;
      return response;
    }

    case "food": {
      const sortedStalls = [...data.stalls].sort((a, b) => a.waitTime - b.waitTime);
      const best = sortedStalls[0];
      let response = `🍔 **Food Stall Recommendations:**\n\n`;
      response += `⭐ **Best option: ${best.name}** (${best.location})\n`;
      response += `⏱️ Wait time: only **${best.waitTime} min**\n`;
      response += `📋 Menu: ${best.menu.join(", ")}\n\n`;
      response += `📊 **All food stalls by wait time:**\n`;
      sortedStalls.forEach((s, i) => {
        const icon = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "•";
        response += `${icon} ${s.name} — ${s.waitTime} min (${s.location})\n`;
      });
      response += `\n💡 *I recommend **${best.name}** for the fastest service!*`;
      return response;
    }

    case "washroom": {
      const sortedWashrooms = [...data.washrooms].sort((a, b) => a.waitTime - b.waitTime);
      const best = sortedWashrooms[0];
      let response = `🚻 **Nearest Available Washroom:**\n\n`;
      response += `⭐ **Best option: ${best.name}** (${best.location})\n`;
      response += `⏱️ Wait time: **${best.waitTime} min** | Crowd: ${getCrowdEmoji(best.crowd)} ${best.crowd}\n\n`;
      response += `📊 **All washrooms by wait time:**\n`;
      sortedWashrooms.forEach((w, i) => {
        const icon = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "•";
        response += `${icon} ${w.name} — ${w.waitTime} min, ${getCrowdEmoji(w.crowd)} ${w.crowd} (${w.location})\n`;
      });
      response += `\n💡 *Head to **${best.name}** for the shortest wait!*`;
      return response;
    }

    case "queue": {
      const sortedStalls = [...data.stalls].sort((a, b) => a.waitTime - b.waitTime);
      const sortedWashrooms = [...data.washrooms].sort((a, b) => a.waitTime - b.waitTime);
      let response = `⏱️ **Queue Status Overview:**\n\n`;
      response += `🍔 **Food Stalls (by wait time):**\n`;
      sortedStalls.forEach((s) => {
        response += `• ${s.name}: ${s.waitTime} min (${s.location})\n`;
      });
      response += `\n🚻 **Washrooms (by wait time):**\n`;
      sortedWashrooms.forEach((w) => {
        response += `• ${w.name}: ${w.waitTime} min (${w.location})\n`;
      });
      response += `\n💡 *Best food: **${sortedStalls[0].name}** (${sortedStalls[0].waitTime} min) | Best washroom: **${sortedWashrooms[0].name}** (${sortedWashrooms[0].waitTime} min)*`;
      return response;
    }

    case "crowd": {
      const sortedSections = [...data.sections].sort((a, b) => a.density - b.density);
      const leastCrowded = sortedSections.slice(0, 3);
      const mostCrowded = sortedSections.slice(-3).reverse();
      let response = `👥 **Crowd Density Report:**\n\n`;
      response += `🟢 **Least Crowded Sections:**\n`;
      leastCrowded.forEach((s) => {
        response += `• ${s.name}: ${s.density}% (${getCrowdEmoji(s.status)} ${s.status})\n`;
      });
      response += `\n🔴 **Most Crowded Sections:**\n`;
      mostCrowded.forEach((s) => {
        response += `• ${s.name}: ${s.density}% (${getCrowdEmoji(s.status)} ${s.status})\n`;
      });
      response += `\n💡 *Consider moving to ${leastCrowded[0].name} for the most space!*`;
      return response;
    }

    case "gate": {
      const sortedGates = [...data.gates].sort((a, b) => a.density - b.density);
      const best = sortedGates[0];
      let response = `🚪 **Gate Status:**\n\n`;
      response += `⭐ **Recommended: ${best.name}** (${best.location})\n`;
      response += `👥 Crowd: ${getCrowdEmoji(best.crowd)} ${best.density}%\n\n`;
      response += `📊 **All gates by crowd level:**\n`;
      sortedGates.forEach((g) => {
        response += `• ${g.name} (${g.location}): ${getCrowdEmoji(g.crowd)} ${g.density}%\n`;
      });
      response += `\n💡 *Use **${best.name}** for the fastest entry/exit!*`;
      return response;
    }

    case "help": {
      return `👋 **Hi! I'm your AI Crowd Pilot!**\n\nI can help you with:\n\n🧭 **Navigation** — "How do I get to Gate 3?" or "Best route to Section 5"\n🍔 **Food** — "Which food stall has the shortest queue?" or "Where can I get pizza?"\n🚻 **Washrooms** — "Where is the nearest washroom?" or "Least crowded restroom"\n🚪 **Gates** — "Which gate should I use to exit?" or "Gate with least crowd"\n👥 **Crowd Info** — "Which section is least crowded?" or "Crowd density report"\n⏱️ **Queues** — "Current wait times" or "Shortest queue"\n\n💡 *Just type your question naturally and I'll help you out!*`;
    }

    default: {
      const bestGate = data.gates.reduce((a, b) => (a.density < b.density ? a : b));
      const bestStall = data.stalls.reduce((a, b) => (a.waitTime < b.waitTime ? a : b));
      const bestWashroom = data.washrooms.reduce((a, b) => (a.waitTime < b.waitTime ? a : b));
      let response = `🏟️ **Quick Stadium Overview:**\n\n`;
      response += `🚪 Best gate: **${bestGate.name}** (${bestGate.density}% crowd)\n`;
      response += `🍔 Best food: **${bestStall.name}** (${bestStall.waitTime} min wait)\n`;
      response += `🚻 Best washroom: **${bestWashroom.name}** (${bestWashroom.waitTime} min wait)\n\n`;
      response += `💡 *Ask me about navigation, food, washrooms, crowd levels, or gates for detailed info!*`;
      return response;
    }
  }
}

/**
 * POST handler for the chat API endpoint.
 * Validates input, applies rate limiting, detects intent, and returns a response.
 * @param {Request} request - Incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with AI message
 */
export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawMessage = body?.message;

    // Input validation
    if (!rawMessage || typeof rawMessage !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string." },
        { status: 400 }
      );
    }

    // Sanitize input
    const message = sanitizeInput(rawMessage, 500);
    if (message.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    const data = getCurrentDataSnapshot();
    const intent = detectIntent(message);
    const response = generateResponse(intent, message, data);

    // Simulate slight delay for realism
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700));

    return NextResponse.json({
      response,
      intent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Chat API Error]:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 }
    );
  }
}
