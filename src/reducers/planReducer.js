import { DAYS } from "../constants.js";

export const PLAN_ACTIONS = {
  SET_OPTIONS: "plan/SET_OPTIONS",
  SET_LOADING: "plan/SET_LOADING",
  SET_SELECTED_IDX: "plan/SET_SELECTED_IDX",
  SET_WEEK_PLAN: "plan/SET_WEEK_PLAN",
  UPDATE_TRIGGER: "plan/UPDATE_TRIGGER",
  UPDATE_ACTION: "plan/UPDATE_ACTION",
  REMOVE_ACTION: "plan/REMOVE_ACTION",
  ADD_ACTION: "plan/ADD_ACTION",
  SET_RECURRENCE: "plan/SET_RECURRENCE",
};

export function createPlanInitialState(saved) {
  return {
    planOptions: null,
    loadingPlans: false,
    selectedPlanIdx: saved?.selectedPlanIdx ?? null,
    weekPlan: saved?.weekPlan || null,
  };
}

function updateDayAction(plan, dayKey, actionIdx, updater) {
  if (!plan) return plan;
  const action = plan.days[dayKey]?.[actionIdx];
  if (!action) return plan;
  const next = { ...plan, days: { ...plan.days } };
  next.days[dayKey] = [...next.days[dayKey]];
  if (action.id) {
    next.days[dayKey] = next.days[dayKey].map(a => a.id === action.id ? updater(a) : a);
  } else {
    next.days[dayKey][actionIdx] = updater(next.days[dayKey][actionIdx]);
  }
  return next;
}

export function planReducer(state, action) {
  switch (action.type) {
    case PLAN_ACTIONS.SET_OPTIONS:
      return { ...state, planOptions: action.payload };
    case PLAN_ACTIONS.SET_LOADING:
      return { ...state, loadingPlans: action.payload };
    case PLAN_ACTIONS.SET_SELECTED_IDX:
      return { ...state, selectedPlanIdx: action.payload };
    case PLAN_ACTIONS.SET_WEEK_PLAN:
      return { ...state, weekPlan: typeof action.payload === "function" ? action.payload(state.weekPlan) : action.payload };

    case PLAN_ACTIONS.UPDATE_TRIGGER: {
      const { dayKey, actionIdx, trigger } = action.payload;
      return { ...state, weekPlan: updateDayAction(state.weekPlan, dayKey, actionIdx, a => ({ ...a, selectedTrigger: trigger })) };
    }

    case PLAN_ACTIONS.UPDATE_ACTION: {
      const { dayKey, actionIdx, updates } = action.payload;
      return { ...state, weekPlan: updateDayAction(state.weekPlan, dayKey, actionIdx, a => ({ ...a, ...updates })) };
    }

    case PLAN_ACTIONS.REMOVE_ACTION: {
      const { dayKey, actionIdx } = action.payload;
      if (!state.weekPlan) return state;
      const target = state.weekPlan.days[dayKey]?.[actionIdx];
      if (!target) return state;
      const next = { ...state.weekPlan, days: { ...state.weekPlan.days } };
      if (target.id) {
        next.days[dayKey] = next.days[dayKey].filter(a => a.id !== target.id);
      } else {
        next.days[dayKey] = next.days[dayKey].filter((_, i) => i !== actionIdx);
      }
      return { ...state, weekPlan: next };
    }

    case PLAN_ACTIONS.ADD_ACTION: {
      const { dayKey, actionData, timeSlot } = action.payload;
      if (!state.weekPlan) return state;
      const dayActions = state.weekPlan.days[dayKey] || [];
      if (dayActions.some(a => a.timeSlot === timeSlot)) return state;
      if (dayActions.length >= 5) return state;
      const next = { ...state.weekPlan, days: { ...state.weekPlan.days } };
      next.days[dayKey] = [...dayActions, { ...actionData, timeSlot, id: `a_${Date.now()}_${Math.random().toString(36).slice(2,7)}` }];
      return { ...state, weekPlan: next };
    }

    case PLAN_ACTIONS.SET_RECURRENCE: {
      const { dayKey, actionIdx, frequency } = action.payload;
      if (!state.weekPlan) return state;
      const target = state.weekPlan.days[dayKey]?.[actionIdx];
      if (!target) return state;
      const updated = { ...target, frequency };
      const next = { ...state.weekPlan, days: { ...state.weekPlan.days } };
      // Remove from all days
      DAYS.forEach(d => {
        const dk = d.toLowerCase();
        next.days[dk] = (next.days[dk] || []).filter(a =>
          target.id ? a.id !== target.id : (a.action !== target.action || a.area !== target.area)
        );
      });
      // Add to target days
      let targetDays;
      if (frequency === "daily") targetDays = DAYS.map(d => d.toLowerCase());
      else if (frequency === "weekdays") targetDays = ["mon","tue","wed","thu","fri"];
      else if (frequency === "3x") targetDays = ["mon","wed","fri"];
      else if (frequency === "2x") targetDays = ["tue","thu"];
      else targetDays = [dayKey];
      targetDays.forEach(dk => {
        next.days[dk] = [...(next.days[dk] || []), { ...updated, id: `a_${Date.now()}_${Math.random().toString(36).slice(2,7)}` }];
      });
      return { ...state, weekPlan: next };
    }

    default:
      return state;
  }
}
