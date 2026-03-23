import { useReducer, useContext, createContext, useEffect, useRef, useCallback, useMemo } from "react";
import { DAYS, LIFE_AREAS, CHECKIN_RESPONSES, MILESTONES } from "./constants.js";
import { buildCoachSystemPrompt, buildExtractionPrompt, buildUnifiedPlanPrompt, buildHabitSuggestionPrompt, buildSchedulePrompt, generateFallbackPlans } from "./prompts.js";
import { CSS } from "./styles.js";
import { chat, chatJSON, parseCoachResponse } from "./services/aiService.js";
import { readAll, writeSlice, migrateLegacy } from "./services/storageService.js";
import { trackScreenView, trackHabitComplete, trackSessionStart } from "./services/eventService.js";
import { uiReducer, createUiInitialState, UI_ACTIONS } from "./reducers/uiReducer.js";
import { onboardingReducer, createObInitialState, OB_ACTIONS } from "./reducers/onboardingReducer.js";
import { planReducer, createPlanInitialState, PLAN_ACTIONS } from "./reducers/planReducer.js";
import { dailyReducer, createDailyInitialState, DAILY_ACTIONS } from "./reducers/dailyReducer.js";
import { useTodayPlan } from "./hooks/useTodayPlan.js";
import { useCompletionRate } from "./hooks/useCompletionRate.js";
import { useStreaks } from "./hooks/useStreaks.js";
import USPCarousel from "./screens/USPCarousel.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import TodayScreen from "./screens/TodayScreen.jsx";
import ReflectionScreen from "./screens/ReflectionScreen.jsx";
import ProgressScreen from "./screens/ProgressScreen.jsx";
import ReplanScreen from "./screens/ReplanScreen.jsx";
import EditScheduleScreen from "./screens/EditScheduleScreen.jsx";
import BottomNav from "./components/BottomNav.jsx";

const AppCtx = createContext();
export const useApp = () => useContext(AppCtx);

// ─── PERSISTENCE ──────────────────────────────────────────────────────────────
migrateLegacy();

