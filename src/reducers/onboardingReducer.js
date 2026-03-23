export const OB_ACTIONS = {
  SET_PHASE: "ob/SET_PHASE",
  SET_AREAS: "ob/SET_AREAS",
  TOGGLE_AREA: "ob/TOGGLE_AREA",
  SET_CHAT_MESSAGES: "ob/SET_CHAT_MESSAGES",
  APPEND_CHAT_MESSAGE: "ob/APPEND_CHAT_MESSAGE",
  SET_CHAT_INPUT: "ob/SET_CHAT_INPUT",
  SET_CHAT_LOADING: "ob/SET_CHAT_LOADING",
  SET_COACH_READY: "ob/SET_COACH_READY",
  SET_EXTRACTED_DATA: "ob/SET_EXTRACTED_DATA",
  SET_EXTRACTING: "ob/SET_EXTRACTING",
  SET_STRUGGLES: "ob/SET_STRUGGLES",
  TOGGLE_STRUGGLE: "ob/TOGGLE_STRUGGLE",
  SET_SUGGESTED_HABITS: "ob/SET_SUGGESTED_HABITS",
  TOGGLE_HABIT_SELECTION: "ob/TOGGLE_HABIT_SELECTION",
  ADD_HABIT: "ob/ADD_HABIT",
  REMOVE_HABIT: "ob/REMOVE_HABIT",
  SET_USER_HABITS: "ob/SET_USER_HABITS",
  SET_REMOVED_ACTIONS: "ob/SET_REMOVED_ACTIONS",
  ADD_REMOVED_ACTION: "ob/ADD_REMOVED_ACTION",
  SET_LOADING_HABITS: "ob/SET_LOADING_HABITS",
  SET_NEW_HABIT_TEXT: "ob/SET_NEW_HABIT_TEXT",
  SET_NEW_HABIT_AREA: "ob/SET_NEW_HABIT_AREA",
  SET_DAILY_LOAD: "ob/SET_DAILY_LOAD",
  SET_DIFFICULTY: "ob/SET_DIFFICULTY",
  SET_WEEK_SCHEDULE: "ob/SET_WEEK_SCHEDULE",
  SET_LOADING_SCHEDULE: "ob/SET_LOADING_SCHEDULE",
};

export function createObInitialState(saved) {
  return {
    obPhase: saved?.obPhase || "areas",
    selectedAreas: saved?.selectedAreas || [],
    chatMessages: saved?.chatMessages || [],
    chatInput: "",
    chatLoading: false,
    coachReady: saved?.coachReady || false,
    extractedData: saved?.extractedData || null,
    extracting: false,
    struggles: saved?.struggles || [],
    suggestedHabits: saved?.suggestedHabits || [],
    userHabits: saved?.userHabits || [],
    removedActions: saved?.removedActions || [],
    loadingHabits: false,
    newHabitText: "",
    newHabitArea: null,
    dailyLoad: saved?.dailyLoad || 2,
    difficulty: saved?.difficulty || "medium",
    weekSchedule: saved?.weekSchedule || null,
    loadingSchedule: false,
  };
}

export function onboardingReducer(state, action) {
  switch (action.type) {
    case OB_ACTIONS.SET_PHASE:
      return { ...state, obPhase: action.payload };
    case OB_ACTIONS.SET_AREAS:
      return { ...state, selectedAreas: action.payload };
    case OB_ACTIONS.TOGGLE_AREA: {
      const id = action.payload;
      const prev = state.selectedAreas;
      return { ...state, selectedAreas: prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id] };
    }
    case OB_ACTIONS.SET_CHAT_MESSAGES:
      return { ...state, chatMessages: action.payload };
    case OB_ACTIONS.APPEND_CHAT_MESSAGE:
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case OB_ACTIONS.SET_CHAT_INPUT:
      return { ...state, chatInput: action.payload };
    case OB_ACTIONS.SET_CHAT_LOADING:
      return { ...state, chatLoading: action.payload };
    case OB_ACTIONS.SET_COACH_READY:
      return { ...state, coachReady: action.payload };
    case OB_ACTIONS.SET_EXTRACTED_DATA:
      return { ...state, extractedData: action.payload };
    case OB_ACTIONS.SET_EXTRACTING:
      return { ...state, extracting: action.payload };
    case OB_ACTIONS.SET_STRUGGLES:
      return { ...state, struggles: action.payload };
    case OB_ACTIONS.TOGGLE_STRUGGLE: {
      const id = action.payload;
      const prev = state.struggles;
      return { ...state, struggles: prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id] };
    }
    case OB_ACTIONS.SET_SUGGESTED_HABITS:
      return { ...state, suggestedHabits: action.payload };
    case OB_ACTIONS.TOGGLE_HABIT_SELECTION: {
      const id = action.payload;
      return { ...state, suggestedHabits: state.suggestedHabits.map(h => h.id === id ? { ...h, selected: !h.selected } : h) };
    }
    case OB_ACTIONS.ADD_HABIT:
      return { ...state, suggestedHabits: [...state.suggestedHabits, action.payload] };
    case OB_ACTIONS.REMOVE_HABIT:
      return { ...state, suggestedHabits: state.suggestedHabits.filter(h => h.id !== action.payload) };
    case OB_ACTIONS.SET_USER_HABITS:
      return { ...state, userHabits: action.payload };
    case OB_ACTIONS.SET_REMOVED_ACTIONS:
      return { ...state, removedActions: action.payload };
    case OB_ACTIONS.ADD_REMOVED_ACTION: {
      const a = action.payload;
      const key = a.action + a.area;
      if (state.removedActions.some(ra => ra.action + ra.area === key)) return state;
      return { ...state, removedActions: [...state.removedActions, a] };
    }
    case OB_ACTIONS.SET_LOADING_HABITS:
      return { ...state, loadingHabits: action.payload };
    case OB_ACTIONS.SET_NEW_HABIT_TEXT:
      return { ...state, newHabitText: action.payload };
    case OB_ACTIONS.SET_NEW_HABIT_AREA:
      return { ...state, newHabitArea: action.payload };
    case OB_ACTIONS.SET_DAILY_LOAD:
      return { ...state, dailyLoad: action.payload };
    case OB_ACTIONS.SET_DIFFICULTY:
      return { ...state, difficulty: action.payload };
    case OB_ACTIONS.SET_WEEK_SCHEDULE:
      return { ...state, weekSchedule: typeof action.payload === "function" ? action.payload(state.weekSchedule) : action.payload };
    case OB_ACTIONS.SET_LOADING_SCHEDULE:
      return { ...state, loadingSchedule: action.payload };
    default:
      return state;
  }
}
