// ─── EVENT SERVICE ──────────────────────────────────────────────────────────
// Client-side analytics event bus for retention tracking.
// Events are queued locally and can be synced to server later.
//
// Event types: session_start, session_end, screen_view, habit_complete,
//              checkin_submit, plan_generated, notification_received, paywall_impression

const QUEUE_KEY = "onepercent_events";
const MAX_QUEUE_SIZE = 500;
const SCHEMA_VERSION = 1;

/**
 * Track an analytics event.
 * @param {string} eventType - One of the defined event types
 * @param {Object} metadata - Type-specific metadata
 */
export function track(eventType, metadata = {}) {
  const event = {
    id: generateUUID(),
    event_type: eventType,
    metadata,
    client_timestamp: new Date().toISOString(),
    schema_version: SCHEMA_VERSION,
  };

  const queue = getQueue();

  // Enforce max queue size — drop oldest if exceeded
  if (queue.length >= MAX_QUEUE_SIZE) {
    queue.splice(0, queue.length - MAX_QUEUE_SIZE + 1);
  }

  queue.push(event);
  saveQueue(queue);

  return event;
}

/**
 * Track a screen view.
 */
export function trackScreenView(screenName, source = "navigation") {
  return track("screen_view", { screen_name: screenName, source });
}

/**
 * Track a habit completion.
 */
export function trackHabitComplete(habitId, status, timeSlot) {
  return track("habit_complete", { habit_id: habitId, status, time_slot: timeSlot });
}

/**
 * Track a check-in submission.
 */
export function trackCheckin(mood, noteLength, dayNumber) {
  return track("checkin_submit", { mood, note_length: noteLength, day_number: dayNumber });
}

/**
 * Track session start.
 */
export function trackSessionStart() {
  return track("session_start", {
    device: "pwa",
    app_version: "1.2",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

/**
 * Track session end.
 * @param {number} durationSeconds
 * @param {string[]} screensVisited
 */
export function trackSessionEnd(durationSeconds, screensVisited = []) {
  return track("session_end", {
    duration_seconds: durationSeconds,
    screens_visited: screensVisited,
  });
}

/**
 * Get the current event queue.
 */
export function getQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Get queue size.
 */
export function getQueueSize() {
  return getQueue().length;
}

/**
 * Flush synced events from the queue.
 * @param {string[]} syncedIds - IDs of events that were successfully synced
 */
export function removeSynced(syncedIds) {
  const idSet = new Set(syncedIds);
  const queue = getQueue().filter(e => !idSet.has(e.id));
  saveQueue(queue);
}

/**
 * Clear all events (for testing/reset).
 */
export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

// ── Internal ──

function saveQueue(queue) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Storage full — silently fail
  }
}

function generateUUID() {
  // Simple UUID v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