function loadSaved() {
  return readAll();
}
function saveState(data) {
  writeSlice("onboarding", {
    obPhase: data.obPhase, selectedAreas: data.selectedAreas,
    chatMessages: data.chatMessages, coachReady: data.coachReady,
    extractedData: data.extractedData, struggles: data.struggles,
    suggestedHabits: data.suggestedHabits, userHabits: data.userHabits,
    removedActions: data.removedActions, dailyLoad: data.dailyLoad,
    difficulty: data.difficulty, weekSchedule: data.weekSchedule,
  });
  writeSlice("plan", {
    weekPlan: data.weekPlan, selectedPlanIdx: data.selectedPlanIdx,
  });
  writeSlice("daily", {
    dayNumber: data.dayNumber, weekDay: data.weekDay,
    checked: data.checked, partialChecked: data.partialChecked,
    completionHistory: data.completionHistory, checkinDone: data.checkinDone,
    checkinChoice: data.checkinChoice, checkinNote: data.checkinNote,
  });
  writeSlice("ui", {
    screen: data.screen, uspSlide: data.uspSlide,
  });
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
function AppProvider({ children }) {
  const saved = useRef(loadSaved()).current;
  const initScreen = saved?.screen || (saved?.weekPlan ? "today" : (saved?.obPhase && saved?.selectedAreas?.length > 0) ? "onboarding" : "usp");

  // ── Domain reducers ───────────────────────────────────────────────────────
  const [ui, dUI] = useReducer(uiReducer, createUiInitialState(saved, initScreen));
  const [ob, dOB] = useReducer(onboardingReducer, createObInitialState(saved));
  const [plan, dPlan] = useReducer(planReducer, createPlanInitialState(saved));
  const [daily, dDaily] = useReducer(dailyReducer, createDailyInitialState(saved));

  // ── Custom hooks for derived state ────────────────────────────────────────
  const { todayKey, tomorrowKey, todayActions, tomorrowActions } = useTodayPlan(plan.weekPlan, daily.weekDay);
  const { completedCount, partialCount, totalActions } = useCompletionRate(todayActions, daily.checked, daily.partialChecked);
  const { totalDaysTracked, daysWithActivity, consistencyPct, earnedMilestones, currentStreak, bestStreak } = useStreaks(daily.completionHistory, daily.dayNumber);

  // ── Setter wrappers (maintain same API surface for child components) ──────
  const setScreen = useCallback(s => dUI({ type: UI_ACTIONS.SET_SCREEN, payload: s }), []);
  const setUspSlide = useCallback(s => dUI({ type: UI_ACTIONS.SET_USP_SLIDE, payload: s }), []);
  const setFirstTime = useCallback(v => dUI({ type: UI_ACTIONS.SET_FIRST_TIME, payload: v }), []);
  const setExpandedAction = useCallback(v => dUI({ type: UI_ACTIONS.SET_EXPANDED_ACTION, payload: v }), []);

  const setObPhase = useCallback(p => dOB({ type: OB_ACTIONS.SET_PHASE, payload: p }), []);
  const setChatInput = useCallback(v => dOB({ type: OB_ACTIONS.SET_CHAT_INPUT, payload: v }), []);
  const setNewHabitText = useCallback(v => dOB({ type: OB_ACTIONS.SET_NEW_HABIT_TEXT, payload: v }), []);
  const setNewHabitArea = useCallback(v => dOB({ type: OB_ACTIONS.SET_NEW_HABIT_AREA, payload: v }), []);
  const setDailyLoad = useCallback(v => dOB({ type: OB_ACTIONS.SET_DAILY_LOAD, payload: v }), []);
  const setDifficulty = useCallback(v => dOB({ type: OB_ACTIONS.SET_DIFFICULTY, payload: v }), []);
  const setWeekSchedule = useCallback(v => dOB({ type: OB_ACTIONS.SET_WEEK_SCHEDULE, payload: v }), []);

  const setWeekPlan = useCallback(v => dPlan({ type: PLAN_ACTIONS.SET_WEEK_PLAN, payload: v }), []);
  const setPlanningMode = useCallback(() => {}, []); // kept for API compat

  const setCheckinDone = useCallback(v => dDaily({ type: DAILY_ACTIONS.SET_CHECKIN_DONE, payload: v }), []);
  const setCheckinChoice = useCallback(v => dDaily({ type: DAILY_ACTIONS.SET_CHECKIN_CHOICE, payload: v }), []);
  const setCheckinNote = useCallback(v => dDaily({ type: DAILY_ACTIONS.SET_CHECKIN_NOTE, payload: v }), []);
  const setShowWritePrompt = useCallback(v => dDaily({ type: DAILY_ACTIONS.SET_SHOW_WRITE_PROMPT, payload: v }), []);
  const setComebackMode = useCallback(v => dDaily({ type: DAILY_ACTIONS.SET_COMEBACK_MODE, payload: v }), []);
  const setIsReturning = useCallback(v => dDaily({ type: DAILY_ACTIONS.SET_IS_RETURNING, payload: v }), []);

  // ── Persist state to localStorage ─────────────────────────────────────────
  useEffect(() => {
    saveState({
      uspSlide: ui.uspSlide,
      obPhase: ob.obPhase, selectedAreas: ob.selectedAreas, chatMessages: ob.chatMessages,
      coachReady: ob.coachReady, extractedData: ob.extractedData, struggles: ob.struggles,
      suggestedHabits: ob.suggestedHabits, userHabits: ob.userHabits, removedActions: ob.removedActions,
      dailyLoad: ob.dailyLoad, difficulty: ob.difficulty, weekSchedule: ob.weekSchedule,
      selectedPlanIdx: plan.selectedPlanIdx, weekPlan: plan.weekPlan,
      screen: ui.screen, dayNumber: daily.dayNumber, weekDay: daily.weekDay,
      checked: daily.checked, partialChecked: daily.partialChecked,
      completionHistory: daily.completionHistory, checkinDone: daily.checkinDone,
      checkinChoice: daily.checkinChoice, checkinNote: daily.checkinNote,
    });
  }, [ui, ob, plan, daily]);

  // ── Area selection ─────────────────────────────────────────────────────────
  const toggleArea = useCallback(id => dOB({ type: OB_ACTIONS.TOGGLE_AREA, payload: id }), []);

  // ── Chat with coach ────────────────────────────────────────────────────────
  async function startChat() {
    dOB({ type: OB_ACTIONS.SET_PHASE, payload: "chat" });
    if (ob.chatMessages.length > 0) return;
    const areaLabels = ob.selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)?.label).join(", ");
    const firstMsg = { role: "user", content: `I want to work on: ${areaLabels}` };
    dOB({ type: OB_ACTIONS.SET_CHAT_MESSAGES, payload: [firstMsg] });
    dOB({ type: OB_ACTIONS.SET_CHAT_LOADING, payload: true });
    try {
      const reply = await chat({
        system: buildCoachSystemPrompt(ob.selectedAreas),
        messages: [firstMsg],
        maxTokens: 200,
      });
      const { text, isReady } = parseCoachResponse(reply);
      dOB({ type: OB_ACTIONS.APPEND_CHAT_MESSAGE, payload: { role: "assistant", content: text } });
      if (isReady) dOB({ type: OB_ACTIONS.SET_COACH_READY, payload: true });
    } catch (e) {
      dOB({ type: OB_ACTIONS.APPEND_CHAT_MESSAGE, payload: { role: "assistant", content: "What's the main thing you want to change in these areas?" } });
    } finally { dOB({ type: OB_ACTIONS.SET_CHAT_LOADING, payload: false }); }
  }

  async function sendChat() {
    const msg = ob.chatInput.trim();
    if (!msg || ob.chatLoading) return;
    const userMsg = { role: "user", content: msg };
    const updated = [...ob.chatMessages, userMsg];
    dOB({ type: OB_ACTIONS.SET_CHAT_MESSAGES, payload: updated });
    dOB({ type: OB_ACTIONS.SET_CHAT_INPUT, payload: "" });
    dOB({ type: OB_ACTIONS.SET_CHAT_LOADING, payload: true });
    try {
      const reply = await chat({
        system: buildCoachSystemPrompt(ob.selectedAreas),
        messages: updated,
        maxTokens: 200,
      });
      const { text, isReady } = parseCoachResponse(reply);
      dOB({ type: OB_ACTIONS.APPEND_CHAT_MESSAGE, payload: { role: "assistant", content: text } });
      if (isReady) dOB({ type: OB_ACTIONS.SET_COACH_READY, payload: true });
    } catch (e) {
      dOB({ type: OB_ACTIONS.APPEND_CHAT_MESSAGE, payload: { role: "assistant", content: "Sorry, I had a moment — could you try sending that again? I want to make sure I get this right for you." } });
    } finally { dOB({ type: OB_ACTIONS.SET_CHAT_LOADING, payload: false }); }
  }

  async function finishChat() {
    dOB({ type: OB_ACTIONS.SET_EXTRACTING, payload: true });
    try {
      const parsed = await chatJSON({
        messages: [{ role: "user", content: buildExtractionPrompt(ob.chatMessages, ob.selectedAreas) }],
        maxTokens: 1000, timeout: 20000,
      });
      dOB({ type: OB_ACTIONS.SET_EXTRACTED_DATA, payload: parsed });
      dOB({ type: OB_ACTIONS.SET_PHASE, payload: "struggles" });
    } catch (e) {
      dOB({ type: OB_ACTIONS.SET_EXTRACTED_DATA, payload: {
        identities: ob.selectedAreas.slice(0, 3).map(a => ({
          identity: `I am a ${LIFE_AREAS.find(la => la.id === a)?.label?.split(" ")[0]?.toLowerCase() || "growing"} person`,
          areas: [a], goal: "Improve in this area", struggle: "consistency", routine_context: ""
        })),
        goals: ob.selectedAreas.map(a => ({ area: a, goal: "Improve in this area", struggle: "consistency", routine_context: "" })),
        available_time: 30, daily_routine: "standard morning-to-evening", key_insight: "Starting is the hardest part"
      }});
      dOB({ type: OB_ACTIONS.SET_PHASE, payload: "struggles" });
    } finally { dOB({ type: OB_ACTIONS.SET_EXTRACTING, payload: false }); }
  }

  // ── Struggles ───────────────────────────────────────────────────────────────
  const toggleStruggle = useCallback(id => dOB({ type: OB_ACTIONS.TOGGLE_STRUGGLE, payload: id }), []);

  // ── Habit suggestion ────────────────────────────────────────────────────────
  async function generateHabitSuggestions() {
    dOB({ type: OB_ACTIONS.SET_LOADING_HABITS, payload: true });
    dOB({ type: OB_ACTIONS.SET_PHASE, payload: "habits" });
    try {
      const parsed = await chatJSON({
        messages: [{ role: "user", content: buildHabitSuggestionPrompt(ob.extractedData, ob.struggles, ob.selectedAreas) }],
        maxTokens: 2000, timeout: 20000,
      });
      const habits = (parsed.habits || []).map((h, i) => ({ ...h, id: `s${i}`, selected: false }));
      dOB({ type: OB_ACTIONS.SET_SUGGESTED_HABITS, payload: habits });
    } catch (e) {
      const fallbackHabits = [
        { id:"s0", action:"Do 20 bodyweight squats", area:"health", twoMin:"Get into squat position and do one", suggestedTriggers:["After I wake up","After I pour coffee","After I get home"], identity:"I am a daily mover", difficulty:"small", selected: false },
        { id:"s1", action:"Go for a 20-minute walk outside", area:"health", twoMin:"Put on shoes and step outside", suggestedTriggers:["After lunch","After I finish work","After morning coffee"], identity:"I am a daily mover", difficulty:"medium", selected: false },
        { id:"s2", action:"Read 10 pages of current book", area:"growth", twoMin:"Open book to your bookmark", suggestedTriggers:["After dinner","After I settle into bed","After lunch"], identity:"I am an intentional learner", difficulty:"small", selected: false },
        { id:"s3", action:"Watch one tutorial on a new skill", area:"growth", twoMin:"Open the tutorial app and pick a video", suggestedTriggers:["After dinner","After I finish work","After lunch"], identity:"I am an intentional learner", difficulty:"medium", selected: false },
        { id:"s4", action:"Write 3 things I'm grateful for", area:"spiritual", twoMin:"Open journal to a blank page", suggestedTriggers:["After morning coffee","After dinner","After I settle into bed"], identity:"I am a reflective person", difficulty:"small", selected: false },
        { id:"s5", action:"10 minutes of focused breathing", area:"spiritual", twoMin:"Sit down and take 3 deep breaths", suggestedTriggers:["After I wake up","After lunch","Before bed"], identity:"I am a reflective person", difficulty:"small", selected: false },
        { id:"s6", action:"Send a thoughtful message to a friend", area:"relations", twoMin:"Open messages and pick one person", suggestedTriggers:["After morning coffee","After lunch","After dinner"], identity:"I am someone who shows up", difficulty:"small", selected: false },
        { id:"s7", action:"Prepare a healthy meal from scratch", area:"health", twoMin:"Lay out the ingredients on the counter", suggestedTriggers:["After I get home from work","After I finish exercising","After my morning routine"], identity:"I am a daily mover", difficulty:"ambitious", selected: false },
      ];
      const areaSet = new Set(ob.selectedAreas);
      const relevant = fallbackHabits.filter(h => areaSet.has(h.area));
      dOB({ type: OB_ACTIONS.SET_SUGGESTED_HABITS, payload: relevant.length > 0 ? relevant : fallbackHabits.slice(0, 4) });
    } finally { dOB({ type: OB_ACTIONS.SET_LOADING_HABITS, payload: false }); }
  }

  const toggleHabitSelection = useCallback(id => dOB({ type: OB_ACTIONS.TOGGLE_HABIT_SELECTION, payload: id }), []);

  function addCustomHabit() {
    if (!ob.newHabitText.trim() || !ob.newHabitArea) return;
    const actionText = ob.newHabitText.trim();
    const routine = ob.extractedData?.daily_routine || "";
    const anchors = routine.match(/morning coffee|commute|lunch|breakfast|dinner|bedtime|wake up|get home/gi) || ["morning coffee", "lunch", "dinner"];
    const habit = {
      id: `c${Date.now()}`, action: actionText, area: ob.newHabitArea,
      twoMin: `Spend 2 minutes starting: ${actionText.toLowerCase()}`,
      suggestedTriggers: anchors.slice(0, 3).map(a => `After ${a.toLowerCase()}`),
      selectedTrigger: null,
      identity: ob.extractedData?.identities?.find(id => id.areas?.includes(ob.newHabitArea))?.identity || "",
      difficulty: "medium", selected: true,
    };
    dOB({ type: OB_ACTIONS.ADD_HABIT, payload: habit });
    dOB({ type: OB_ACTIONS.SET_NEW_HABIT_TEXT, payload: "" });
    dOB({ type: OB_ACTIONS.SET_NEW_HABIT_AREA, payload: null });
  }

  const removeHabit = useCallback(id => dOB({ type: OB_ACTIONS.REMOVE_HABIT, payload: id }), []);

  // ── Schedule building ───────────────────────────────────────────────────────
  async function buildSchedule() {
    const selected = ob.suggestedHabits.filter(h => h.selected);
    if (selected.length === 0) return;
    dOB({ type: OB_ACTIONS.SET_USER_HABITS, payload: selected });
    dOB({ type: OB_ACTIONS.SET_LOADING_SCHEDULE, payload: true });
    dOB({ type: OB_ACTIONS.SET_PHASE, payload: "calendar" });
    try {
      const parsed = await chatJSON({
        messages: [{ role: "user", content: buildSchedulePrompt(selected, ob.extractedData?.daily_routine, ob.extractedData?.available_time) }],
        maxTokens: 1500, timeout: 20000,
      });
      const sched = {};
      DAYS.forEach(d => {
        const dayKey = d.toLowerCase();
        const dayData = parsed.schedule?.[dayKey] || [];
        sched[dayKey] = dayData.map(entry => {
          const habit = selected[entry.habitIdx] || selected[0];
          return { ...habit, timeSlot: entry.timeSlot || "morning" };
        }).filter(Boolean);
      });
      dOB({ type: OB_ACTIONS.SET_WEEK_SCHEDULE, payload: sched });
    } catch (e) {
      const sched = {};
      const selected2 = ob.suggestedHabits.filter(h => h.selected);
      DAYS.forEach((d, di) => {
        const dayKey = d.toLowerCase();
        const dayHabits = selected2.filter((_, i) => i % 7 === di || selected2.length <= 3);
        sched[dayKey] = dayHabits.slice(0, 3).map(h => ({ ...h, timeSlot: "morning" }));
      });
      dOB({ type: OB_ACTIONS.SET_WEEK_SCHEDULE, payload: sched });
    } finally { dOB({ type: OB_ACTIONS.SET_LOADING_SCHEDULE, payload: false }); }
  }

  function moveAction(fromDay, fromIdx, toDay, toSlot) {
    dOB({ type: OB_ACTIONS.SET_WEEK_SCHEDULE, payload: prev => {
      const next = { ...prev };
      const fromActions = [...(next[fromDay] || [])];
      const [moved] = fromActions.splice(fromIdx, 1);
      if (!moved) return prev;
      moved.timeSlot = toSlot || moved.timeSlot;
      next[fromDay] = fromActions;
      next[toDay] = [...(next[toDay] || []), moved];
      return next;
    }});
  }

  function removeFromSchedule(day, idx) {
    dOB({ type: OB_ACTIONS.SET_WEEK_SCHEDULE, payload: prev => {
      const next = { ...prev };
      const actions = [...(next[day] || [])];
      actions.splice(idx, 1);
      next[day] = actions;
      return next;
    }});
  }

  function addToSchedule(day, habit, timeSlot) {
    dOB({ type: OB_ACTIONS.SET_WEEK_SCHEDULE, payload: prev => {
      const dayActions = prev[day] || [];
      if (dayActions.some(a => a.timeSlot === timeSlot)) return prev;
      if (dayActions.length >= 5) return prev;
      return { ...prev, [day]: [...dayActions, { ...habit, timeSlot, id: `a_${Date.now()}_${Math.random().toString(36).slice(2,7)}` }] };
    }});
  }

  function confirmSchedule() {
    const daysWithIds = {};
    for (const [dayKey, actions] of Object.entries(ob.weekSchedule)) {
      daysWithIds[dayKey] = (actions || []).map(a => a.id ? a : { ...a, id: `a_${Date.now()}_${Math.random().toString(36).slice(2,7)}` });
    }
    const newPlan = {
      name: "My Plan",
      philosophy: ob.extractedData?.key_insight || "1% better every day",
      days: daysWithIds,
    };
    dPlan({ type: PLAN_ACTIONS.SET_WEEK_PLAN, payload: newPlan });
    dOB({ type: OB_ACTIONS.SET_PHASE, payload: "ready" });
  }

  // ── Plan generation (for replanning) ───────────────────────────────────────
  async function generatePlans(context) {
    dPlan({ type: PLAN_ACTIONS.SET_LOADING, payload: true });
    dPlan({ type: PLAN_ACTIONS.SET_OPTIONS, payload: null });
    dPlan({ type: PLAN_ACTIONS.SET_SELECTED_IDX, payload: null });
    const data2use = ob.extractedData || {
      goals: ob.selectedAreas.map(a => ({ area: a, goal: "Improve", struggle: "consistency" })),
      identity: "a growing person", daily_routine: "standard day", key_insight: "consistency"
    };
    try {
      const prompt = context
        ? `${buildUnifiedPlanPrompt(data2use, ob.dailyLoad, ob.difficulty)}\n\nADDITIONAL CONTEXT: ${context}`
        : buildUnifiedPlanPrompt(data2use, ob.dailyLoad, ob.difficulty);
      const parsed = await chatJSON({
        messages: [{ role: "user", content: prompt }],
        maxTokens: 4000, timeout: 25000,
      });
      dPlan({ type: PLAN_ACTIONS.SET_OPTIONS, payload: parsed.plans || [] });
    } catch (e) {
      dPlan({ type: PLAN_ACTIONS.SET_OPTIONS, payload: generateFallbackPlans(ob.dailyLoad, ob.selectedAreas) });
    } finally { dPlan({ type: PLAN_ACTIONS.SET_LOADING, payload: false }); }
  }

  function confirmPlan(idx) {
    if (plan.planOptions?.[idx]) {
      dPlan({ type: PLAN_ACTIONS.SET_WEEK_PLAN, payload: plan.planOptions[idx] });
      dPlan({ type: PLAN_ACTIONS.SET_SELECTED_IDX, payload: idx });
    }
  }

  function enterApp() {
    if (!plan.weekPlan) return;
    dDaily({ type: DAILY_ACTIONS.RESET_DAY });
    dUI({ type: UI_ACTIONS.SET_EXPANDED_ACTION, payload: null });
    dUI({ type: UI_ACTIONS.SET_SCREEN, payload: "today" });
    trackSessionStart();
    trackScreenView("today", "onboarding_complete");
  }

  // ── Daily ──────────────────────────────────────────────────────────────────
  function toggleComplete(i) {
    const willComplete = !daily.checked[i];
    dDaily({ type: DAILY_ACTIONS.TOGGLE_COMPLETE, payload: i });
    if (willComplete) {
      const action = todayActions[i];
      if (action) trackHabitComplete(action.id || `idx_${i}`, "full", action.timeSlot);
    }
  }

  function togglePartial(i) {
    if (!daily.checked[i]) {
      const willPartial = !daily.partialChecked[i];
      dDaily({ type: DAILY_ACTIONS.TOGGLE_PARTIAL, payload: i });
      if (willPartial) {
        const action = todayActions[i];
        if (action) trackHabitComplete(action.id || `idx_${i}`, "partial", action.timeSlot);
      }
    }
  }

  function simulateDay(offset) {
    const c = todayActions.filter((_, i) => daily.checked[i]).length;
    const p = todayActions.filter((_, i) => !daily.checked[i] && daily.partialChecked[i]).length;
    const newDay = daily.dayNumber + offset;
    const hit = MILESTONES.find(m => m.day === newDay);
    dDaily({ type: DAILY_ACTIONS.ADVANCE_DAY, payload: {
      offset,
      historyEntry: { day: daily.dayNumber, completed: c, partial: p, total: todayActions.length, mood: daily.checkinChoice },
      milestone: hit,
    }});
    dUI({ type: UI_ACTIONS.SET_EXPANDED_ACTION, payload: null });
  }

  function startReplanning() {
    let context = "";
    if (daily.completionHistory.length > 0) {
      const recent = daily.completionHistory.slice(-7);
      const full = recent.filter(d => d.completed === d.total).length;
      const part = recent.filter(d => d.partial > 0 && d.completed < d.total).length;
      const zero = recent.filter(d => d.completed === 0 && d.partial === 0).length;
      const totalPossible = recent.reduce((s, d) => s + d.total, 0);
      const totalDone = recent.reduce((s, d) => s + d.completed, 0);
      const totalPartial = recent.reduce((s, d) => s + d.partial, 0);
      const overallRate = totalPossible > 0 ? Math.round(((totalDone + totalPartial * 0.5) / totalPossible) * 100) : 0;
      const moodNote = daily.checkinChoice ? `User's latest mood: "${CHECKIN_RESPONSES[daily.checkinChoice] || daily.checkinChoice}".` : "";
      const userNote = daily.checkinNote ? `User shared: "${daily.checkinNote}"` : "";

      context = `WEEKLY REVIEW DATA:
Last ${recent.length} days: ${full} fully done, ${part} partial, ${zero} missed. Overall completion: ${overallRate}%. Consistency: ${consistencyPct}%.
${moodNote}
${userNote}

RE-PLANNING RULES:
- Reflect briefly and kindly. Celebrate what went well — even partial completions and fallbacks count as wins.
- Normalize missed actions as information, not failure. Never criticize or shame.
- ADAPT based on completion rates:
  • If overall < 40%: REDUCE load significantly. Fewer habits per day. More fallback-friendly actions. Shorter durations. The user is overwhelmed.
  • If overall 40-70%: Slight adjustments. Swap out consistently skipped actions for easier alternatives. Keep what's working.
  • If overall > 70%: Gently progress. Slightly increase challenge on completed habits. Add one new small habit if appropriate.
- If an action was repeatedly skipped: either turn the full action into the new fallback and propose a new easier action, or replace it entirely with a different behavior expressing the same identity.
- If an action was consistently completed: gently progress it (slightly more time or challenge), but keep changes small and optional.
- NEVER drop an identity entirely because of a bad week. Shrink it to a single tiny fallback that keeps the identity alive.
- Treat fallbacks as legitimate progress, not failure.
- Maintain at least 1 rest day per week.
- Keep time slot discipline: max 1 action per time slot per day.
- Use correct grammar in all identity statements.`;
    }
    dUI({ type: UI_ACTIONS.SET_SCREEN, payload: "replan" });
    generatePlans(context);
  }

  const dismissMilestone = useCallback(() => dDaily({ type: DAILY_ACTIONS.SET_MILESTONE, payload: null }), []);

  // ── Edit plan (dispatch to plan reducer) ──────────────────────────────────
  function updateTrigger(dayKey, actionIdx, trigger) {
    dPlan({ type: PLAN_ACTIONS.UPDATE_TRIGGER, payload: { dayKey, actionIdx, trigger } });
  }

  function updateActionInPlan(dayKey, actionIdx, updates) {
    dPlan({ type: PLAN_ACTIONS.UPDATE_ACTION, payload: { dayKey, actionIdx, updates } });
  }

  function removeActionFromPlan(dayKey, actionIdx) {
    // Cross-domain: track removed action in onboarding state
    const action = plan.weekPlan?.days?.[dayKey]?.[actionIdx];
    if (action) dOB({ type: OB_ACTIONS.ADD_REMOVED_ACTION, payload: action });
    dPlan({ type: PLAN_ACTIONS.REMOVE_ACTION, payload: { dayKey, actionIdx } });
  }

  function addActionToPlan(dayKey, action, timeSlot) {
    dPlan({ type: PLAN_ACTIONS.ADD_ACTION, payload: { dayKey, actionData: action, timeSlot } });
  }

  function setActionRecurrence(dayKey, actionIdx, frequency) {
    dPlan({ type: PLAN_ACTIONS.SET_RECURRENCE, payload: { dayKey, actionIdx, frequency } });
  }

  // ── Context value (memoized) ──────────────────────────────────────────────
  const ctx = useMemo(() => ({
    // UI
    firstTime: ui.firstTime, setFirstTime,
    uspSlide: ui.uspSlide, setUspSlide,
    screen: ui.screen, setScreen,
    expandedAction: ui.expandedAction, setExpandedAction,
    // Onboarding
    obPhase: ob.obPhase, setObPhase,
    selectedAreas: ob.selectedAreas, toggleArea,
    chatMessages: ob.chatMessages, chatInput: ob.chatInput, setChatInput,
    chatLoading: ob.chatLoading, sendChat, startChat,
    coachReady: ob.coachReady, finishChat,
    extracting: ob.extracting, extractedData: ob.extractedData,
    struggles: ob.struggles, toggleStruggle,
    generateHabitSuggestions,
    suggestedHabits: ob.suggestedHabits, toggleHabitSelection,
    addCustomHabit, removeHabit,
    newHabitText: ob.newHabitText, setNewHabitText,
    newHabitArea: ob.newHabitArea, setNewHabitArea,
    loadingHabits: ob.loadingHabits, userHabits: ob.userHabits,
    weekSchedule: ob.weekSchedule, loadingSchedule: ob.loadingSchedule,
    buildSchedule, moveAction, removeFromSchedule, addToSchedule, confirmSchedule,
    dailyLoad: ob.dailyLoad, setDailyLoad,
    difficulty: ob.difficulty, setDifficulty,
    removedActions: ob.removedActions,
    // Plan
    planOptions: plan.planOptions, loadingPlans: plan.loadingPlans,
    selectedPlanIdx: plan.selectedPlanIdx,
    confirmPlan, generatePlans,
    weekPlan: plan.weekPlan, setWeekPlan, setPlanningMode,
    enterApp,
    updateTrigger, updateActionInPlan, removeActionFromPlan, addActionToPlan, setActionRecurrence,
    // Daily
    dayNumber: daily.dayNumber, weekDay: daily.weekDay,
    todayKey, todayActions, tomorrowActions,
    checked: daily.checked, partialChecked: daily.partialChecked,
    toggleComplete, togglePartial,
    completedCount, partialCount, totalActions,
    completionHistory: daily.completionHistory,
    totalDaysTracked, daysWithActivity, consistencyPct,
    currentStreak, bestStreak,
    checkinDone: daily.checkinDone, setCheckinDone,
    checkinChoice: daily.checkinChoice, setCheckinChoice,
    checkinNote: daily.checkinNote, setCheckinNote,
    showWritePrompt: daily.showWritePrompt, setShowWritePrompt,
    comebackMode: daily.comebackMode, setComebackMode,
    isReturning: daily.isReturning, setIsReturning,
    milestone: daily.milestone, dismissMilestone,
    earnedMilestones,
    simulateDay, startReplanning,
  }), [ui, ob, plan, daily, todayKey, todayActions, tomorrowActions, completedCount, partialCount, totalActions, totalDaysTracked, daysWithActivity, consistencyPct, earnedMilestones, currentStreak, bestStreak]);

  return <AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>;
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <style>{CSS}</style>
      <Shell />
    </AppProvider>
  );
}

function Shell() {
  const { screen } = useApp();
  return (
    <div className="app-root">
      <div className="screen-area">
        {screen === "usp" && <USPCarousel />}
        {screen === "onboarding" && <Onboarding />}
        {screen === "today" && <TodayScreen />}
        {screen === "edit-schedule" && <EditScheduleScreen />}
        {screen === "reflection" && <ReflectionScreen />}
        {screen === "progress" && <ProgressScreen />}
        {screen === "replan" && <ReplanScreen />}
      </div>
      {!["usp","onboarding","replan"].includes(screen) && <BottomNav />}
    </div>
  );
}
