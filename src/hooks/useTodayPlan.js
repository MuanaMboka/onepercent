import { useMemo } from "react";
import { DAYS } from "../constants.js";

export function useTodayPlan(weekPlan, weekDay) {
  const todayKey = DAYS[weekDay].toLowerCase();
  const tomorrowKey = DAYS[(weekDay + 1) % 7].toLowerCase();

  const todayActions = useMemo(
    () => weekPlan?.days?.[todayKey] || [],
    [weekPlan, todayKey]
  );

  const tomorrowActions = useMemo(
    () => weekPlan?.days?.[tomorrowKey] || [],
    [weekPlan, tomorrowKey]
  );

  return { todayKey, tomorrowKey, todayActions, tomorrowActions };
}
