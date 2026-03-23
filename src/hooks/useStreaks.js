import { useMemo } from "react";
import { MILESTONES } from "../constants.js";

export function useStreaks(completionHistory, dayNumber) {
  return useMemo(() => {
    const totalDaysTracked = completionHistory.length;
    const daysWithActivity = completionHistory.filter(d => d.completed > 0 || d.partial > 0).length;
    const consistencyPct = totalDaysTracked > 0
      ? Math.round((daysWithActivity / totalDaysTracked) * 100)
      : 0;
    const earnedMilestones = MILESTONES.filter(m => dayNumber >= m.day);

    // Current streak: count consecutive days with activity from the end
    let currentStreak = 0;
    for (let i = completionHistory.length - 1; i >= 0; i--) {
      const d = completionHistory[i];
      if (d.completed > 0 || d.partial > 0) currentStreak++;
      else break;
    }

    // Best streak
    let bestStreak = 0;
    let run = 0;
    for (const d of completionHistory) {
      if (d.completed > 0 || d.partial > 0) { run++; bestStreak = Math.max(bestStreak, run); }
      else run = 0;
    }

    return {
      totalDaysTracked,
      daysWithActivity,
      consistencyPct,
      earnedMilestones,
      currentStreak,
      bestStreak,
    };
  }, [completionHistory, dayNumber]);
}
