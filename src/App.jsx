import { useState, useContext, createContext, useEffect, useRef } from "react";

const AppCtx = createContext();
const useApp = () => useContext(AppCtx);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const LIFE_AREAS = [
  { id:"health",    icon:"💪", label:"Health & Fitness", color:"#2D9A6F" },
  { id:"career",    icon:"💼", label:"Career & Money",   color:"#D97706" },
  { id:"spiritual", icon:"🕊️", label:"Spiritual",        color:"#7C5CBF" },
  { id:"relations", icon:"❤️", label:"Relationships",    color:"#DC4A68" },
  { id:"growth",    icon:"📚", label:"Learning & Growth",color:"#2563EB" },
  { id:"fun",       icon:"🎨", label:"Fun & Creativity", color:"#0D9488" },
];

const USP_SLIDES = [
  {
    num:"01",
    headline:"Not the same list every day.",
    sub:"Your plan rotates weekly.",
    body:"Different actions. Same goals. Always moving.",
    accent:"#C2632A",
    bg:"linear-gradient(145deg,#1A1008 0%,#2C1810 50%,#1A1008 100%)",
    light:false,
  },
  {
    num:"02",
    headline:"One app. Your whole life.",
    sub:"Health. Money. Love. Growth.",
    body:"Pick what matters. AI builds one daily plan across all of it.",
    accent:"#2D9A6F",
    bg:"linear-gradient(145deg,#FAFAF8 0%,#EDF8F2 50%,#FAFAF8 100%)",
    light:true,
  },
  {
    num:"03",
    headline:"You came back.",
    sub:"That's all that matters.",
    body:"Half counts. Rest counts. The only loss is never opening it again.",
    accent:"#7C5CBF",
    bg:"linear-gradient(145deg,#0F0A18 0%,#1A1028 50%,#0F0A18 100%)",
    light:false,
  },
];

const STRUGGLES = [
  { id:"consistency", icon:"🔄", label:"Staying consistent", desc:"I start strong then fade" },
  { id:"motivation",  icon:"🔋", label:"Losing motivation",  desc:"I stop caring after a while" },
  { id:"time",        icon:"⏰", label:"Finding time",        desc:"Life gets busy and I skip" },
  { id:"overwhelm",   icon:"🌊", label:"Feeling overwhelmed", desc:"Too many goals, I freeze" },
  { id:"forgetting",  icon:"🧠", label:"Forgetting to do it", desc:"I just don't remember" },
  { id:"perfectionism",icon:"🎯", label:"All or nothing",     desc:"If I can't do it perfectly, I skip" },
];

const CHECKIN_OPTIONS = [
  { id:"easy",    icon:"🌊", label:"Felt easy" },
  { id:"hard",    icon:"🏔️", label:"Had to push" },
  { id:"partial", icon:"🌤️", label:"Did what I could" },
  { id:"rest",    icon:"🛋️", label:"Rest day" },
];

const CHECKIN_RESPONSES = {
  easy:    "Easy means the system is working.",
  hard:    "Hard days forge the habit. You showed up.",
  partial: "Something beats nothing. Always.",
  rest:    "Rest is part of the system.",
};

const MILESTONES = [
  { day:3,  icon:"🌱", title:"Started",    msg:"Most people never do. You did." },
  { day:7,  icon:"🔥", title:"One week",   msg:"Your brain is noticing the pattern." },
  { day:14, icon:"⚡", title:"Two weeks",  msg:"The neural pathway is forming." },
  { day:21, icon:"🏔️", title:"21 days",    msg:"The myth says this is enough. Science says keep going." },
  { day:30, icon:"💎", title:"One month",  msg:"Most people quit before now. You didn't." },
  { day:66, icon:"👑", title:"Automatic",  msg:"66 days. Research says this is when it sticks." },
];

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
function buildCoachSystemPrompt(selectedAreas) {
  const areaLabels = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)?.label || id).join(", ");
  const minQ = Math.max(3, selectedAreas.length);

  return `You are the habit coach inside "1%". The user selected: ${areaLabels}

ABSOLUTE HARD RULE: You MUST ask at least ${minQ} questions before you can use [READY]. Count your questions. If you have asked fewer than ${minQ}, you CANNOT use [READY] yet. No exceptions.

YOUR PURPOSE: Understand this person deeply enough to build a personalized weekly plan with real daily actions that fit their actual life.

HANDLING VAGUE OR LOW-EFFORT ANSWERS:
If someone says "all", "everything", "be better", "idk", a single word, or anything that doesn't give you concrete information — DO NOT accept it. Push back warmly:
- "all" → "Love the ambition. But if you had to pick the one area that feels most urgent right now, which would it be?"
- "be better" → "Better how though? Like waking up with more energy? Making more money? Feeling less stressed?"
- "idk" → "Totally fine. Let me try a different angle — what's one thing about your daily life right now that bugs you the most?"
- One-word answers → "Give me a bit more to work with — what does [their word] actually look like for you day to day?"

NEVER say "Got it. I have what I need" after a vague answer. That produces a garbage plan.

WHAT YOU NEED BEFORE [READY]:
1. At least one SPECIFIC goal with a concrete outcome (not a category)
2. What their typical day/week looks like (when they work, when they're free)
3. What has gone wrong before when they tried to improve

HOW TO ASK:
- One question per message. Under 40 words.
- React to what they said. Reference their words back to them.
- Be warm, not clinical. Match their vibe.
- Never judge any goal.
- Never give advice. Just understand.

ENDING:
After ${minQ}+ questions, when you have specific concrete information, write a one-sentence summary of what you understood, then [READY] on its own line.`;
}

function buildExtractionPrompt(conversation, selectedAreas) {
  const areaLabels = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)?.label || id).join(", ");
  return `Extract structured data from this coaching conversation. Be specific — use the user's actual words.

Selected areas: ${areaLabels}

CONVERSATION:
${conversation.map(m => `${m.role === "user" ? "User" : "Coach"}: ${m.content}`).join("\n")}

EXTRACTION RULES:
- For each goal: make it concrete and measurable even if the user was vague. If they said "get fit" and then said "I want to run a 5K", the goal is "Run a 5K" not "get fit."
- For struggles: extract the BEHAVIORAL PATTERN, not the surface excuse. "I quit after 2 weeks" → "loses momentum once initial excitement fades." "No time" → "doesn't protect time blocks for habits."
- For routine: extract actual anchors (morning coffee, commute, lunch break, gym, bedtime) that can be used as habit stack triggers.
- Identity should capture who they are BECOMING across all their goals, not just one area.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "goals": [
    {
      "area": "area id (health/career/spiritual/relations/growth/fun)",
      "goal": "specific measurable goal using their words",
      "struggle": "the behavioral pattern that stops them",
      "routine_context": "relevant routine detail for this area's triggers"
    }
  ],
  "identity": "noun phrase 2-4 words — who they are becoming",
  "daily_routine": "their day structure: morning/work/evening patterns",
  "key_insight": "the ONE behavioral pattern that if broken would unlock everything else"
}`;
}

function buildUnifiedPlanPrompt(extractedData, dailyLoad, difficulty) {
  const diffMap = {
    easy: "5-15 minutes per action, very approachable",
    medium: "15-30 minutes per action, moderate effort",
    hard: "30-60 minutes per action, serious commitment",
  };
  const goalsDesc = extractedData.goals.map(g =>
    `- Area: ${g.area} | Goal: ${g.goal} | Struggle: ${g.struggle} | Routine context: ${g.routine_context || "none given"}`
  ).join("\n");

  return `You are an expert habit architect. Build a unified weekly plan weaving multiple goals into one integrated schedule.

USER PROFILE:
${goalsDesc}
- Identity: ${extractedData.identity}
- Daily routine: ${extractedData.daily_routine}
- Key insight: ${extractedData.key_insight}
- Difficulty: ${difficulty} (${diffMap[difficulty]})
- Actions per day: ${dailyLoad}

TASK: Generate 3 DISTINCT weekly plans. Each weaves ALL goals across the week.

PLAN A — "Balanced Rhythm": Goals distributed evenly. Predictable pattern.
PLAN B — "Energy Matched": High-energy goals on weekday mornings, reflective goals evenings/weekends.
PLAN C — "Deep Focus": Specific days dedicated to specific areas.

RULES:
1. Each day has exactly ${dailyLoad} action(s). Over 7 days, every goal area appears at least twice.
2. EVERY action is SPECIFIC and MEASURABLE. BAD: "exercise" GOOD: "20 bodyweight squats"
3. EVERY action has a "timeSlot" — suggested time of day: "morning" (6-9am), "midday" (11am-1pm), "afternoon" (2-5pm), "evening" (6-9pm). Choose based on the action type and the user's routine.
4. EVERY action has "suggestedTriggers" — an array of 3 suggested habit-stack triggers the user can choose from. Each trigger must be a real daily routine. Format: "After I [routine]". Make them diverse: one morning, one midday/afternoon, one evening option where possible.
5. EVERY action has a "twoMin" — the entry behavior (not a shorter version). "Open the book" not "read 2 minutes."
6. EVERY action has "identity" — "I am a [noun phrase]" max 5 words.
7. EVERY action has "area" matching: health, career, spiritual, relations, growth, fun.
8. Weekends should feel lighter and more enjoyable.
9. Each plan: name (2-4 words) and philosophy (one sentence referencing the user's key insight).

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "plans": [
    {
      "name": "string",
      "philosophy": "string",
      "days": {
        "mon": [{"action":"string","timeSlot":"morning|midday|afternoon|evening","suggestedTriggers":["After I...","After I...","After I..."],"twoMin":"string","identity":"string","area":"string"}],
        "tue": [...], "wed": [...], "thu": [...], "fri": [...], "sat": [...], "sun": [...]
      }
    }
  ]
}`;
}

function buildHabitSuggestionPrompt(extractedData, struggles, selectedAreas) {
  const goalsDesc = extractedData.goals.map(g =>
    `- ${g.area}: ${g.goal} (struggle: ${g.struggle})`
  ).join("\n");
  const struggleList = struggles.map(s => STRUGGLES.find(st => st.id === s)?.label || s).join(", ");

  return `Based on this person's goals and struggles, suggest specific habits they could build.

GOALS:
${goalsDesc}

STRUGGLES: ${struggleList || "none specified"}
DAILY ROUTINE: ${extractedData.daily_routine || "not specified"}

Generate 8-12 habit suggestions. For each, be SPECIFIC and ACTIONABLE — not categories.
BAD: "exercise more" GOOD: "20 bodyweight squats"
BAD: "read" GOOD: "Read 10 pages of a non-fiction book"
BAD: "save money" GOOD: "Transfer $10 to savings account"

Each habit should have:
- action: the specific habit (measurable, concrete)
- area: which life area (health/career/spiritual/relations/growth/fun)
- twoMin: the 2-minute ENTRY BEHAVIOR — not a shorter version. "Open the book to your bookmark" not "read for 2 minutes"
- suggestedTriggers: 3 different trigger options ("After I [routine]")
- identity: "I am a [noun phrase]" max 5 words

Distribute suggestions across ALL their selected areas. Weight toward areas they seem most motivated about.

Respond ONLY with valid JSON (no markdown, no backticks):
{"habits": [{"action":"string","area":"string","twoMin":"string","suggestedTriggers":["string","string","string"],"identity":"string"}]}`;
}

