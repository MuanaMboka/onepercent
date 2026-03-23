import { useMemo } from "react";

export function useCompletionRate(todayActions, checked, partialChecked) {
  return useMemo(() => {
    const completedCount = todayActions.filter((_, i) => checked[i]).length;
    const partialCount = todayActions.filter((_, i) => !checked[i] && partialChecked[i]).length;
    const totalActions = todayActions.length;
    return { completedCount, partialCount, totalActions };
  }, [todayActions, checked, partialChecked]);
}
