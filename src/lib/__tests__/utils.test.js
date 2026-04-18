/**
 * @module utils.test
 * @description Unit tests for shared utility functions.
 * Tests input sanitization, markdown parsing, crowd colors, and formatting.
 */
import {
  sanitizeInput,
  parseMessageText,
  getCrowdGradient,
  getCrowdStyle,
  getWaitTimeColor,
  getCrowdEmoji,
  getStatusBadgeClass,
  formatTime,
  debounce,
} from "@/lib/utils";

describe("sanitizeInput", () => {
  it("should trim and limit length", () => {
    const long = "a".repeat(600);
    expect(sanitizeInput(long)).toHaveLength(500);
  });

  it("should strip HTML tags", () => {
    expect(sanitizeInput("<script>alert('xss')</script>")).toBe("scriptalert('xss')/script");
  });

  it("should strip javascript: protocol", () => {
    expect(sanitizeInput("javascript:alert(1)")).toBe("alert(1)");
  });

  it("should strip event handlers", () => {
    expect(sanitizeInput("onerror=alert(1)")).toBe("alert(1)");
  });

  it("should handle non-string input", () => {
    expect(sanitizeInput(null)).toBe("");
    expect(sanitizeInput(123)).toBe("");
    expect(sanitizeInput(undefined)).toBe("");
  });

  it("should return empty string for whitespace-only input", () => {
    expect(sanitizeInput("   ")).toBe("");
  });
});

describe("parseMessageText", () => {
  it("should parse bold text", () => {
    const result = parseMessageText("Hello **world**!");
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: "text", content: "Hello " });
    expect(result[1]).toEqual({ type: "bold", content: "world" });
    expect(result[2]).toEqual({ type: "text", content: "!" });
  });

  it("should parse italic text", () => {
    const result = parseMessageText("Hello *world*!");
    expect(result).toHaveLength(3);
    expect(result[1]).toEqual({ type: "italic", content: "world" });
  });

  it("should handle plain text", () => {
    const result = parseMessageText("Hello world");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: "text", content: "Hello world" });
  });

  it("should handle empty string", () => {
    const result = parseMessageText("");
    expect(result).toHaveLength(0);
  });
});

describe("getCrowdGradient", () => {
  it("should return green gradient for low", () => {
    expect(getCrowdGradient("low")).toContain("emerald");
  });

  it("should return amber gradient for medium", () => {
    expect(getCrowdGradient("medium")).toContain("amber");
  });

  it("should return red gradient for high", () => {
    expect(getCrowdGradient("high")).toContain("red");
  });

  it("should return gray gradient for unknown", () => {
    expect(getCrowdGradient("unknown")).toContain("gray");
  });
});

describe("getCrowdStyle", () => {
  it("should return complete style object for low", () => {
    const style = getCrowdStyle("low");
    expect(style).toHaveProperty("bg");
    expect(style).toHaveProperty("border");
    expect(style).toHaveProperty("text");
    expect(style).toHaveProperty("dot");
    expect(style.dot).toContain("emerald");
  });
});

describe("getWaitTimeColor", () => {
  it("should return green for short wait", () => {
    expect(getWaitTimeColor(3).text).toContain("emerald");
  });

  it("should return amber for medium wait", () => {
    expect(getWaitTimeColor(10).text).toContain("amber");
  });

  it("should return red for long wait", () => {
    expect(getWaitTimeColor(20).text).toContain("red");
  });
});

describe("getCrowdEmoji", () => {
  it("should return correct emojis", () => {
    expect(getCrowdEmoji("low")).toBe("🟢");
    expect(getCrowdEmoji("medium")).toBe("🟡");
    expect(getCrowdEmoji("high")).toBe("🔴");
    expect(getCrowdEmoji("unknown")).toBe("⚪");
  });
});

describe("getStatusBadgeClass", () => {
  it("should return correct CSS classes", () => {
    expect(getStatusBadgeClass("low")).toBe("status-low");
    expect(getStatusBadgeClass("medium")).toBe("status-medium");
    expect(getStatusBadgeClass("high")).toBe("status-high");
  });
});

describe("formatTime", () => {
  it("should format ISO time string", () => {
    const result = formatTime("2026-01-01T12:30:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("should return empty string for invalid input", () => {
    expect(formatTime("invalid")).toBe("");
  });
});

describe("debounce", () => {
  jest.useFakeTimers();

  it("should delay function execution", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
