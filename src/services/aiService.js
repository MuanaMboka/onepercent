// ─── AI SERVICE ─────────────────────────────────────────────────────────────
// All Claude API calls go through here. Provides:
// - Strict timeout (15s default) with graceful fallback
// - Retry with exponential backoff (1s, 2s, 4s)
// - Consistent error handling
// - JSON parsing with cleanup

const DEFAULT_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 2;
const MODEL = "claude-sonnet-4-20250514";

class AiServiceError extends Error {
  constructor(message, type = "unknown") {
    super(message);
    this.name = "AiServiceError";
    this.type = type; // "timeout", "network", "parse", "api"
  }
}

/**
 * Make a request to the Claude API via the serverless proxy.
 * @param {Object} options
 * @param {string} options.system - System prompt (optional)
 * @param {Array} options.messages - Message array [{role, content}]
 * @param {number} options.maxTokens - Max tokens for response
 * @param {number} options.timeout - Timeout in ms (default 15000)
 * @param {boolean} options.retry - Whether to retry on failure (default true)
 * @returns {Promise<string>} The text response from Claude
 */
export async function chat({ system, messages, maxTokens = 200, timeout = DEFAULT_TIMEOUT, retry = true }) {
  const body = {
    model: MODEL,
    max_tokens: maxTokens,
    messages,
  };
  if (system) body.system = system;

  let lastError;
  const attempts = retry ? MAX_RETRIES + 1 : 1;

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt > 0) {
      // Exponential backoff: 1s, 2s, 4s
      await sleep(1000 * Math.pow(2, attempt - 1));
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new AiServiceError(`API returned ${res.status}`, "api");
      }

      const data = await res.json();
      const text = data.content?.[0]?.text;

      if (!text) {
        throw new AiServiceError("Empty response from API", "api");
      }

      return text;
    } catch (e) {
      if (e.name === "AbortError") {
        lastError = new AiServiceError("Request timed out", "timeout");
      } else if (e instanceof AiServiceError) {
        lastError = e;
      } else {
        lastError = new AiServiceError(e.message || "Network error", "network");
      }
    }
  }

  throw lastError;
}

/**
 * Make a request and parse the response as JSON.
 * Handles markdown code fences and cleanup.
 */
export async function chatJSON({ system, messages, maxTokens = 1000, timeout = DEFAULT_TIMEOUT, retry = true }) {
  const text = await chat({ system, messages, maxTokens, timeout, retry });
  return parseJSONResponse(text);
}

/**
 * Parse a JSON response, handling markdown code fences.
 */
export function parseJSONResponse(text) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    throw new AiServiceError("Failed to parse JSON response", "parse");
  }
}

/**
 * Check if a coach response contains the [READY] signal.
 * Returns { text, isReady }
 */
export function parseCoachResponse(text) {
  const isReady = text.includes("[READY]");
  const cleanText = text.replace("[READY]", "").trim();
  return { text: cleanText, isReady };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export { AiServiceError };
