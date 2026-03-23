// Variable reward system: daily freshness without gamification
// Uses deterministic seeding from dayNumber so rewards are stable within a day
// but different across days.

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function pick(arr, seed) {
  const rng = seededRandom(seed);
  return arr[Math.floor(rng() * arr.length)];
}

// ── Daily greeting (shown at top of Today screen) ─────────────────────────

const GREETINGS_MORNING = [
  "Fresh start.",
  "New day, same mission.",
  "The day is yours.",
  "Let's build.",
  "One thing at a time.",
  "Today matters.",
  "Show up. That's step one.",
  "Small moves, big results.",
];

const GREETINGS_AFTERNOON = [
  "Still time.",
  "Afternoon check.",
  "Keep the momentum.",
  "You've got this.",
  "Halfway through. Keep going.",
  "The day isn't over.",
];

const GREETINGS_EVENING = [
  "Wind down strong.",
  "Last push.",
  "Close it out.",
  "Almost there.",
  "End the day right.",
  "One more, then rest.",
];

const GREETINGS_STREAK = [
  "Day {streak} rolling.",
  "{streak} days strong.",
  "The chain continues.",
  "Consistency is compounding.",
  "You keep showing up.",
];

const GREETINGS_COMEBACK = [
  "You came back. That's the whole game.",
  "Reset. Restart. No guilt.",
  "Back in motion.",
  "The only failure is not returning.",
];

export function getDailyGreeting(dayNumber, currentStreak, hour) {
  if (currentStreak >= 3) {
    const msg = pick(GREETINGS_STREAK, dayNumber * 7);
    return msg.replace("{streak}", currentStreak);
  }

  if (hour == null) hour = new Date().getHours();

  if (hour < 12) return pick(GREETINGS_MORNING, dayNumber * 3);
  if (hour < 17) return pick(GREETINGS_AFTERNOON, dayNumber * 5);
  return pick(GREETINGS_EVENING, dayNumber * 11);
}

// ── Completion toast messages (shown when checking off a habit) ────────────

const COMPLETION_WITH_IDENTITY = [
  "{identity}",
  "That's who you are. {identity}",
  "Proof: {identity}",
  "Another rep. {identity}",
  "{identity}. Every time.",
];

const COMPLETION_GENERIC = [
  "Done. You showed up.",
  "One more off the list.",
  "That's momentum.",
  "Checked. Moving on.",
  "Built the habit a little stronger.",
  "Action taken.",
  "You did the thing.",
];

const COMPLETION_FINAL = [
  "All done. Perfect day.",
  "Clean sweep.",
  "100%. Nothing left.",
  "Every single one. Respect.",
  "Full send today.",
];

export function getCompletionMessage(dayNumber, actionIndex, identity, isLastAction) {
  const seed = dayNumber * 100 + actionIndex;
  if (isLastAction) return pick(COMPLETION_FINAL, seed);
  if (identity) {
    const msg = pick(COMPLETION_WITH_IDENTITY, seed);
    return msg.replace("{identity}", identity);
  }
  return pick(COMPLETION_GENERIC, seed);
}

// ── All-done celebrations (shown when all habits completed) ────────────────

const ALLDONE_ICONS = ["🔥", "⚡", "💎", "✨", "🏔️", "🎯"];

const ALLDONE_MESSAGES = [
  "Done.",
  "Everything. Handled.",
  "Nothing left. You earned this.",
  "Today was a good day.",
  "Full commitment. Full results.",
  "That's a wrap.",
];

export function getAllDoneCelebration(dayNumber) {
  return {
    icon: pick(ALLDONE_ICONS, dayNumber * 13),
    message: pick(ALLDONE_MESSAGES, dayNumber * 17),
  };
}

// ── Partial encouragement (when some but not all done) ─────────────────────

const PARTIAL_NUDGES = [
  "Good start. Keep going if you can.",
  "Progress, not perfection.",
  "Some done. That still counts.",
  "Partial is still moving forward.",
  "You started. That's more than most.",
  "Half the battle is beginning.",
];

export function getPartialNudge(dayNumber) {
  return pick(PARTIAL_NUDGES, dayNumber * 23);
}
