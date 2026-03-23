export const DAILY_ACTIONS = {
  SET_DAY_NUMBER: "daily/SET_DAY_NUMBER",
  SET_WEEK_DAY: "daily/SET_WEEK_DAY",
  SET_CHECKED: "daily/SET_CHECKED",
  TOGGLE_COMPLETE: "daily/TOGGLE_COMPLETE",
  SET_PARTIAL_CHECKED: "daily/SET_PARTIAL_CHECKED",
  TOGGLE_PARTIAL: "daily/TOGGLE_PARTIAL",
  SET_COMPLETION_HISTORY: "daily/SET_COMPLETION_HISTORY",
  APPEND_HISTORY: "daily/APPEND_HISTORY",
  SET_CHECKIN_DONE: "daily/SET_CHECKIN_DONE",
  SET_CHECKIN_CHOICE: "daily/SET_CHECKIN_CHOICE",
  SET_CHECKIN_NOTE: "daily/SET_CHECKIN_NOTE",
  SET_SHOW_WRITE_PROMPT: "daily/SET_SHOW_WRITE_PROMPT",
  SET_COMEBACK_MODE: "daily/SET_COMEBACK_MODE",
  SET_IS_RETURNING: "daily/SET_IS_RETURNING",
  SET_MILESTONE: "daily/SET_MILESTONE",
  ADVANCE_DAY: "daily/ADVANCE_DAY",
  RESET_DAY: "daily/RESET_DAY",
  AUTO_ADVANCE: "daily/AUTO_ADVANCE",
  SET_START_DATE: "daily/SET_START_DATE",
};

export function createDailyInitialState(saved) {
  return {
    dayNumber: saved?.dayNumber || 1,
    weekDay: saved?.weekDay || 0,
    checked: saved?.checked || {},
    partialChecked: saved?.partialChecked || {},
    completionHistory: saved?.completionHistory || [],
    checkinDone: saved?.checkinDone || false,
    checkinChoice: saved?.checkinChoice || null,
    checkinNote: saved?.checkinNote || "",
    showWritePrompt: false,
    comebackMode: false,
    isReturning: false,
    milestone: null,
    startDate: saved?.startDate || null,
    lastActiveDate: saved?.lastActiveDate || null,
  };
}

export function dailyReducer(state, action) {
  switch (action.type) {
    case DAILY_ACTIONS.SET_DAY_NUMBER:
      return { ...state, dayNumber: action.payload };
    case DAILY_ACTIONS.SET_WEEK_DAY:
      return { ...state, weekDay: action.payload };
    case DAILY_ACTIONS.SET_CHECKED:
      return { ...state, checked: action.payload };
    case DAILY_ACTIONS.TOGGLE_COMPLETE: {
      const i = action.payload;
      const newChecked = { ...state.checked, [i]: !state.checked[i] };
      const newPartial = newChecked[i] ? { ...state.partialChecked, [i]: false } : state.partialChecked;
      return { ...state, checked: newChecked, partialChecked: newPartial };
    }
    case DAILY_ACTIONS.SET_PARTIAL_CHECKED:
      return { ...state, partialChecked: action.payload };
    case DAILY_ACTIONS.TOGGLE_PARTIAL: {
      const i = action.payload;
      if (state.checked[i]) return state;
      return { ...state, partialChecked: { ...state.partialChecked, [i]: !state.partialChecked[i] } };
    }
    case DAILY_ACTIONS.SET_COMPLETION_HISTORY:
      return { ...state, completionHistory: action.payload };
    case DAILY_ACTIONS.APPEND_HISTORY:
      return { ...state, completionHistory: [...state.completionHistory, action.payload] };
    case DAILY_ACTIONS.SET_CHECKIN_DONE:
      return { ...state, checkinDone: action.payload };
    case DAILY_ACTIONS.SET_CHECKIN_CHOICE:
      return { ...state, checkinChoice: action.payload };
    case DAILY_ACTIONS.SET_CHECKIN_NOTE:
      return { ...state, checkinNote: action.payload };
    case DAILY_ACTIONS.SET_SHOW_WRITE_PROMPT:
      return { ...state, showWritePrompt: action.payload };
    case DAILY_ACTIONS.SET_COMEBACK_MODE:
      return { ...state, comebackMode: action.payload };
    case DAILY_ACTIONS.SET_IS_RETURNING:
      return { ...state, isReturning: action.payload };
    case DAILY_ACTIONS.SET_MILESTONE:
      return { ...state, milestone: action.payload };
    case DAILY_ACTIONS.ADVANCE_DAY: {
      const { offset, historyEntry, milestone: hit } = action.payload;
      return {
        ...state,
        completionHistory: [...state.completionHistory, historyEntry],
        dayNumber: state.dayNumber + offset,
        weekDay: (state.weekDay + offset) % 7,
        checked: {},
        partialChecked: {},
        checkinDone: false,
        checkinChoice: null,
        checkinNote: "",
        showWritePrompt: false,
        comebackMode: offset >= 3,
        isReturning: offset > 1,
        milestone: hit || null,
        lastActiveDate: action.payload.todayISO || state.lastActiveDate,
      };
    }
    case DAILY_ACTIONS.RESET_DAY:
      return {
        ...state,
        checked: {},
        partialChecked: {},
        checkinDone: false,
        checkinChoice: null,
      };
    case DAILY_ACTIONS.SET_START_DATE:
      return { ...state, startDate: action.payload, lastActiveDate: action.payload };
    case DAILY_ACTIONS.AUTO_ADVANCE: {
      // payload: { newDayNumber, newWeekDay, todayISO, historyEntries, milestone }
      const { newDayNumber, newWeekDay, todayISO, historyEntries, milestone: hit, daysMissed } = action.payload;
      return {
        ...state,
        dayNumber: newDayNumber,
        weekDay: newWeekDay,
        lastActiveDate: todayISO,
        completionHistory: [...state.completionHistory, ...historyEntries],
        checked: {},
        partialChecked: {},
        checkinDone: false,
        checkinChoice: null,
        checkinNote: "",
        showWritePrompt: false,
        comebackMode: daysMissed >= 3,
        isReturning: daysMissed > 1,
        milestone: hit || null,
      };
    }
    default:
      return state;
  }
}
