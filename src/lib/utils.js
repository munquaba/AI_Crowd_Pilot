/**
 * @module utils
 * @description Shared utility functions for the AI Crowd Pilot application.
 * Provides consistent formatting, color mappings, and helper functions
 * used across multiple components.
 */

/**
 * Returns Tailwind gradient classes based on crowd level.
 * @param {"low"|"medium"|"high"} crowd - The crowd density level
 * @returns {string} Tailwind gradient classes for progress bar fills
 */
export function getCrowdGradient(crowd) {
  switch (crowd) {
    case "low": return "from-emerald-500 to-emerald-400";
    case "medium": return "from-amber-500 to-amber-400";
    case "high": return "from-red-500 to-red-400";
    default: return "from-gray-500 to-gray-400";
  }
}

/**
 * Returns Tailwind border + background classes for crowd-styled cards.
 * @param {"low"|"medium"|"high"} crowd - The crowd density level
 * @returns {string} Tailwind border and background classes
 */
export function getCrowdBorder(crowd) {
  switch (crowd) {
    case "low": return "border-emerald-500/20 bg-emerald-500/5";
    case "medium": return "border-amber-500/20 bg-amber-500/5";
    case "high": return "border-red-500/20 bg-red-500/5";
    default: return "border-gray-500/20 bg-gray-500/5";
  }
}

/**
 * Returns a styled object with bg, border, text, and dot color properties.
 * @param {"low"|"medium"|"high"} crowd - The crowd density level
 * @returns {{ bg: string, border: string, text: string, dot: string }}
 */
export function getCrowdStyle(crowd) {
  switch (crowd) {
    case "low": return { bg: "bg-emerald-500/8", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" };
    case "medium": return { bg: "bg-amber-500/8", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" };
    case "high": return { bg: "bg-red-500/8", border: "border-red-500/20", text: "text-red-400", dot: "bg-red-400" };
    default: return { bg: "bg-gray-500/8", border: "border-gray-500/20", text: "text-gray-400", dot: "bg-gray-400" };
  }
}

/**
 * Returns text color class based on wait time thresholds.
 * @param {number} waitTime - Wait time in minutes
 * @returns {{ text: string, bg: string, bar: string }} Color classes
 */
export function getWaitTimeColor(waitTime) {
  if (waitTime <= 5) return { text: "text-emerald-400", bg: "bg-emerald-500", bar: "from-emerald-500 to-emerald-400" };
  if (waitTime <= 12) return { text: "text-amber-400", bg: "bg-amber-500", bar: "from-amber-500 to-amber-400" };
  return { text: "text-red-400", bg: "bg-red-500", bar: "from-red-500 to-red-400" };
}

/**
 * Returns a crowd emoji based on level.
 * @param {"low"|"medium"|"high"} crowd - The crowd density level
 * @returns {string} Emoji representation
 */
export function getCrowdEmoji(crowd) {
  switch (crowd) {
    case "low": return "🟢";
    case "medium": return "🟡";
    case "high": return "🔴";
    default: return "⚪";
  }
}

/**
 * Returns the status badge CSS class name.
 * @param {"low"|"medium"|"high"} crowd - The crowd density level
 * @returns {string} CSS class for status badge
 */
export function getStatusBadgeClass(crowd) {
  switch (crowd) {
    case "low": return "status-low";
    case "medium": return "status-medium";
    case "high": return "status-high";
    default: return "";
  }
}

/**
 * Sanitizes user input by removing potentially dangerous characters.
 * Prevents XSS and injection attacks in chat messages.
 * @param {string} input - Raw user input
 * @param {number} [maxLength=500] - Maximum allowed length
 * @returns {string} Sanitized input string
 */
export function sanitizeInput(input, maxLength = 500) {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, "") // Strip HTML tags
    .replace(/javascript:/gi, "") // Strip JS protocol
    .replace(/on\w+=/gi, ""); // Strip event handlers
}

/**
 * Safely renders markdown-like text without dangerouslySetInnerHTML.
 * Converts **bold** and *italic* markers to React elements.
 * @param {string} text - Text with markdown formatting
 * @returns {import("react").ReactNode[]} Array of React elements
 */
export function parseMessageText(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    if (match[2]) {
      parts.push({ type: "bold", content: match[2] });
    } else if (match[3]) {
      parts.push({ type: "italic", content: match[3] });
    }
    lastIndex = match.index + match[0].length;
  }
  // Remaining text
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }
  return parts;
}

/**
 * Formats a timestamp to a short time string (HH:MM).
 * @param {string} isoString - ISO 8601 timestamp string
 * @returns {string} Formatted time string
 */
export function formatTime(isoString) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

/**
 * Creates a debounced version of a function.
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
