// Date utilities for real-date tracking
// All dates stored as ISO strings (YYYY-MM-DD) in local timezone

/**
 * Get today's date as ISO string in local timezone
 */
export function getTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Get the weekday index (0=Mon, 6=Sun) for a given ISO date string
 * This matches the app's DAYS constant: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
 */
export function getWeekDayFromISO(isoStr) {
  const d = new Date(isoStr + "T12:00:00"); // noon to avoid timezone edge cases
  const jsDay = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return jsDay === 0 ? 6 : jsDay - 1; // convert to 0=Mon, 6=Sun
}

/**
 * Calculate the number of days between two ISO date strings
 * Returns positive if dateB is after dateA
 */
export function daysBetween(dateA, dateB) {
  const a = new Date(dateA + "T12:00:00");
  const b = new Date(dateB + "T12:00:00");
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