function buildSchedulePrompt(habits, routine) {
  const habitList = habits.map((h, i) => `${i}: "${h.action}" (${h.area})`).join("\n");

  return `Distribute these habits across a 7-day week. The user will be able to rearrange after.

HABITS:
${habitList}

USER ROUTINE: ${routine || "standard 9-5 schedule"}

RULES:
- Spread habits across the week so each day has 1-3 actions
- Don't put all similar habits on the same day
- Weekends should feel lighter
- For each placement, assign a timeSlot: morning, midday, afternoon, or evening
- Use the habit's index number to reference it

Respond ONLY with valid JSON (no markdown, no backticks):
{"schedule":{"mon":[{"habitIdx":0,"timeSlot":"morning"}],"tue":[...],"wed":[...],"thu":[...],"fri":[...],"sat":[...],"sun":[...]}}`;
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
function AppProvider({ children }) {
  const [firstTime, setFirstTime] = useState(true);
  const [uspSlide, setUspSlide] = useState(0);

  // ONBOARDING PHASES: "areas" → "chat" → "struggles" → "habits" → "calendar" → "ready"
  const [obPhase, setObPhase] = useState("areas");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [coachReady, setCoachReady] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [extracting, setExtracting] = useState(false);

  // STRUGGLES
  const [struggles, setStruggles] = useState([]);

  // HABIT BUILDER
  const [suggestedHabits, setSuggestedHabits] = useState([]);
  const [userHabits, setUserHabits] = useState([]); // { id, action, area, trigger?, days[], timeSlot }
  const [loadingHabits, setLoadingHabits] = useState(false);
  const [newHabitText, setNewHabitText] = useState("");
  const [newHabitArea, setNewHabitArea] = useState(null);

  // CONFIG
  const [dailyLoad, setDailyLoad] = useState(2);
  const [difficulty, setDifficulty] = useState("medium");

  // WEEK CALENDAR (user-editable)
  const [weekSchedule, setWeekSchedule] = useState(null); // { mon: [...], tue: [...], ... }
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // PLANS (legacy — replaced by weekSchedule but kept for replan)
  const [planOptions, setPlanOptions] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(null);
  const [weekPlan, setWeekPlan] = useState(null);

  // APP STATE
  const [screen, setScreen] = useState("usp");
  const [dayNumber, setDayNumber] = useState(1);
  const [weekDay, setWeekDay] = useState(0);
  const [checked, setChecked] = useState({});
  const [partialChecked, setPartialChecked] = useState({});
  const [expandedAction, setExpandedAction] = useState(null);
  const [completionHistory, setCompletionHistory] = useState([]);
  const [checkinDone, setCheckinDone] = useState(false);
  const [checkinChoice, setCheckinChoice] = useState(null);
  const [checkinNote, setCheckinNote] = useState("");
  const [showWritePrompt, setShowWritePrompt] = useState(false);
  const [comebackMode, setComebackMode] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [milestone, setMilestone] = useState(null);

  // Derived
  const todayKey = DAYS[weekDay].toLowerCase();
  const todayActions = weekPlan?.days?.[todayKey] || [];
  const tomorrowKey = DAYS[(weekDay + 1) % 7].toLowerCase();
  const tomorrowActions = weekPlan?.days?.[tomorrowKey] || [];
  const completedCount = todayActions.filter((_, i) => checked[i]).length;
  const partialCount = todayActions.filter((_, i) => !checked[i] && partialChecked[i]).length;
  const totalActions = todayActions.length;
  const totalDaysTracked = completionHistory.length;
  const daysWithActivity = completionHistory.filter(d => d.completed > 0 || d.partial > 0).length;
  const consistencyPct = totalDaysTracked > 0 ? Math.round((daysWithActivity / totalDaysTracked) * 100) : 0;
  const earnedMilestones = MILESTONES.filter(m => dayNumber >= m.day);

  // ── Area selection ─────────────────────────────────────────────────────────
  function toggleArea(id) {
    setSelectedAreas(prev => {
      if (prev.includes(id)) return prev.filter(a => a !== id);
      return [...prev, id];
    });
  }

  // ── Chat with coach ────────────────────────────────────────────────────────
  async function startChat() {
    setObPhase("chat");
    const areaLabels = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)?.label).join(", ");
    const firstMsg = { role: "user", content: `I want to work on: ${areaLabels}` };
    setChatMessages([firstMsg]);
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 200,
          system: buildCoachSystemPrompt(selectedAreas),
          messages: [firstMsg]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "What's the main thing you want to change first?";
      const isReady = reply.includes("[READY]");
      const cleanReply = reply.replace("[READY]", "").trim();
      setChatMessages(prev => [...prev, { role: "assistant", content: cleanReply }]);
      if (isReady) setCoachReady(true);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "What's the main thing you want to change in these areas?" }]);
    } finally { setChatLoading(false); }
  }

  async function sendChat() {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    const userMsg = { role: "user", content: msg };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 200,
          system: buildCoachSystemPrompt(selectedAreas),
          messages: updated
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Got it. Tell me more.";
      const isReady = reply.includes("[READY]");
      const cleanReply = reply.replace("[READY]", "").trim();
      setChatMessages(prev => [...prev, { role: "assistant", content: cleanReply }]);
      if (isReady) setCoachReady(true);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Got it. I think I have what I need to build your plan." }]);
      setCoachReady(true);
    } finally { setChatLoading(false); }
  }

  async function finishChat() {
    setExtracting(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: buildExtractionPrompt(chatMessages, selectedAreas) }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim());
      setExtractedData(parsed);
      setObPhase("struggles");
    } catch (e) {
      setExtractedData({
        goals: selectedAreas.map(a => ({ area: a, goal: "Improve in this area", struggle: "consistency", routine_context: "" })),
        identity: "a consistent grower",
        daily_routine: "standard morning-to-evening",
        key_insight: "Starting is the hardest part"
      });
      setObPhase("struggles");
    } finally { setExtracting(false); }
  }

  // ── Struggles ───────────────────────────────────────────────────────────────
  function toggleStruggle(id) {
    setStruggles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }

  // ── Habit suggestion ────────────────────────────────────────────────────────
  async function generateHabitSuggestions() {
    setLoadingHabits(true);
    setObPhase("habits");
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 2000,
          messages: [{ role: "user", content: buildHabitSuggestionPrompt(extractedData, struggles, selectedAreas) }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim());
      const habits = (parsed.habits || []).map((h, i) => ({ ...h, id: `s${i}`, selected: false }));
      setSuggestedHabits(habits);
    } catch (e) {
      setSuggestedHabits([
        { id:"s0", action:"20 bodyweight squats", area:"health", twoMin:"Get into squat position", suggestedTriggers:["After I wake up","After I pour coffee","After I get home"], identity:"I am a daily mover", selected: false },
        { id:"s1", action:"Read 10 pages", area:"growth", twoMin:"Open book to bookmark", suggestedTriggers:["After dinner","After I brush my teeth","After lunch"], identity:"I am a reader", selected: false },
        { id:"s2", action:"Write 3 gratitude items", area:"spiritual", twoMin:"Open journal to blank page", suggestedTriggers:["After morning coffee","After dinner","After I brush my teeth"], identity:"I am grateful", selected: false },
      ]);
    } finally { setLoadingHabits(false); }
  }

  function toggleHabitSelection(id) {
    setSuggestedHabits(prev => prev.map(h => h.id === id ? { ...h, selected: !h.selected } : h));
  }

  function addCustomHabit() {
    if (!newHabitText.trim() || !newHabitArea) return;
    const habit = {
      id: `c${Date.now()}`,
      action: newHabitText.trim(),
      area: newHabitArea,
      twoMin: "",
      suggestedTriggers: [],
      selectedTrigger: null,
      identity: "",
      selected: true,
    };
    setSuggestedHabits(prev => [...prev, habit]);
    setNewHabitText("");
    setNewHabitArea(null);
  }

  function removeHabit(id) {
    setSuggestedHabits(prev => prev.filter(h => h.id !== id));
  }

  // ── Schedule building ───────────────────────────────────────────────────────
  async function buildSchedule() {
    const selected = suggestedHabits.filter(h => h.selected);
    if (selected.length === 0) return;
    setUserHabits(selected);
    setLoadingSchedule(true);
    setObPhase("calendar");
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1500,
          messages: [{ role: "user", content: buildSchedulePrompt(selected, extractedData?.daily_routine) }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim());
      // Convert schedule indices to full habit objects
      const sched = {};
      DAYS.forEach(d => {
        const dayKey = d.toLowerCase();
        const dayData = parsed.schedule?.[dayKey] || [];
        sched[dayKey] = dayData.map(entry => {
          const habit = selected[entry.habitIdx] || selected[0];
          return { ...habit, timeSlot: entry.timeSlot || "morning" };
        }).filter(Boolean);
      });
      setWeekSchedule(sched);
    } catch (e) {
      // Fallback: distribute evenly
      const sched = {};
      const selected2 = suggestedHabits.filter(h => h.selected);
      DAYS.forEach((d, di) => {
        const dayKey = d.toLowerCase();
        const dayHabits = selected2.filter((_, i) => i % 7 === di || selected2.length <= 3);
        sched[dayKey] = dayHabits.slice(0, 3).map(h => ({ ...h, timeSlot: "morning" }));
      });
      setWeekSchedule(sched);
    } finally { setLoadingSchedule(false); }
  }

  function moveAction(fromDay, fromIdx, toDay, toSlot) {
    setWeekSchedule(prev => {
      const next = { ...prev };
      const fromActions = [...(next[fromDay] || [])];
      const [moved] = fromActions.splice(fromIdx, 1);
      if (!moved) return prev;
      moved.timeSlot = toSlot || moved.timeSlot;
      next[fromDay] = fromActions;
      next[toDay] = [...(next[toDay] || []), moved];
      return next;
    });
  }

  function removeFromSchedule(day, idx) {
    setWeekSchedule(prev => {
      const next = { ...prev };
      const actions = [...(next[day] || [])];
      actions.splice(idx, 1);
      next[day] = actions;
      return next;
    });
  }

  function addToSchedule(day, habit, timeSlot) {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { ...habit, timeSlot }]
    }));
  }

  function confirmSchedule() {
    // Convert weekSchedule to weekPlan format
    const plan = {
      name: "My Plan",
      philosophy: extractedData?.key_insight || "1% better every day",
      days: weekSchedule,
    };
    setWeekPlan(plan);
    setObPhase("ready");
  }

  // ── Plan generation (for replanning) ───────────────────────────────────────
  async function generatePlans(context) {
    setLoadingPlans(true);
    setPlanOptions(null);
    setSelectedPlanIdx(null);
    const data2use = extractedData || {
      goals: selectedAreas.map(a => ({ area: a, goal: "Improve", struggle: "consistency" })),
      identity: "a growing person", daily_routine: "standard day", key_insight: "consistency"
    };
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 4000,
          messages: [{ role: "user", content: context
            ? `${buildUnifiedPlanPrompt(data2use, dailyLoad, difficulty)}\n\nADDITIONAL CONTEXT: ${context}`
            : buildUnifiedPlanPrompt(data2use, dailyLoad, difficulty) }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim());
      setPlanOptions(parsed.plans || []);
    } catch (e) {
      setPlanOptions(generateFallbackPlans(dailyLoad, selectedAreas));
    } finally { setLoadingPlans(false); }
  }

  function confirmPlan(idx) {
    if (planOptions?.[idx]) { setWeekPlan(planOptions[idx]); setSelectedPlanIdx(idx); }
  }

  function enterApp() {
    if (!weekPlan) return;
    setChecked({}); setPartialChecked({}); setExpandedAction(null);
    setCheckinDone(false); setCheckinChoice(null);
    setScreen("today");
  }

  // ── Daily ──────────────────────────────────────────────────────────────────
  function toggleComplete(i) {
    setChecked(p => { const n = { ...p, [i]: !p[i] }; if (n[i]) setPartialChecked(pc => ({ ...pc, [i]: false })); return n; });
  }
  function togglePartial(i) { if (!checked[i]) setPartialChecked(p => ({ ...p, [i]: !p[i] })); }

  function simulateDay(offset) {
    const c = todayActions.filter((_, i) => checked[i]).length;
    const p = todayActions.filter((_, i) => !checked[i] && partialChecked[i]).length;
    setCompletionHistory(prev => [...prev, { day: dayNumber, completed: c, partial: p, total: todayActions.length }]);
    const newDay = dayNumber + offset;
    setDayNumber(newDay);
    setWeekDay(wd => (wd + offset) % 7);
    setChecked({}); setPartialChecked({}); setExpandedAction(null);
    setCheckinDone(false); setCheckinChoice(null); setCheckinNote(""); setShowWritePrompt(false);
    if (offset >= 3) { setComebackMode(true); setIsReturning(true); }
    else if (offset > 1) { setIsReturning(true); }
    const hit = MILESTONES.find(m => m.day === newDay);
    if (hit) setMilestone(hit);
  }

  function startReplanning() {
    let context = "";
    if (completionHistory.length > 0) {
      const recent = completionHistory.slice(-7);
      const full = recent.filter(d => d.completed === d.total).length;
      const part = recent.filter(d => d.partial > 0 && d.completed < d.total).length;
      const zero = recent.filter(d => d.completed === 0 && d.partial === 0).length;
      context = `Last ${recent.length} days: ${full} fully done, ${part} partial, ${zero} missed. Consistency: ${consistencyPct}%.`;
    }
    setScreen("replan");
    generatePlans(context);
  }

  function dismissMilestone() { setMilestone(null); }

  return (
    <AppCtx.Provider value={{
      firstTime, setFirstTime, uspSlide, setUspSlide,
      obPhase, setObPhase, selectedAreas, toggleArea,
      chatMessages, chatInput, setChatInput, chatLoading, sendChat, startChat,
      coachReady, finishChat, extracting, extractedData,
      struggles, toggleStruggle, generateHabitSuggestions,
      suggestedHabits, toggleHabitSelection, addCustomHabit, removeHabit,
      newHabitText, setNewHabitText, newHabitArea, setNewHabitArea,
      loadingHabits, userHabits,
      weekSchedule, loadingSchedule, buildSchedule, moveAction, removeFromSchedule, addToSchedule, confirmSchedule,
      dailyLoad, setDailyLoad, difficulty, setDifficulty,
      planOptions, loadingPlans, selectedPlanIdx, confirmPlan, generatePlans,
      weekPlan, enterApp,
      screen, setScreen,
      dayNumber, weekDay, todayKey, todayActions, tomorrowActions,
      checked, partialChecked, toggleComplete, togglePartial,
      expandedAction, setExpandedAction,
      completedCount, partialCount, totalActions,
      completionHistory, totalDaysTracked, daysWithActivity, consistencyPct,
      checkinDone, setCheckinDone, checkinChoice, setCheckinChoice,
      checkinNote, setCheckinNote, showWritePrompt, setShowWritePrompt,
      comebackMode, setComebackMode, isReturning, setIsReturning,
      milestone, dismissMilestone, earnedMilestones,
      simulateDay, startReplanning,
    }}>
      {children}
    </AppCtx.Provider>
  );
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
        {screen === "nudges" && <NudgesScreen />}
        {screen === "reflection" && <ReflectionScreen />}
        {screen === "progress" && <ProgressScreen />}
        {screen === "replan" && <ReplanScreen />}
      </div>
      {!["usp","onboarding","replan"].includes(screen) && <BottomNav />}
    </div>
  );
}

