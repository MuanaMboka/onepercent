// ─── STORAGE SERVICE ────────────────────────────────────────────────────────
// Persistence abstraction over localStorage.
// Provides:
// - Debounced writes (300ms) to avoid thrashing
// - Per-slice persistence (onboarding, plan, daily, ui separately)
// - Clean read/write interface (swappable to Supabase later)

const STORAGE_PREFIX = "onepercent_";
const DEBOUNCE_MS = 300;

const timers = {};

/**
 * Read a storage slice.
 * @param {string} slice - Slice name (e.g., "onboarding", "plan", "daily", "ui")
 * @returns {Object|null} Parsed data or null
 */
export function readSlice(slice) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + slice);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Write a storage slice (debounced).
 * @param {string} slice - Slice name
 * @param {Object} data - Data to persist
 */
export function writeSlice(slice, data) {
  if (timers[slice]) clearTimeout(timers[slice]);
  timers[slice] = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + slice, JSON.stringify(data));
    } catch {
      // Storage full or unavailable — silently fail
    }
  }, DEBOUNCE_MS);
}

/**
 * Write a storage slice immediately (no debounce).
 * Use for critical state changes (e.g., screen transitions).
 */
export function writeSliceSync(slice, data) {
  if (timers[slice]) clearTimeout(timers[slice]);
  try {
    localStorage.setItem(STORAGE_PREFIX + slice, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Read all slices at once (for initial load / migration).
 * Also supports the legacy single-blob format.
 */
export function readAll() {
  // Try new per-slice format first
  const slices = ["onboarding", "plan", "daily", "ui"];
  const hasNewFormat = slices.some(s => localStorage.getItem(STORAGE_PREFIX + s) !== null);

  if (hasNewFormat) {
    const result = {};
    slices.forEach(s => {
      const data = readSlice(s);
      if (data) Object.assign(result, data);
    });
    return Object.keys(result).length > 0 ? result : null;
  }

  // Fall back to legacy single-blob format
  try {
    const raw = localStorage.getItem("onepercent_state");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clear all storage (for reset/logout).
 */
export function clearAll() {
  const slices = ["onboarding", "plan", "daily", "ui"];
  slices.forEach(s => localStorage.removeItem(STORAGE_PREFIX + s));
  localStorage.removeItem("onepercent_state"); // legacy
}

/**
 * Migrate from legacy single-blob to per-slice format.
 * Call once on app startup if legacy data exists.
 */
export function migrateLegacy() {
  const legacyRaw = localStorage.getItem("onepercent_state");
  if (!legacyRaw) return false;

  try {
    const data = JSON.parse(legacyRaw);

    // Split into slices
    writeSliceSync("onboarding", {
      obPhase: data.obPhase,
      selectedAreas: data.selectedAreas,
      chatMessages: data.chatMessages,
      coachReady: data.coachReady,
      extractedData: data.extractedData,
      struggles: data.struggles,
      suggestedHabits: data.suggestedHabits,
      userHabits: data.userHabits,
      removedActions: data.removedActions,
      dailyLoad: data.dailyLoad,
      difficulty: data.difficulty,
      weekSchedule: data.weekSchedule,
    });

    writeSliceSync("plan", {
      weekPlan: data.weekPlan,
      selectedPlanIdx: data.selectedPlanIdx,
    });

    writeSliceSync("daily", {
      dayNumber: data.dayNumber,
      weekDay: data.weekDay,
      checked: data.checked,
      partialChecked: data.partialChecked,
      completionHistory: data.completionHistory,
      checkinDone: data.checkinDone,
      checkinChoice: data.checkinChoice,
      checkinNote: data.checkinNote,
    });

    writeSliceSync("ui", {
      screen: data.screen,
      uspSlide: data.uspSlide,
    });

    // Keep legacy blob as backup for now — don't delete
    return true;
  } catch {
    return false;
  }
}