// ─── USP CAROUSEL ─────────────────────────────────────────────────────────────
function USPCarousel() {
  const { uspSlide, setUspSlide, setScreen } = useApp();
  const slide = USP_SLIDES[uspSlide];
  const isLast = uspSlide === USP_SLIDES.length - 1;
  const light = slide.light;

  return (
    <div className="screen usp-screen" style={{ background: slide.bg }} key={uspSlide}>
      <div className="usp-grain" />
      <div className="usp-accent-glow" style={{ background: slide.accent }} />

      <div className="usp-top-bar">
        <span className={`usp-logo ${light ? "usp-logo-dark" : ""}`}>1%</span>
        <button className={`usp-skip ${light ? "usp-skip-dark" : ""}`}
          onClick={() => setScreen("onboarding")}>{isLast ? "" : "Skip"}</button>
      </div>

      <div className="usp-main fade-in">
        <span className="usp-num" style={{ color: slide.accent }}>{slide.num}</span>
        <h1 className={`usp-headline ${light ? "usp-hl-dark" : ""}`}>{slide.headline}</h1>
        <p className="usp-sub" style={{ color: slide.accent }}>{slide.sub}</p>
        <p className={`usp-body ${light ? "usp-body-dark" : ""}`}>{slide.body}</p>
      </div>

      <div className="usp-bottom">
        <div className="usp-dots">
          {USP_SLIDES.map((_, i) => (
            <div key={i}
              className={`usp-dot${i === uspSlide ? " usp-dot-on" : ""}`}
              style={i === uspSlide ? { background: slide.accent } : { background: light ? "#CCC" : "#444" }}
              onClick={() => setUspSlide(i)} />
          ))}
        </div>
        <button className="usp-cta"
          style={{ background: slide.accent, color: slide.light ? "#fff" : "#fff" }}
          onClick={() => isLast ? setScreen("onboarding") : setUspSlide(uspSlide + 1)}>
          {isLast ? "Build my system" : "Next"}
        </button>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding() {
  const { obPhase } = useApp();
  return (
    <div className="screen">
      {obPhase === "areas" && <OB_Areas />}
      {obPhase === "chat" && <OB_Chat />}
      {obPhase === "struggles" && <OB_Struggles />}
      {obPhase === "habits" && <OB_Habits />}
      {obPhase === "calendar" && <OB_Calendar />}
      {obPhase === "ready" && <OB_Ready />}
    </div>
  );
}

// ── Life Areas ────────────────────────────────────────────────────────────────
function OB_Areas() {
  const { selectedAreas, toggleArea, startChat } = useApp();
  return (
    <div className="ob-screen fade-in">
      <ObProgress step={1} total={6} />
      <h2 className="ob-h">What matters to you?</h2>
      <p className="ob-p">Pick as many as you want.</p>

      <div className="area-grid">
        {LIFE_AREAS.map(a => {
          const on = selectedAreas.includes(a.id);
          return (
            <button key={a.id}
              className={`area-btn${on ? " area-on" : ""}`}
              style={on ? { borderColor: a.color, background: a.color + "12" } : {}}
              onClick={() => toggleArea(a.id)}>
              <span className="area-icon">{a.icon}</span>
              <span className="area-label">{a.label}</span>
              {on && <span className="area-check" style={{ color: a.color }}>✓</span>}
            </button>
          );
        })}
      </div>

      {selectedAreas.length > 0 && (
        <p className="area-count fade-in">{selectedAreas.length} area{selectedAreas.length !== 1 ? "s" : ""} selected</p>
      )}

      <button className={`btn-primary mt16${selectedAreas.length === 0 ? " btn-off" : ""}`}
        onClick={startChat} disabled={selectedAreas.length === 0}>
        Continue
      </button>
    </div>
  );
}

// ── Conversational Chat ───────────────────────────────────────────────────────
function OB_Chat() {
  const { chatMessages, chatInput, setChatInput, chatLoading, sendChat, coachReady, finishChat, extracting } = useApp();
  const bottomRef = useRef(null);
  const userMsgCount = chatMessages.filter(m => m.role === "user").length;
  const canSkip = userMsgCount >= 3 && !coachReady;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, chatLoading]);

  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }

  return (
    <div className="ob-screen chat-screen">
      <ObProgress step={2} total={6} />
      <div className="chat-header">
        <div className="coach-avatar">1%</div>
        <div><p className="coach-name">Your habit coach</p><p className="coach-sub">Getting to know you</p></div>
      </div>

      <div className="chat-body">
        {chatMessages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === "user" ? "cb-user" : "cb-coach"} fade-in`}>
            <p>{m.content}</p>
          </div>
        ))}
        {chatLoading && (
          <div className="chat-bubble cb-coach fade-in">
            <p className="typing">●●●</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {(coachReady || canSkip) && !extracting && (
        <div className="chat-ready fade-in">
          <p>{coachReady ? "I have what I need." : "Shared enough?"}</p>
          <button className="btn-primary" onClick={finishChat}>Build my system</button>
          {canSkip && !coachReady && <p className="chat-ready-hint">Or keep chatting for a more personalized plan.</p>}
        </div>
      )}

      {extracting && (
        <div className="chat-ready fade-in">
          <p><Dots label="Understanding your goals" /></p>
        </div>
      )}

      {!coachReady && !canSkip && !extracting && (
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1} placeholder="Type here..."
            value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={handleKey} disabled={chatLoading} />
          <button className={`chat-send${!chatInput.trim() || chatLoading ? " send-off" : ""}`}
            onClick={sendChat} disabled={!chatInput.trim() || chatLoading}>↑</button>
        </div>
      )}

      {coachReady && !extracting && (
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1} placeholder="Add more detail or tap Build..."
            value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={handleKey} disabled={chatLoading} />
          <button className={`chat-send${!chatInput.trim() || chatLoading ? " send-off" : ""}`}
            onClick={sendChat} disabled={!chatInput.trim() || chatLoading}>↑</button>
        </div>
      )}

      {canSkip && !coachReady && !extracting && (
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1} placeholder="Type here..."
            value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={handleKey} disabled={chatLoading} />
          <button className={`chat-send${!chatInput.trim() || chatLoading ? " send-off" : ""}`}
            onClick={sendChat} disabled={!chatInput.trim() || chatLoading}>↑</button>
        </div>
      )}
    </div>
  );
}

// ── Config ────────────────────────────────────────────────────────────────────
// ── Struggles ──────────────────────────────────────────────────────────────────
function OB_Struggles() {
  const { struggles, toggleStruggle, generateHabitSuggestions, extractedData } = useApp();
  return (
    <div className="ob-screen fade-in">
      <ObProgress step={3} total={6} />
      <h2 className="ob-h">What gets in the way?</h2>
      <p className="ob-p">Tap what feels familiar.</p>

      {extractedData?.key_insight && (
        <div className="insight-card stagger-1">
          <span>🔑</span>
          <div>
            <p className="ic-label">What the AI noticed</p>
            <p className="ic-text">{extractedData.key_insight}</p>
          </div>
        </div>
      )}

      <div className="struggle-grid stagger-2">
        {STRUGGLES.map(s => {
          const on = struggles.includes(s.id);
          return (
            <button key={s.id} className={`struggle-btn${on ? " struggle-on" : ""}`} onClick={() => toggleStruggle(s.id)}>
              <span className="str-icon">{s.icon}</span>
              <div className="str-text">
                <span className="str-label">{s.label}</span>
                <span className="str-desc">{s.desc}</span>
              </div>
              {on && <span className="str-check">✓</span>}
            </button>
          );
        })}
      </div>

      <button className="btn-primary mt16" onClick={generateHabitSuggestions}>
        {struggles.length > 0 ? "Next" : "Skip"}
      </button>
    </div>
  );
}

// ── Habit Builder ─────────────────────────────────────────────────────────────
function OB_Habits() {
  const { suggestedHabits, toggleHabitSelection, addCustomHabit, removeHabit,
    newHabitText, setNewHabitText, newHabitArea, setNewHabitArea,
    loadingHabits, buildSchedule, selectedAreas, extractedData } = useApp();

  const selectedCount = suggestedHabits.filter(h => h.selected).length;

  if (loadingHabits) return (
    <div className="ob-screen fade-in" style={{ justifyContent: "center", alignItems: "center", background: "#151515" }}>
      <div className="gen-anim">
        <div className="gen-orbit">
          <div className="gen-core" />
          <div className="gen-ring-1" />
          <div className="gen-ring-2" />
          <div className="gen-ring-3" />
        </div>
        <h3 className="gen-title" style={{ color: "#FAFAF8" }}>Finding your habits</h3>
        <div className="gen-steps">
          <p className="gen-step gs-1">Reading your goals</p>
          <p className="gen-step gs-2">Finding what fits</p>
          <p className="gen-step gs-3">Building your options</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ob-screen fade-in">
      <ObProgress step={4} total={6} />
      <h2 className="ob-h">Your habits.</h2>
      <p className="ob-p">Select, remove, or add your own.</p>

      <div className="habit-list">
        {suggestedHabits.map(h => {
          const area = LIFE_AREAS.find(a => a.id === h.area);
          return (
            <div key={h.id} className={`habit-card${h.selected ? " habit-sel" : ""}`}>
              <button className="habit-toggle" onClick={() => toggleHabitSelection(h.id)}>
                {h.selected ? <span className="ht-on">✓</span> : <span className="ht-off" />}
              </button>
              <div className="habit-info" onClick={() => toggleHabitSelection(h.id)}>
                <span className="habit-area-tag" style={{ color: area?.color }}>{area?.icon} {area?.label}</span>
                <span className="habit-action">{h.action}</span>
                {h.twoMin && <span className="habit-twomin">Hard day: {h.twoMin}</span>}
              </div>
              <button className="habit-remove" onClick={() => removeHabit(h.id)}>×</button>
            </div>
          );
        })}
      </div>

      <div className="add-habit-box">
        <p className="ah-label">Add your own habit</p>
        <input className="ob-input" placeholder="e.g. Walk for 20 minutes"
          value={newHabitText} onChange={e => setNewHabitText(e.target.value)} />
        <div className="ah-areas">
          {selectedAreas.map(aId => {
            const a = LIFE_AREAS.find(la => la.id === aId);
            return (
              <button key={aId} className={`ah-area-btn${newHabitArea === aId ? " ah-area-on" : ""}`}
                style={newHabitArea === aId ? { background: a?.color + "18", borderColor: a?.color, color: a?.color } : {}}
                onClick={() => setNewHabitArea(aId)}>
                {a?.icon} {a?.label}
              </button>
            );
          })}
        </div>
        <button className={`btn-secondary${!newHabitText.trim() || !newHabitArea ? " btn-off" : ""}`}
          onClick={addCustomHabit} disabled={!newHabitText.trim() || !newHabitArea}>
          Add habit
        </button>
      </div>

      <div className="habit-footer">
        <p className="hf-count">{selectedCount} habit{selectedCount !== 1 ? "s" : ""} selected</p>
        <button className={`btn-primary${selectedCount === 0 ? " btn-off" : ""}`}
          onClick={buildSchedule} disabled={selectedCount === 0}>
          Next
        </button>
      </div>
    </div>
  );
}

// ── Interactive Calendar ──────────────────────────────────────────────────────
function OB_Calendar() {
  const { weekSchedule, loadingSchedule, confirmSchedule, removeFromSchedule, userHabits, addToSchedule } = useApp();
  const [dragItem, setDragItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(null); // { day, slot }
  const timeSlots = ["morning", "midday", "afternoon", "evening"];
  const slotLabels = { morning: "☀️ Morning", midday: "🌤️ Midday", afternoon: "🌅 Afternoon", evening: "🌙 Evening" };

  if (loadingSchedule) return (
    <div className="ob-screen fade-in" style={{ justifyContent: "center", alignItems: "center", background: "#151515" }}>
      <div className="gen-anim">
        <div className="gen-orbit">
          <div className="gen-core" />
          <div className="gen-ring-1" />
          <div className="gen-ring-2" />
          <div className="gen-ring-3" />
        </div>
        <h3 className="gen-title" style={{ color: "#FAFAF8" }}>Laying out the week</h3>
        <div className="gen-steps">
          <p className="gen-step gs-1">Spreading habits across days</p>
          <p className="gen-step gs-2">Matching time of day</p>
          <p className="gen-step gs-3">Balancing the week</p>
        </div>
      </div>
    </div>
  );

  const totalActions = weekSchedule ? Object.values(weekSchedule).flat().length : 0;

  return (
    <div className="ob-screen fade-in">
      <ObProgress step={5} total={6} />
      <h2 className="ob-h">Your week.</h2>
      <p className="ob-p">Rearrange however you want.</p>

      {showAddModal && (
        <div className="add-modal-bg" onClick={() => setShowAddModal(null)}>
          <div className="add-modal" onClick={e => e.stopPropagation()}>
            <p className="am-title">Add to {DAY_FULL[DAYS.indexOf(showAddModal.day.charAt(0).toUpperCase() + showAddModal.day.slice(1))] || showAddModal.day} — {slotLabels[showAddModal.slot]}</p>
            {userHabits.map(h => {
              const area = LIFE_AREAS.find(a => a.id === h.area);
              return (
                <button key={h.id} className="am-habit" onClick={() => {
                  addToSchedule(showAddModal.day, h, showAddModal.slot);
                  setShowAddModal(null);
                }}>
                  <span style={{ color: area?.color }}>{area?.icon}</span> {h.action}
                </button>
              );
            })}
            <button className="ghost-btn" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="ical">
        {DAYS.map((d, di) => {
          const dayKey = d.toLowerCase();
          const dayActions = weekSchedule?.[dayKey] || [];
          return (
            <div key={d} className="ical-day">
              <div className="ical-day-header">
                <span className="ical-d-name">{DAY_FULL[di]}</span>
                <span className="ical-d-count">{dayActions.length} action{dayActions.length !== 1 ? "s" : ""}</span>
              </div>
              {timeSlots.map(slot => {
                const slotActions = dayActions.filter(a => a.timeSlot === slot);
                return (
                  <div key={slot} className="ical-slot">
                    <span className="ical-slot-label">{slotLabels[slot]}</span>
                    <div className="ical-slot-actions">
                      {slotActions.map((a, ai) => {
                        const area = LIFE_AREAS.find(la => la.id === a.area);
                        const realIdx = dayActions.indexOf(a);
                        return (
                          <div key={ai} className="ical-action" style={{ borderLeftColor: area?.color || "#999" }}>
                            <span className="ical-a-text">{a.action}</span>
                            <button className="ical-a-remove" onClick={() => removeFromSchedule(dayKey, realIdx)}>×</button>
                          </div>
                        );
                      })}
                      <button className="ical-add-btn" onClick={() => setShowAddModal({ day: dayKey, slot })}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="ical-footer">
        <p className="ical-total">{totalActions} actions across the week</p>
        <button className={`btn-primary${totalActions === 0 ? " btn-off" : ""}`}
          onClick={confirmSchedule} disabled={totalActions === 0}>
          Confirm
        </button>
      </div>
    </div>
  );
}

// ── Ready ─────────────────────────────────────────────────────────────────────
function OB_Ready() {
  const { weekPlan, extractedData, enterApp, selectedAreas } = useApp();
  const areas = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)).filter(Boolean);
  return (
    <div className="ob-screen fade-in">
      <div className="ready-top">
        <div className="ready-ring pulse-ring"><span className="ready-check">✓</span></div>
        <h2 className="ready-h">Ready.</h2>
        <p className="ready-sub">{areas.length} areas. One plan. Let's go.</p>
      </div>
      <div className="ready-areas">
        {areas.map(a => (
          <span key={a.id} className="ra-pill" style={{ background: a.color + "18", color: a.color, borderColor: a.color + "40" }}>
            {a.icon} {a.label}
          </span>
        ))}
      </div>
      {extractedData?.identity && <p className="id-line" style={{ textAlign: "center", marginBottom: 12 }}>🪞 Becoming: <strong>a {extractedData.identity}</strong></p>}
      <div className="ready-plan-name">
        <p className="rpn">{weekPlan?.name}</p>
        <p className="rpp">{weekPlan?.philosophy}</p>
      </div>
      <button className="btn-glow mt12" onClick={enterApp}>Start</button>
    </div>
  );
}

// ─── TODAY ─────────────────────────────────────────────────────────────────────
function TodayScreen() {
  const {
    dayNumber, weekDay, todayActions, tomorrowActions,
    checked, partialChecked, toggleComplete, togglePartial,
    expandedAction, setExpandedAction,
    completedCount, partialCount, totalActions, setScreen,
    isReturning, setIsReturning, comebackMode, setComebackMode,
    simulateDay, weekPlan, startReplanning, milestone, dismissMilestone,
    extractedData,
  } = useApp();
  const allDone = completedCount === totalActions && totalActions > 0;
  const pct = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

  return (
    <div className="screen pad">
      {milestone && (
        <div className="milestone-overlay fade-in" onClick={dismissMilestone}>
          <div className="milestone-card" onClick={e => e.stopPropagation()}>
            <span className="ms-icon">{milestone.icon}</span>
            <h3 className="ms-title">{milestone.title}</h3>
            <p className="ms-msg">{milestone.msg}</p>
            <button className="btn-primary" onClick={dismissMilestone} style={{ marginTop: 14 }}>Continue</button>
          </div>
        </div>
      )}

      {comebackMode && (
        <div className="comeback fade-in">
          <span>🌱</span>
          <div className="comeback-body">
            <p className="cb-t">You're back.</p>
            <p className="cb-s">That's the hardest part done.</p>
            <button className="cb-keep" onClick={() => setComebackMode(false)}>Let's go</button>
          </div>
        </div>
      )}

      {isReturning && !comebackMode && (
        <div className="return-banner fade-in">
          <span>👋</span><div><p className="ret-t">Welcome back.</p></div>
          <button className="ret-x" onClick={() => setIsReturning(false)}>×</button>
        </div>
      )}

      <div className="today-top">
        <p className="eyebrow">{DAY_FULL[weekDay]} · Day {dayNumber}</p>
        {weekPlan && <p className="today-plan">📋 {weekPlan.name}</p>}
      </div>

      <div className="pstrip">
        <ProgressRing done={completedCount} total={totalActions} size={68} />
        <div className="pstrip-mid">
          <span className="pbig">{completedCount}<span className="ptot">/{totalActions}</span></span>
          <p className="plbl">done today</p>
          {partialCount > 0 && <p className="plbl-p">+{partialCount} partial</p>}
        </div>
        <div className="pct-badge">{pct}%</div>
      </div>

      <WeekCalendar />

      <div className="action-list">
        {todayActions.map((a, i) => (
          <ActionCard key={i} idx={i} action={a}
            done={!!checked[i]} partial={!!partialChecked[i]}
            expanded={expandedAction === i}
            onExpand={() => setExpandedAction(expandedAction === i ? null : i)}
            onComplete={() => toggleComplete(i)}
            onPartial={() => togglePartial(i)} />
        ))}
      </div>

      {allDone && (
        <div className="all-done fade-in">
          <span style={{ fontSize: 34 }}>🔥</span>
          <p className="done-msg">Done.</p>
          <button className="btn-secondary" onClick={() => setScreen("reflection")}>Evening check-in</button>
        </div>
      )}

      {tomorrowActions.length > 0 && (
        <div className="tomorrow-peek">
          <p className="tp-label">Tomorrow · {DAY_FULL[(weekDay + 1) % 7]}</p>
          {tomorrowActions.map((a, i) => {
            const area = LIFE_AREAS.find(la => la.id === a.area);
            return <p key={i} className="tp-action"><span className="tp-dot" style={{ color: area?.color || "#999" }}>●</span> {a.action}</p>;
          })}
        </div>
      )}

      <button className="plan-refresh-btn" onClick={startReplanning}>🔄 Plan next week</button>

      <div className="proto">
        <p className="proto-lbl">Prototype controls</p>
        <div className="proto-row">
          <button className="proto-btn" onClick={() => simulateDay(1)}>Next day</button>
          <button className="proto-btn" onClick={() => simulateDay(2)}>Skip 1</button>
          <button className="proto-btn" onClick={() => simulateDay(4)}>Skip 3</button>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ idx, action, done, partial, expanded, onExpand, onComplete, onPartial }) {
  const a = action;
  const area = LIFE_AREAS.find(la => la.id === a.area);
  const cls = done ? " ac-done" : partial ? " ac-partial" : "";
  const trigger = a.selectedTrigger || a.trigger || (a.suggestedTriggers?.[0]) || "";
  const timeLabel = a.timeSlot === "morning" ? "☀️ Morning" : a.timeSlot === "midday" ? "🌤️ Midday" : a.timeSlot === "afternoon" ? "🌅 Afternoon" : a.timeSlot === "evening" ? "🌙 Evening" : "";

  return (
    <div className={`acard${cls}`}>
      <div className="acard-inner">
        <button className={`acircle${done ? " acircle-done" : partial ? " acircle-partial" : ""}`} onClick={onComplete}>
          {done ? "✓" : partial ? "½" : <span className="ac-tap">tap</span>}
        </button>
        <div className="acard-text" onClick={onExpand} style={{ cursor: "pointer" }}>
          <div className="acard-meta">
            {area && <span className="acard-area" style={{ color: area.color }}>{area.icon} {area.label}</span>}
            {timeLabel && <span className="acard-time">{timeLabel}</span>}
          </div>
          <span className="acard-name">{a.action}</span>
          {!done && !partial && trigger && <span className="acard-trigger">{trigger}</span>}
        </div>
        {!done && <button className={`half-btn${partial ? " half-on" : ""}`} onClick={onPartial}>½</button>}
      </div>
      {expanded && (
        <div className="acard-detail fade-in">
          {a.suggestedTriggers && a.suggestedTriggers.length > 0 && (
            <div className="ad-triggers">
              <span className="ad-l">Trigger</span>
              <div className="ad-trigger-opts">
                {a.suggestedTriggers.map((t, ti) => (
                  <button key={ti} className={`ad-trig-btn${(a.selectedTrigger || a.suggestedTriggers[0]) === t ? " ad-trig-on" : ""}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!a.suggestedTriggers && trigger && <div className="ad-row"><span className="ad-l">Trigger</span><span className="ad-v">{trigger}</span></div>}
          {a.twoMin && <div className="ad-row"><span className="ad-l">Hard day</span><span className="ad-v">{a.twoMin}</span></div>}
          {a.identity && <div className="ad-row"><span className="ad-l">Identity</span><span className="ad-v">{a.identity}</span></div>}
        </div>
      )}
    </div>
  );
}

function WeekCalendar() {
  const { weekPlan, weekDay, checked } = useApp();
  if (!weekPlan) return null;

  const timeSlots = ["morning", "midday", "afternoon", "evening"];
  const slotLabels = { morning: "AM", midday: "Mid", afternoon: "PM", evening: "Eve" };

  return (
    <div className="wcal">
      <p className="sec-lbl">This week</p>
      <div className="wcal-grid">
        <div className="wcal-header">
          <div className="wcal-time-col" />
          {DAYS.map((d, i) => (
            <div key={d} className={`wcal-day-col${i === weekDay ? " wcal-today" : ""}`}>
              <span className="wcal-d">{d}</span>
            </div>
          ))}
        </div>
        {timeSlots.map(slot => (
          <div key={slot} className="wcal-row">
            <div className="wcal-time-col"><span className="wcal-time">{slotLabels[slot]}</span></div>
            {DAYS.map((d, di) => {
              const dayKey = d.toLowerCase();
              const actions = (weekPlan.days[dayKey] || []).filter(a => a.timeSlot === slot);
              const isToday = di === weekDay;
              return (
                <div key={d} className={`wcal-cell${isToday ? " wcal-cell-today" : ""}`}>
                  {actions.map((a, ai) => {
                    const area = LIFE_AREAS.find(la => la.id === a.area);
                    return (
                      <div key={ai} className="wcal-block" style={{ background: (area?.color || "#999") + "20", borderLeft: `3px solid ${area?.color || "#999"}` }}>
                        <span className="wcal-block-text">{a.action.length > 18 ? a.action.slice(0, 18) + "…" : a.action}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressRing({ done, total, size }) {
  const r = (size / 2) - 6, sw = 5, c = 2 * Math.PI * r;
  const fill = total > 0 ? (done / total) * c : 0;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDECEA" strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A1A1A" strokeWidth={sw}
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
    </svg>
  );
}

// ─── NUDGES ───────────────────────────────────────────────────────────────────
function NudgesScreen() {
  const { todayActions, checked, completedCount, totalActions, setScreen, weekDay, extractedData } = useApp();
  const insight = extractedData?.key_insight;
  return (
    <div className="screen pad">
      <p className="eyebrow">Daily nudge · {DAY_FULL[weekDay]}</p>
      <div className="nudge-card fade-in">
        <span className="nudge-icon">🔑</span>
        <p className="nudge-msg">{insight || "Each action is a vote for who you're becoming."}</p>
      </div>
      <div className="nudge-status">
        <p className="ns-lbl">Today's actions</p>
        {todayActions.map((a, i) => {
          const area = LIFE_AREAS.find(la => la.id === a.area);
          return (
            <div key={i} className={`mpill${checked[i] ? " mpill-done" : ""}`}>
              <span style={{ color: area?.color }}>{area?.icon || "○"}</span><span>{a.action}</span>
            </div>
          );
        })}
        <p className="ns-count">{completedCount} of {totalActions} done</p>
      </div>
      <button className="btn-primary" onClick={() => setScreen("today")}>Back to today</button>
    </div>
  );
}

// ─── REFLECTION ───────────────────────────────────────────────────────────────
function ReflectionScreen() {
  const { checkinDone, setCheckinDone, checkinChoice, setCheckinChoice, showWritePrompt, setShowWritePrompt, checkinNote, setCheckinNote, completedCount, totalActions, todayActions, checked, dayNumber, weekDay } = useApp();
  const pct = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

  function handleChoice(id) { setCheckinChoice(id); setShowWritePrompt(dayNumber % 3 === 0); setCheckinDone(true); }

  if (checkinDone) return (
    <div className="screen pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="done-pct fade-in">{pct}%</div>
      <h2 className="done-h">Day {dayNumber} done.</h2>
      <p className="done-resp fade-in">{CHECKIN_RESPONSES[checkinChoice]}</p>
      {showWritePrompt && (
        <div className="write-box fade-in">
          <p className="wb-label">Anything on your mind? (optional)</p>
          <textarea className="ob-input" rows={3} placeholder="Just for you." value={checkinNote} onChange={e => setCheckinNote(e.target.value)} />
        </div>
      )}
      <p className="done-foot">See you tomorrow.</p>
    </div>
  );

  return (
    <div className="screen pad">
      <p className="eyebrow">Check-in · {DAY_FULL[weekDay]}</p>
      <h2 className="ob-h" style={{ fontSize: 24 }}>How was today?</h2>
      <div className="checkin-grid">
        {CHECKIN_OPTIONS.map(opt => (
          <button key={opt.id} className="checkin-btn" onClick={() => handleChoice(opt.id)}>
            <span className="ci-icon">{opt.icon}</span><span className="ci-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function ProgressScreen() {
  const { completionHistory, dayNumber, daysWithActivity, totalDaysTracked, consistencyPct, extractedData, weekPlan, weekDay, selectedAreas, earnedMilestones } = useApp();
  const showPct = totalDaysTracked >= 7;
  const areas = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="screen pad">
      <p className="eyebrow">Progress</p>
      <h2 className="ob-h" style={{ fontSize: 26, marginBottom: 14 }}>Progress</h2>

      {extractedData?.identity && (
        <div className="id-card stagger-1"><span>🪞</span><div><p className="id-lbl">Identity</p><p className="id-txt">Becoming: <strong>a {extractedData.identity}</strong></p></div></div>
      )}

      <div className="cons-card stagger-2">
        <div className="cons-left">
          {showPct ? <><p className="cons-big">{consistencyPct}%</p><p className="cons-lbl">consistency</p></> : <><p className="cons-big">{daysWithActivity}</p><p className="cons-lbl">day{daysWithActivity !== 1 ? "s" : ""} active</p></>}
        </div>
        <div className="cons-right">
          <p className="cons-det">{daysWithActivity} of {totalDaysTracked || 0} days active</p>
          {showPct && <p className="cons-note">Better than not starting.</p>}
        </div>
      </div>

      <div className="areas-progress stagger-3">
        <p className="sec-lbl">Life areas</p>
        <div className="ap-row">
          {areas.map(a => (
            <span key={a.id} className="ap-pill" style={{ background: a.color + "18", color: a.color }}>
              {a.icon} {a.label}
            </span>
          ))}
        </div>
      </div>

      {earnedMilestones.length > 0 && (
        <div className="milestones-card stagger-4">
          <p className="sec-lbl">Milestones</p>
          {earnedMilestones.map(m => (
            <div key={m.day} className="ms-row">
              <span className="ms-r-icon">{m.icon}</span>
              <div><p className="ms-r-title">{m.title}</p><p className="ms-r-day">Day {m.day}</p></div>
            </div>
          ))}
        </div>
      )}

      {totalDaysTracked > 0 && (
        <div className="cal-card stagger-4">
          <p className="sec-lbl">History</p>
          <div className="calgrid">
            {completionHistory.map((d, i) => (
              <div key={i} className={`cdot${d.completed > 0 || d.partial > 0 ? " cdot-on" : " cdot-off"}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REPLAN ───────────────────────────────────────────────────────────────────
function ReplanScreen() {
  const { planOptions, loadingPlans, selectedPlanIdx, confirmPlan, setScreen, setPlanningMode } = useApp();
  const [viewing, setViewing] = useState(null);

  if (loadingPlans) return (
    <div className="screen pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#151515" }}>
      <div className="gen-orbit">
        <div className="gen-core" />
        <div className="gen-ring-1" />
        <div className="gen-ring-2" />
        <div className="gen-ring-3" />
      </div>
      <h3 className="gen-title" style={{ color: "#FAFAF8", marginTop: 20 }}>Building next week</h3>
      <p style={{ fontSize: 13, color: "rgba(250,250,248,0.4)", marginTop: 6 }}>Based on how this week went.</p>
    </div>
  );

  if (viewing !== null && planOptions?.[viewing]) {
    const plan = planOptions[viewing];
    return (
      <div className="screen pad fade-in">
        <button className="ghost-btn" style={{ textAlign: "left" }} onClick={() => setViewing(null)}>← Back</button>
        <h2 className="ob-h" style={{ fontSize: 20 }}>{plan.name}</h2>
        <p className="ob-p">{plan.philosophy}</p>
        <div className="week-detail">
          {DAYS.map((d, di) => (
            <div key={d} className="wd-day">
              <span className="wd-label">{DAY_FULL[di]}</span>
              {(plan.days[d.toLowerCase()] || []).map((a, ai) => (
                <div key={ai} className="wd-action">
                  <div className="wd-area-dot" style={{ background: LIFE_AREAS.find(la => la.id === a.area)?.color || "#999" }} />
                  <div><p className="wd-action-name">{a.action}</p><p className="wd-trigger">{a.trigger}</p></div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <button className="btn-primary mt16" onClick={() => { confirmPlan(viewing); setViewing(null); }}>Choose this plan</button>
      </div>
    );
  }

  return (
    <div className="screen pad fade-in">
      <p className="eyebrow">New week</p>
      <h2 className="ob-h">Next week.</h2>
      {planOptions?.map((plan, idx) => (
        <div key={idx} className={`plan-card${selectedPlanIdx === idx ? " plan-sel" : ""}`} style={{ marginBottom: 10 }}>
          <div className="plan-card-top" onClick={() => setViewing(idx)}>
            <div className="plan-badge">{["A","B","C"][idx]}</div>
            <div className="plan-info"><h3 className="plan-name">{plan.name}</h3><p className="plan-phil">{plan.philosophy}</p></div>
          </div>
          <div className="plan-actions">
            <button className="plan-view-btn" onClick={() => setViewing(idx)}>View</button>
            <button className={`plan-choose-btn${selectedPlanIdx === idx ? " chosen" : ""}`} onClick={() => confirmPlan(idx)}>
              {selectedPlanIdx === idx ? "✓ Selected" : "Choose"}
            </button>
          </div>
        </div>
      ))}
      <button className={`btn-primary mt16${selectedPlanIdx === null ? " btn-off" : ""}`}
        onClick={() => { if (selectedPlanIdx !== null) setScreen("today"); }} disabled={selectedPlanIdx === null}>
        Confirm
      </button>
      <button className="ghost-btn" onClick={() => setScreen("today")}>Keep current plan</button>
    </div>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
function BottomNav() {
  const { screen, setScreen } = useApp();
  const tabs = [
    { id: "today", icon: "◎", label: "Today" },
    { id: "nudges", icon: "💡", label: "Nudge" },
    { id: "reflection", icon: "◐", label: "Check-in" },
    { id: "progress", icon: "↗", label: "Progress" },
  ];
  return (
    <nav className="bnav">
      {tabs.map(t => (
        <button key={t.id} className={`nbtn${screen === t.id ? " nbtn-on" : ""}`} onClick={() => setScreen(t.id)}>
          <span className="nico">{t.icon}</span><span className="nlbl">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

function ObProgress({ step, total }) {
  return <div className="ob-prog">{Array.from({ length: total }, (_, i) => <div key={i} className={`op-seg${i < step ? " op-done" : i === step ? " op-act" : ""}`} />)}</div>;
}

function Dots({ label }) {
  return <span className="dots-wrap">{label}<span className="dot-anim"> ●</span><span className="dot-anim">●</span><span className="dot-anim">●</span></span>;
}

// ─── FALLBACK PLANS ───────────────────────────────────────────────────────────
function generateFallbackPlans(load, areas) {
  const a = areas[0] || "health";
  const makeDay = (acts) => acts.slice(0, load);
  const triggers = ["After I pour my morning coffee","After I sit down at my desk","After I eat dinner"];
  return [
    { name: "Balanced Rhythm", philosophy: "Touch every area across the week.",
      days: { mon: makeDay([{ action: "15-min focused session", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Open materials", identity: "I am consistent", area: a }]),
        tue: makeDay([{ action: "10-min journal", timeSlot: "evening", suggestedTriggers: triggers, twoMin: "Write one line", identity: "I am reflective", area: areas[1] || a }]),
        wed: makeDay([{ action: "20-min practice", timeSlot: "midday", suggestedTriggers: triggers, twoMin: "Start timer", identity: "I am growing", area: a }]),
        thu: makeDay([{ action: "15-min planning", timeSlot: "evening", suggestedTriggers: triggers, twoMin: "Open calendar", identity: "I am prepared", area: areas[1] || a }]),
        fri: makeDay([{ action: "25-min deep work", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Open project", identity: "I am focused", area: a }]),
        sat: makeDay([{ action: "30-min exploration", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Browse ideas", identity: "I am curious", area: areas[2] || a }]),
        sun: makeDay([{ action: "Weekly review", timeSlot: "evening", suggestedTriggers: triggers, twoMin: "Open notes", identity: "I plan ahead", area: a }]) }
    },
    { name: "Energy Matched", philosophy: "High energy mornings, reflective evenings.",
      days: { mon: makeDay([{ action: "Morning movement", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Stretch once", identity: "I am active", area: "health" }]),
        tue: makeDay([{ action: "Skill practice", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Open tool", identity: "I am learning", area: areas[1] || a }]),
        wed: makeDay([{ action: "Creative session", timeSlot: "afternoon", suggestedTriggers: triggers, twoMin: "Sketch one idea", identity: "I create", area: a }]),
        thu: makeDay([{ action: "Connection time", timeSlot: "evening", suggestedTriggers: triggers, twoMin: "Send one message", identity: "I nurture bonds", area: "relations" }]),
        fri: makeDay([{ action: "Focus block", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Write first line", identity: "I am productive", area: a }]),
        sat: makeDay([{ action: "Fun activity", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Choose activity", identity: "I enjoy life", area: "fun" }]),
        sun: makeDay([{ action: "Reflect and plan", timeSlot: "evening", suggestedTriggers: triggers, twoMin: "Open journal", identity: "I am intentional", area: a }]) }
    },
    { name: "Deep Focus", philosophy: "One area per day. Full attention.",
      days: { mon: makeDay([{ action: "Health focus", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Put on shoes", identity: "I am healthy", area: "health" }]),
        tue: makeDay([{ action: "Career focus", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Open project", identity: "I am building", area: "career" }]),
        wed: makeDay([{ action: "Growth focus", timeSlot: "afternoon", suggestedTriggers: triggers, twoMin: "Open book", identity: "I am learning", area: "growth" }]),
        thu: makeDay([{ action: "Relationship focus", timeSlot: "evening", suggestedTriggers: triggers, twoMin: "Text someone", identity: "I connect", area: "relations" }]),
        fri: makeDay([{ action: "Career push", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Write one line", identity: "I am driven", area: "career" }]),
        sat: makeDay([{ action: "Fun and creativity", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Pick up tool", identity: "I play", area: "fun" }]),
        sun: makeDay([{ action: "Spiritual reflection", timeSlot: "morning", suggestedTriggers: triggers, twoMin: "Sit quietly 1 min", identity: "I am centered", area: "spiritual" }]) }
    }
  ];
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Satoshi:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{margin:0;padding:0;width:100%;height:100%;background:var(--bg,#FAFAF8);}#root{width:100%;min-height:100vh;min-height:100dvh;}
:root{
  --bg:#FAFAF8;--ink:#151515;--muted:#999;--border:#ECEAE6;
  --warm:#F3F2EF;--accent:#C2632A;--green:#1A6B44;--green-bg:#EDF8F2;
  --font-display:'Instrument Serif',serif;
  --font-body:'Satoshi',sans-serif;
}
.app-root{width:100%;max-width:100%;margin:0 auto;min-height:100vh;min-height:100dvh;background:var(--bg);display:flex;flex-direction:column;font-family:var(--font-body);position:relative;}
.screen-area{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-top:env(safe-area-inset-top);}.screen-area::-webkit-scrollbar{display:none;}
.screen{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;}.pad{padding:20px 22px;}

/* Animations */
.fade-in{animation:fadeIn 0.4s ease both;}@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.stagger-1{animation:fadeIn 0.4s ease 0.1s both;}.stagger-2{animation:fadeIn 0.4s ease 0.2s both;}.stagger-3{animation:fadeIn 0.4s ease 0.3s both;}.stagger-4{animation:fadeIn 0.4s ease 0.4s both;}
.pulse-ring{animation:pulse 2s ease infinite;}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(21,21,21,0.2);}50%{box-shadow:0 0 0 12px rgba(21,21,21,0);}}

/* USP Carousel */
.usp-screen{position:relative;padding:0;display:flex;flex-direction:column;overflow:hidden;transition:background 0.5s ease;min-height:100vh;min-height:100dvh;}
.usp-grain{position:absolute;inset:0;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");pointer-events:none;z-index:1;}
.usp-accent-glow{position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(100px);opacity:0.12;top:30%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:0;}
.usp-top-bar{display:flex;justify-content:space-between;align-items:center;padding:18px 24px 0;position:relative;z-index:2;}
.usp-logo{font-family:var(--font-display);font-size:28px;color:#FAFAF8;}.usp-logo-dark{color:#151515;}
.usp-skip{font-size:13px;font-weight:600;color:rgba(250,250,248,0.4);background:none;border:none;cursor:pointer;}.usp-skip-dark{color:rgba(21,21,21,0.35);}
.usp-main{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 32px;}
.usp-num{font-family:var(--font-display);font-size:72px;line-height:1;margin-bottom:8px;opacity:0.6;}
.usp-headline{font-family:var(--font-display);font-size:34px;color:#FAFAF8;line-height:1.1;margin-bottom:6px;}.usp-hl-dark{color:#151515;}
.usp-sub{font-size:15px;font-weight:700;margin-bottom:18px;}
.usp-body{font-size:14px;color:rgba(250,250,248,0.55);line-height:1.7;max-width:300px;}.usp-body-dark{color:rgba(21,21,21,0.5);}
.usp-bottom{position:relative;z-index:2;padding:0 32px 36px;display:flex;flex-direction:column;align-items:center;gap:16px;}
.usp-dots{display:flex;gap:8px;}
.usp-dot{width:8px;height:8px;border-radius:50%;cursor:pointer;transition:0.3s;}.usp-dot-on{width:28px;border-radius:4px;}
.usp-cta{width:100%;padding:17px;border:none;border-radius:16px;font-size:15px;font-weight:700;cursor:pointer;transition:0.15s;letter-spacing:0.3px;}.usp-cta:hover{transform:translateY(-2px);}

/* Onboarding shared */
.ob-screen{padding:20px 22px 24px;display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;overflow-y:auto;}
.ob-prog{display:flex;gap:4px;margin-bottom:20px;}.op-seg{flex:1;height:3px;border-radius:2px;background:var(--border);transition:0.3s;}.op-done{background:var(--ink);}.op-act{background:#888;}
.ob-eye{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:8px;}
.ob-h{font-family:var(--font-display);font-size:30px;color:var(--ink);line-height:1.15;margin-bottom:10px;}
.ob-h2{font-family:var(--font-display);font-size:20px;color:var(--ink);margin-bottom:8px;}
.ob-p{font-size:13px;color:var(--muted);line-height:1.65;margin-bottom:12px;}
.ob-input{width:100%;background:var(--warm);border:2px solid transparent;border-radius:16px;padding:14px 16px;font-family:var(--font-body);font-size:15px;color:var(--ink);resize:none;outline:none;transition:0.2s;display:block;}.ob-input:focus{border-color:var(--ink);}

/* Area selection */
.area-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
.area-btn{background:#fff;border:2px solid var(--border);border-radius:18px;padding:16px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;font-family:var(--font-body);transition:0.2s;position:relative;}
.area-btn:hover{border-color:#CCC;}.area-on{border-width:2px;}.area-dis{opacity:0.35;cursor:not-allowed;}
.area-icon{font-size:22px;}.area-label{font-size:12px;font-weight:700;color:var(--ink);flex:1;line-height:1.3;}
.area-check{position:absolute;top:8px;right:10px;font-size:14px;font-weight:800;}
.area-count{font-size:12px;color:var(--muted);text-align:center;margin-bottom:4px;}

/* Chat */
.chat-screen{display:flex;flex-direction:column;height:100%;}
.chat-header{display:flex;gap:12px;padding:0 0 14px;border-bottom:1px solid var(--border);align-items:center;margin-bottom:10px;}
.coach-avatar{width:40px;height:40px;background:var(--ink);color:var(--bg);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:14px;font-weight:700;flex-shrink:0;}
.coach-name{font-size:14px;font-weight:700;color:var(--ink);}.coach-sub{font-size:11px;color:var(--muted);}
.chat-body{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding-bottom:12px;scrollbar-width:none;}.chat-body::-webkit-scrollbar{display:none;}
.chat-bubble{max-width:82%;padding:12px 16px;border-radius:20px;font-size:14px;line-height:1.55;word-wrap:break-word;}
.cb-coach{background:var(--warm);color:var(--ink);align-self:flex-start;border-bottom-left-radius:6px;}
.cb-user{background:var(--ink);color:var(--bg);align-self:flex-end;border-bottom-right-radius:6px;}
.typing{color:var(--muted);animation:blink 1.2s infinite;}
.chat-ready{background:var(--warm);border-radius:18px;padding:16px;text-align:center;margin-top:auto;}
.chat-ready p{font-size:13px;color:var(--muted);margin-bottom:10px;}
.chat-input-row{display:flex;gap:8px;margin-top:auto;padding-top:10px;border-top:1px solid var(--border);}
.chat-input{flex:1;background:var(--warm);border:none;border-radius:20px;padding:12px 16px;font-family:var(--font-body);font-size:14px;color:var(--ink);resize:none;outline:none;}
.chat-send{width:40px;height:40px;border-radius:50%;background:var(--ink);color:var(--bg);border:none;font-size:18px;font-weight:700;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:0.15s;}
.send-off{opacity:0.25;cursor:not-allowed;}

/* Config */
.insight-card{display:flex;gap:10px;background:#FFF8F0;border:1px solid #FDE8D0;border-radius:16px;padding:14px;margin-bottom:12px;align-items:flex-start;}
.ic-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C2632A;font-weight:600;margin-bottom:3px;}.ic-text{font-size:13px;color:#7C4A1E;line-height:1.5;font-weight:600;}
.goals-summary{background:var(--warm);border-radius:18px;padding:14px;margin-bottom:12px;display:flex;flex-direction:column;gap:10px;}
.gs-row{display:flex;gap:10px;align-items:flex-start;}.gs-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
.gs-area{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;margin-bottom:2px;}.gs-goal{font-size:13px;color:var(--ink);font-weight:600;line-height:1.4;}
.id-line{font-size:13px;color:var(--muted);margin-bottom:8px;}.id-line strong{color:var(--ink);}

.load-grid{display:flex;flex-direction:column;gap:8px;margin-bottom:4px;}
.load-btn{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:14px;cursor:pointer;text-align:left;transition:0.2s;font-family:var(--font-body);}.load-on{background:var(--ink);border-color:var(--ink);}
.load-top{display:flex;align-items:center;gap:8px;margin-bottom:4px;}.load-icon{font-size:18px;}.load-name{font-size:14px;font-weight:700;color:var(--ink);flex:1;}.load-on .load-name{color:var(--bg);}.load-n{font-size:12px;font-weight:700;color:var(--muted);}.load-on .load-n{color:rgba(250,250,248,0.5);}
.load-desc{font-size:11px;color:#888;line-height:1.5;}.load-on .load-desc{color:rgba(250,250,248,0.6);}
.diff-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;}
.diff-btn{background:var(--warm);border:2px solid transparent;border-radius:14px;padding:10px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:0.2s;font-family:var(--font-body);}.diff-on{background:var(--ink);border-color:var(--ink);}
.diff-lbl{font-size:12px;font-weight:700;color:var(--ink);}.diff-on .diff-lbl{color:var(--bg);}.diff-t{font-size:10px;color:var(--muted);}.diff-on .diff-t{color:rgba(250,250,248,0.5);}

/* Plan gen */
.gen-anim{display:flex;flex-direction:column;align-items:center;text-align:center;padding:20px;}
.gen-orbit{position:relative;width:120px;height:120px;margin-bottom:28px;}
.gen-core{position:absolute;width:16px;height:16px;background:#C2632A;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 0 30px rgba(194,99,42,0.5);}
.gen-ring-1,.gen-ring-2,.gen-ring-3{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(250,250,248,0.08);}
.gen-ring-1{inset:15px;border-color:rgba(250,250,248,0.12);animation:orbitSpin 3s linear infinite;}
.gen-ring-2{inset:5px;border-color:rgba(250,250,248,0.06);animation:orbitSpin 5s linear infinite reverse;}
.gen-ring-3{inset:-2px;border-color:rgba(250,250,248,0.04);animation:orbitSpin 8s linear infinite;}
.gen-ring-1::after,.gen-ring-2::after,.gen-ring-3::after{content:"";position:absolute;width:6px;height:6px;border-radius:50%;top:-3px;left:50%;transform:translateX(-50%);}
.gen-ring-1::after{background:#2D9A6F;box-shadow:0 0 10px rgba(45,154,111,0.6);}
.gen-ring-2::after{background:#7C5CBF;box-shadow:0 0 10px rgba(124,92,191,0.6);}
.gen-ring-3::after{background:#2563EB;box-shadow:0 0 10px rgba(37,99,235,0.6);}
@keyframes orbitSpin{to{transform:rotate(360deg);}}
.gen-title{font-family:var(--font-display);font-size:24px;color:var(--ink);margin-bottom:6px;}
.gen-sub{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:24px;}
.gen-steps{display:flex;flex-direction:column;gap:10px;text-align:left;}
.gen-step{font-size:13px;color:rgba(250,250,248,0.3);line-height:1.5;transition:all 0.5s ease;padding-left:16px;position:relative;}
.gen-step::before{content:"";position:absolute;left:0;top:7px;width:6px;height:6px;border-radius:50%;background:rgba(250,250,248,0.15);}
.gs-1{animation:stepGlow 6s ease 0.5s both;}.gs-2{animation:stepGlow 6s ease 2s both;}.gs-3{animation:stepGlow 6s ease 3.5s both;}.gs-4{animation:stepGlow 6s ease 5s both;}
@keyframes stepGlow{0%{color:rgba(250,250,248,0.3);}15%{color:rgba(250,250,248,0.9);}50%,100%{color:rgba(250,250,248,0.45);}}

/* Plan cards */
.plan-cards{display:flex;flex-direction:column;gap:10px;margin-bottom:8px;}
.plan-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;overflow:hidden;transition:0.2s;}.plan-sel{border-color:var(--ink);box-shadow:0 2px 12px rgba(21,21,21,0.1);}
.plan-card-top{display:flex;gap:12px;padding:14px 16px;cursor:pointer;align-items:flex-start;}
.plan-badge{width:32px;height:32px;background:var(--ink);color:var(--bg);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:15px;flex-shrink:0;}
.plan-info{flex:1;}.plan-name{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:2px;}.plan-phil{font-size:11px;color:var(--muted);line-height:1.4;}
.plan-actions{display:flex;gap:8px;padding:0 16px 14px;}
.plan-view-btn{flex:1;padding:8px;background:var(--warm);border:none;border-radius:10px;font-size:12px;font-weight:700;color:var(--ink);cursor:pointer;}
.plan-choose-btn{flex:1;padding:8px;background:var(--ink);border:none;border-radius:10px;font-size:12px;font-weight:700;color:var(--bg);cursor:pointer;}.chosen{background:var(--green-bg);color:var(--green);border:1px solid #BBF7D0;}

/* Week detail */
.week-detail{display:flex;flex-direction:column;gap:8px;margin-bottom:8px;}
.wd-day{background:var(--warm);border-radius:14px;padding:12px 14px;}.wd-label{font-size:12px;font-weight:700;color:var(--ink);display:block;margin-bottom:6px;}
.wd-action{display:flex;gap:8px;margin-bottom:6px;align-items:flex-start;}
.wd-area-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.wd-action-name{font-size:13px;font-weight:600;color:var(--ink);}.wd-trigger{font-size:11px;color:var(--accent);font-weight:600;}.wd-mini{font-size:10px;color:#4A9D6F;font-style:italic;}

/* Ready */
.ready-top{text-align:center;padding:8px 0 16px;}
.ready-ring{width:72px;height:72px;background:var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}.ready-check{font-size:28px;color:var(--bg);}
.ready-h{font-family:var(--font-display);font-size:30px;color:var(--ink);line-height:1.2;margin-bottom:8px;}.ready-sub{font-size:13px;color:var(--muted);}
.ready-areas{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:14px;}
.ra-pill{font-size:12px;font-weight:700;padding:6px 14px;border-radius:20px;border:1.5px solid;}
.ready-plan-name{background:var(--warm);border-radius:18px;padding:16px;text-align:center;margin-bottom:14px;}
.rpn{font-family:var(--font-display);font-size:20px;color:var(--ink);margin-bottom:4px;}.rpp{font-size:12px;color:#666;line-height:1.5;}

/* Today */
.eyebrow{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:6px;}
.today-top{margin-bottom:12px;}.today-plan{font-size:11px;color:var(--muted);}
.pstrip{display:flex;align-items:center;gap:14px;background:var(--warm);border-radius:20px;padding:14px 18px;margin-bottom:12px;}
.pstrip-mid{display:flex;flex-direction:column;}.pbig{font-family:var(--font-display);font-size:42px;color:var(--ink);line-height:1;}.ptot{font-size:22px;color:#CCC;}.plbl{font-size:11px;color:var(--muted);margin-top:2px;}.plbl-p{font-size:10px;color:var(--accent);font-weight:600;}
.pct-badge{margin-left:auto;background:var(--ink);color:var(--bg);font-family:var(--font-display);font-size:18px;padding:8px 12px;border-radius:12px;}

/* Action cards */
.action-list{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
.acard{background:#fff;border:1.5px solid var(--border);border-radius:18px;overflow:hidden;transition:0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.03);}
.ac-done{background:var(--ink);border-color:var(--ink);}.ac-partial{background:#FFFBEB;border-color:#FDE68A;}
.acard-inner{display:flex;align-items:center;gap:12px;padding:14px;}
.acircle{width:44px;height:44px;border-radius:50%;border:2px solid #DDD;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;background:transparent;font-size:16px;font-weight:700;color:var(--ink);transition:0.2s;}
.acircle-done{background:var(--bg);border-color:var(--bg);}.acircle-partial{background:#FDE68A;border-color:#F59E0B;}
.ac-tap{font-size:9px;color:#CCC;letter-spacing:1px;text-transform:uppercase;font-weight:600;}
.acard-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.acard-area{font-size:10px;font-weight:700;letter-spacing:0.5px;}
.acard-name{font-size:14px;font-weight:600;color:var(--ink);line-height:1.3;}.ac-done .acard-name{color:var(--bg);text-decoration:line-through;opacity:0.7;}.ac-partial .acard-name{color:#92400E;}
.acard-trigger{font-size:11px;color:var(--accent);font-weight:500;}.ac-done .acard-trigger{color:rgba(250,250,248,0.35);}
.half-btn{background:var(--warm);border:1.5px solid #DDD;border-radius:10px;padding:6px 10px;font-size:12px;font-weight:700;color:var(--muted);cursor:pointer;flex-shrink:0;transition:0.15s;}.half-on{background:#FDE68A;border-color:#F59E0B;color:#92400E;}
.acard-detail{padding:0 14px 14px;border-top:1px solid var(--border);}.ac-done .acard-detail{border-color:rgba(250,250,248,0.1);}
.ad-row{display:flex;gap:8px;padding:8px 0;border-bottom:1px solid #F5F4F2;}.ad-row:last-child{border:none;}
.ad-l{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#BBB;font-weight:600;width:70px;flex-shrink:0;}.ad-v{font-size:12px;color:#666;line-height:1.5;flex:1;}.ac-done .ad-v{color:rgba(250,250,248,0.5);}

.all-done{background:var(--warm);border-radius:20px;padding:22px;text-align:center;margin-bottom:12px;}.done-msg{font-family:var(--font-display);font-size:18px;color:var(--ink);margin-top:10px;}
.tomorrow-peek{background:var(--warm);border-radius:14px;padding:12px 14px;margin-bottom:12px;opacity:0.7;}.tp-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:6px;}.tp-action{font-size:12px;color:var(--muted);margin-bottom:3px;}.tp-dot{margin-right:4px;}
.plan-refresh-btn{width:100%;padding:10px;background:var(--warm);border:1.5px solid var(--border);border-radius:12px;font-size:12px;font-weight:700;color:var(--ink);cursor:pointer;text-align:center;margin-bottom:12px;transition:0.15s;}.plan-refresh-btn:hover{border-color:var(--ink);}

/* Banners */
.comeback{display:flex;gap:12px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:16px;padding:16px;margin-bottom:14px;}
.comeback-body{flex:1;}.cb-t{font-size:15px;font-weight:700;color:#92400E;margin-bottom:4px;}.cb-s{font-size:12px;color:#92400E;opacity:0.85;line-height:1.5;margin-bottom:10px;}
.cb-keep{background:var(--ink);color:var(--bg);border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;}
.return-banner{display:flex;gap:12px;background:var(--green-bg);border:1px solid #BBF7D0;border-radius:16px;padding:14px 16px;margin-bottom:14px;align-items:center;}
.ret-t{font-size:14px;font-weight:700;color:var(--green);}.ret-x{background:none;border:none;color:var(--green);font-size:18px;cursor:pointer;margin-left:auto;}

/* Milestone overlay */
.milestone-overlay{position:fixed;inset:0;background:rgba(21,21,21,0.6);display:flex;align-items:center;justify-content:center;z-index:100;padding:30px;}
.milestone-card{background:var(--bg);border-radius:28px;padding:32px 28px;text-align:center;max-width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
.ms-icon{font-size:48px;display:block;margin-bottom:14px;}.ms-title{font-family:var(--font-display);font-size:26px;color:var(--ink);margin-bottom:8px;}.ms-msg{font-size:13px;color:#666;line-height:1.65;}

/* Proto */
.proto{margin-top:16px;padding:12px;background:#F0EFED;border-radius:14px;border:1px dashed #CCC;}.proto-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#AAA;font-weight:600;margin-bottom:8px;}.proto-row{display:flex;gap:6px;}
.proto-btn{background:#fff;border:1px solid #DDD;border-radius:8px;padding:7px 12px;font-size:11px;color:#666;cursor:pointer;transition:0.15s;}.proto-btn:hover{background:var(--ink);color:var(--bg);}

/* Nudges */
.nudge-card{background:var(--ink);border-radius:24px;padding:26px 22px;margin-bottom:16px;}.nudge-icon{font-size:30px;display:block;margin-bottom:12px;}.nudge-msg{font-family:var(--font-display);font-size:20px;color:var(--bg);line-height:1.45;}
.nudge-status{background:var(--warm);border-radius:20px;padding:16px;margin-bottom:16px;}.ns-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:10px;}.mpill{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:8px;margin-bottom:7px;}.mpill-done{color:var(--ink);font-weight:600;}.ns-count{font-size:15px;font-weight:700;color:var(--ink);margin-top:8px;}

/* Reflection */
.checkin-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.checkin-btn{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:20px 14px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;transition:0.15s;}.checkin-btn:hover{border-color:var(--ink);}
.ci-icon{font-size:28px;}.ci-label{font-size:13px;font-weight:700;color:var(--ink);}
.done-pct{width:96px;height:96px;border-radius:50%;background:var(--ink);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:26px;color:var(--bg);margin-bottom:18px;}
.done-h{font-family:var(--font-display);font-size:30px;color:var(--ink);margin-bottom:6px;text-align:center;}.done-resp{font-size:13px;color:#555;text-align:center;line-height:1.65;margin-bottom:18px;max-width:300px;font-style:italic;}.done-foot{font-size:13px;color:var(--muted);text-align:center;}
.write-box{width:100%;margin-bottom:14px;}.wb-label{font-size:11px;color:#AAA;margin-bottom:6px;}

/* Progress */
.id-card{display:flex;gap:10px;background:var(--warm);border-radius:14px;padding:13px 15px;align-items:flex-start;margin-bottom:12px;}.id-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:3px;}.id-txt{font-size:13px;color:#555;line-height:1.5;}
.cons-card{display:flex;gap:16px;background:var(--ink);border-radius:24px;padding:22px 20px;margin-bottom:12px;align-items:flex-start;}
.cons-left{display:flex;flex-direction:column;align-items:center;flex-shrink:0;}.cons-big{font-family:var(--font-display);font-size:50px;color:var(--bg);line-height:1;}.cons-lbl{font-size:13px;font-weight:700;color:var(--bg);margin-top:2px;}
.cons-right{display:flex;flex-direction:column;gap:5px;}.cons-det{font-size:13px;font-weight:600;color:var(--bg);}.cons-note{font-size:11px;color:#888;line-height:1.5;margin-top:4px;}
.sec-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:6px;}
.areas-progress{background:var(--warm);border-radius:16px;padding:14px;margin-bottom:12px;}.ap-row{display:flex;flex-wrap:wrap;gap:6px;}.ap-pill{font-size:11px;font-weight:700;padding:4px 12px;border-radius:16px;}
.milestones-card{background:var(--warm);border-radius:18px;padding:14px;margin-bottom:12px;}.ms-row{display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #E8E6E2;}.ms-row:last-child{border:none;}.ms-r-icon{font-size:22px;}.ms-r-title{font-size:13px;font-weight:700;color:var(--ink);}.ms-r-day{font-size:10px;color:var(--muted);}
.cal-card{background:var(--warm);border-radius:20px;padding:16px;margin-bottom:12px;}.calgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin:8px 0;}.cdot{aspect-ratio:1;border-radius:5px;}.cdot-on{background:var(--ink);}.cdot-off{background:#E5E3E0;}

/* Buttons */
.btn-glow{width:100%;padding:16px;background:var(--ink);color:var(--bg);border:none;border-radius:16px;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.15s;box-shadow:0 4px 20px rgba(21,21,21,0.3);}.btn-glow:hover{transform:translateY(-2px);}
.btn-primary{width:100%;padding:16px;background:var(--ink);color:var(--bg);border:none;border-radius:16px;font-size:15px;font-weight:700;cursor:pointer;transition:0.15s;}.btn-primary:hover{background:#2D2D2D;}
.btn-off{opacity:0.25;cursor:not-allowed;}.btn-secondary{width:100%;padding:14px;background:transparent;color:var(--ink);border:2px solid var(--ink);border-radius:16px;font-size:14px;font-weight:700;cursor:pointer;margin-top:12px;transition:0.15s;}.btn-secondary:hover{background:var(--ink);color:var(--bg);}
.ghost-btn{background:none;border:none;color:#BBB;font-size:13px;cursor:pointer;padding:10px 0;display:block;width:100%;text-align:center;margin-top:4px;}
.mt12{margin-top:12px;}.mt16{margin-top:16px;}
.dots-wrap{font-size:13px;color:#888;}.dot-anim{display:inline-block;margin:0 2px;animation:blink 1.2s infinite;}.dot-anim:nth-child(2){animation-delay:0.2s;}.dot-anim:nth-child(3){animation-delay:0.4s;}@keyframes blink{0%,100%{opacity:0.2;}50%{opacity:1;}}

/* Struggles */
.struggle-grid{display:flex;flex-direction:column;gap:8px;margin-bottom:8px;}
.struggle-btn{display:flex;gap:12px;align-items:center;background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:14px;cursor:pointer;font-family:var(--font-body);transition:0.2s;text-align:left;position:relative;}
.struggle-on{border-color:var(--ink);background:var(--ink);}.str-icon{font-size:22px;flex-shrink:0;}
.str-text{display:flex;flex-direction:column;gap:2px;flex:1;}.str-label{font-size:13px;font-weight:700;color:var(--ink);}.struggle-on .str-label{color:var(--bg);}
.str-desc{font-size:11px;color:var(--muted);}.struggle-on .str-desc{color:rgba(250,250,248,0.5);}
.str-check{position:absolute;top:12px;right:14px;color:var(--bg);font-weight:800;font-size:14px;}

/* Habit builder */
.habit-list{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.habit-card{display:flex;gap:10px;align-items:center;background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:12px;transition:0.2s;}
.habit-sel{border-color:var(--green);background:var(--green-bg);}
.habit-toggle{width:32px;height:32px;border-radius:50%;border:2px solid #DDD;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:0.2s;}
.ht-on{color:var(--green);font-weight:800;font-size:16px;}.ht-off{width:10px;height:10px;border-radius:50%;background:#EEE;}
.habit-sel .habit-toggle{border-color:var(--green);background:var(--green-bg);}
.habit-info{flex:1;cursor:pointer;display:flex;flex-direction:column;gap:2px;}
.habit-area-tag{font-size:10px;font-weight:700;}.habit-action{font-size:13px;font-weight:600;color:var(--ink);line-height:1.35;}
.habit-twomin{font-size:10px;color:var(--muted);font-style:italic;}
.habit-remove{background:none;border:none;font-size:18px;color:#CCC;cursor:pointer;padding:4px 8px;flex-shrink:0;}.habit-remove:hover{color:#F00;}

.add-habit-box{background:var(--warm);border-radius:18px;padding:14px;margin-bottom:14px;}
.ah-label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
.ah-areas{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;}
.ah-area-btn{font-size:10px;font-weight:700;padding:5px 10px;border-radius:12px;border:1.5px solid var(--border);background:#fff;cursor:pointer;font-family:var(--font-body);transition:0.15s;}
.ah-area-on{border-width:2px;}
.habit-footer{padding:8px 0;}.hf-count{font-size:12px;color:var(--muted);text-align:center;margin-bottom:8px;}

/* Interactive Calendar */
.ical{display:flex;flex-direction:column;gap:12px;margin-bottom:14px;}
.ical-day{background:var(--warm);border-radius:16px;padding:12px 14px;}
.ical-day-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.ical-d-name{font-size:14px;font-weight:700;color:var(--ink);}.ical-d-count{font-size:11px;color:var(--muted);}
.ical-slot{display:flex;gap:10px;margin-bottom:6px;align-items:flex-start;min-height:28px;}
.ical-slot-label{font-size:10px;color:var(--muted);font-weight:600;width:80px;flex-shrink:0;padding-top:4px;}
.ical-slot-actions{flex:1;display:flex;flex-direction:column;gap:4px;}
.ical-action{display:flex;align-items:center;gap:6px;background:#fff;border-radius:10px;padding:6px 10px;border-left:3px solid #999;font-size:12px;}
.ical-a-text{flex:1;font-weight:600;color:var(--ink);}.ical-a-remove{background:none;border:none;font-size:16px;color:#CCC;cursor:pointer;padding:2px;}.ical-a-remove:hover{color:#F00;}
.ical-add-btn{width:28px;height:28px;border-radius:8px;border:1.5px dashed #CCC;background:none;color:#AAA;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.15s;}.ical-add-btn:hover{border-color:var(--ink);color:var(--ink);}
.ical-footer{text-align:center;}.ical-total{font-size:12px;color:var(--muted);margin-bottom:8px;}

/* Add modal */
.add-modal-bg{position:fixed;inset:0;background:rgba(21,21,21,0.5);z-index:100;display:flex;align-items:flex-end;justify-content:center;padding:20px;}
.add-modal{background:var(--bg);border-radius:24px 24px 0 0;padding:20px;width:100%;max-width:390px;max-height:60vh;overflow-y:auto;}
.am-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:12px;}
.am-habit{display:flex;gap:8px;align-items:center;width:100%;background:var(--warm);border:none;border-radius:12px;padding:12px;font-size:13px;font-weight:600;color:var(--ink);cursor:pointer;margin-bottom:6px;font-family:var(--font-body);text-align:left;transition:0.15s;}.am-habit:hover{background:#E8E6E2;}

/* Week Calendar */
.wcal{background:var(--warm);border-radius:18px;padding:14px;margin-bottom:12px;overflow-x:auto;}
.wcal-grid{min-width:100%;}
.wcal-header{display:grid;grid-template-columns:36px repeat(7,1fr);gap:2px;margin-bottom:4px;}
.wcal-time-col{display:flex;align-items:center;justify-content:center;}
.wcal-day-col{text-align:center;padding:4px 0;border-radius:8px;}.wcal-today{background:var(--ink);border-radius:8px;}
.wcal-d{font-size:10px;font-weight:700;color:var(--muted);}.wcal-today .wcal-d{color:var(--bg);}
.wcal-row{display:grid;grid-template-columns:36px repeat(7,1fr);gap:2px;margin-bottom:2px;min-height:32px;}
.wcal-time{font-size:9px;color:#BBB;font-weight:600;}
.wcal-cell{padding:2px;border-radius:6px;min-height:28px;}.wcal-cell-today{background:rgba(21,21,21,0.04);}
.wcal-block{border-radius:5px;padding:3px 5px;margin-bottom:2px;}
.wcal-block-text{font-size:8px;font-weight:600;color:var(--ink);line-height:1.3;display:block;}

/* Trigger selection */
.ad-triggers{padding:8px 0;}.ad-trigger-opts{display:flex;flex-direction:column;gap:4px;margin-top:4px;}
.ad-trig-btn{background:var(--warm);border:1.5px solid var(--border);border-radius:10px;padding:8px 10px;font-size:11px;color:var(--ink);cursor:pointer;text-align:left;font-family:var(--font-body);transition:0.15s;font-weight:500;}
.ad-trig-btn:hover{border-color:#999;}.ad-trig-on{border-color:var(--accent);background:rgba(194,99,42,0.08);color:var(--accent);font-weight:600;}

/* Action card meta */
.acard-meta{display:flex;gap:8px;align-items:center;margin-bottom:2px;}
.acard-time{font-size:9px;color:var(--muted);font-weight:600;}

/* Chat ready hint */
.chat-ready-hint{font-size:11px;color:var(--muted);margin-top:6px;}

/* Nav */
.bnav{display:flex;background:var(--bg);border-top:1px solid var(--border);padding:10px 0 calc(10px + env(safe-area-inset-bottom));flex-shrink:0;position:sticky;bottom:0;}
.nbtn{flex:1;background:none;border:none;cursor:pointer;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0.26;transition:0.15s;}.nbtn-on{opacity:1;}
.nico{font-size:18px;color:var(--ink);}.nlbl{font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink);font-weight:600;}
`;
