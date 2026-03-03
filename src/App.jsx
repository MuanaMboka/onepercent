import { useState, useContext, createContext, useEffect, useRef } from "react";

const AppCtx = createContext();
const useApp = () => useContext(AppCtx);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const STRUGGLES = [
  { id:"consistency", label:"Staying consistent", icon:"🔄" },
  { id:"motivation",  label:"Losing motivation",  icon:"📉" },
  { id:"time",        label:"Not enough time",    icon:"⏰" },
  { id:"distraction", label:"Too many distractions", icon:"📱" },
  { id:"overwhelm",   label:"Feeling overwhelmed", icon:"🌊" },
  { id:"forget",      label:"I simply forget",    icon:"🧠" },
];

const STRUGGLE_INSIGHTS = {
  consistency: "Consistency is a skill, not a personality trait. A UCL study found it takes 66 days on average.",
  motivation: "Motivation follows action, not the other way around. Start and the feeling catches up.",
  time: "You do not need more time. Planning when and where increases follow-through by 91%.",
  distraction: "Willpower runs out. Your environment does not have to. Design it to work for you.",
  overwhelm: "Start so small it feels embarrassing. Two minutes is still a habit.",
  forget: "If it is not on your path, you walk right past it. Triggers solve forgetting.",
};

const NUDGES_BY_STRUGGLE = {
  consistency: [
    { icon:"🗳️", msg:"Every action you complete is a vote for the person you are becoming." },
    { icon:"🌱", msg:"1% better today. 37× better in a year. The math is on your side." },
    { icon:"⛓️", msg:"Protect the chain. One day off is rest. Two in a row is a new pattern." },
  ],
  motivation: [
    { icon:"⚙️", msg:"Goals show the destination. Your weekly plan is what gets you there." },
    { icon:"🧭", msg:"Your mood does not run your day. Your system does." },
    { icon:"🗳️", msg:"You do not need to feel ready. You just need to start." },
  ],
  time: [
    { icon:"🎯", msg:"Two minutes is enough. The gateway version counts." },
    { icon:"⚙️", msg:"Your trigger fires at the same time every day. The action is already planned." },
    { icon:"🗳️", msg:"Done is better than perfect. Partial is better than nothing." },
  ],
  distraction: [
    { icon:"🔑", msg:"What you do when no one is watching shapes who you become." },
    { icon:"🪞", msg:"Your environment is stronger than your willpower. Shape it." },
    { icon:"⚙️", msg:"The right choice should be the easy choice. Design your space for it." },
  ],
  overwhelm: [
    { icon:"🎯", msg:"You do not need to do everything. Just today's action." },
    { icon:"🌱", msg:"A two-minute version is still a vote for your identity." },
    { icon:"🗳️", msg:"Starting is 80% of the work. You already opened the app." },
  ],
  forget: [
    { icon:"⚙️", msg:"After your trigger fires, the action is automatic. Trust the stack." },
    { icon:"🧭", msg:"Your plan is already made. Nothing to decide, nothing to forget." },
    { icon:"🎯", msg:"The best system is one that runs without you thinking about it." },
  ],
};

const CHECKIN_OPTIONS = [
  { id:"easy",    icon:"🌊", label:"Felt easy" },
  { id:"hard",    icon:"🏔️", label:"Had to push" },
  { id:"partial", icon:"🌤️", label:"Did what I could" },
  { id:"rest",    icon:"🛋️", label:"Rest day" },
];

const CHECKIN_RESPONSES = {
  easy:    "That is the system working. The easier it feels, the more automatic it is becoming.",
  hard:    "Hard days are where habits get forged. Showing up when it is difficult is the real vote.",
  partial: "Partial counts. A shorter version is infinitely better than zero. That is the whole point.",
  rest:    "Rest is part of the system, not a failure of it. What matters is you are here now.",
};

// ─── AI PROMPT HELPERS ────────────────────────────────────────────────────────
function buildPlanPrompt(goal, struggle, difficulty, dailyLoad, context) {
  const diffMap = {
    easy: "5-15 minutes per action, very approachable for beginners",
    medium: "15-30 minutes per action, moderate effort requiring some commitment",
    hard: "30-60 minutes per action, serious commitment for experienced people",
  };
  return `You are an expert habit architect combining James Clear's 4 Laws of Behavior Change, BJ Fogg's Behavior Model (B=MAP), implementation intentions research (Gollwitzer 1999), and progressive overload principles.

USER PROFILE:
- Goal: "${goal}"
- Primary struggle: "${struggle}"
- Difficulty: ${difficulty} (${diffMap[difficulty]})
- Actions per day: ${dailyLoad}
${context ? `- Performance context: ${context}` : "- First time generating a plan."}

TASK: Generate 3 DISTINCT weekly action plans.

PLAN A — "Foundation First": Build core skill through fundamental variations. Monday establishes base, each day reinforces from a different angle. Best for starting from zero.
PLAN B — "Variety Engine": Maximize engagement through diverse modalities (visual, kinesthetic, social, reflective, creative, analytical). Best for people who get bored or have quit before.
PLAN C — "Wave Pattern": Alternate high-effort and recovery days (Mon=medium, Tue=high, Wed=light, Thu=high, Fri=medium, Sat=light, Sun=reflective). Prevents burnout.

STRICT RULES:
1. Each day has exactly ${dailyLoad} action(s). No two days have the same action.

2. EVERY action must be SPECIFIC and MEASURABLE — contain a number or concrete noun.
   BAD: "exercise", "read", "practice"
   GOOD: "20 bodyweight squats", "read 5 pages of non-fiction", "write 200 words"

3. EVERY action has a HABIT STACK TRIGGER. The trigger MUST share physical and temporal context with the action. USE ONLY THESE ANCHORS:
   - "After I pour my morning coffee" (kitchen, standing, 2-min window)
   - "After I sit down at my desk" (seated, focused, work-start)
   - "After I eat lunch" (midday, energy dip, transition)
   - "After I get home from work" (evening, decompression)
   - "After I eat dinner" (evening, settled, winding down)
   - "After I brush my teeth at night" (bedtime routine, final act)
   - "After I wake up and get out of bed" (morning, fresh)
   DO NOT invent anchors outside this list.

4. EVERY action has a 2-MINUTE GATEWAY. This is the ENTRY BEHAVIOR — the smallest action that initiates the habit loop, NOT a shorter version.
   BAD: "Do 5 push-ups instead of 20" (just less volume)
   GOOD: "Get into push-up position on the floor" (entry behavior)
   BAD: "Read for 2 minutes" (still requires choosing what to read)
   GOOD: "Open the book to your bookmark" (removes all decisions)
   BAD: "Write a short entry" (vague, requires creative energy)
   GOOD: "Write today's date and one word for how you feel" (zero friction)

5. EVERY action has an IDENTITY statement. Format: "I am a [noun phrase]" max 5 words. Each day illuminates a DIFFERENT FACET of the same core identity. Over 7 days they build a complete picture.

6. WEEKEND DIFFERENTIATION: Saturday = enjoyable, exploratory, or social version. Sunday = reflective, planning-oriented, or restorative. Always include reviewing the week or preparing for next.

7. Each plan gets:
   - name: 2-4 words, memorable, specific to this goal
   - philosophy: One sentence explaining why this approach works for someone whose struggle is "${struggle}". Reference the struggle directly.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "plans": [
    {
      "name": "string",
      "philosophy": "string",
      "days": {
        "mon": [{"action":"string","trigger":"string","twoMin":"string","identity":"string"}],
        "tue": [...], "wed": [...], "thu": [...], "fri": [...], "sat": [...], "sun": [...]
      }
    },
    {...},
    {...}
  ]
}`;
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
function AppProvider({ children }) {
  // ONBOARDING: 0=welcome, 1=goal+struggle, 2=clarify, 3=dailyLoad, 4=pickPlan, 5=ready
  const [obScreen, setObScreen] = useState(0);
  const [rawGoal, setRawGoal] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [goalData, setGoalData] = useState(null);
  const [clarifyAnswer, setClarifyAnswer] = useState("");
  const [refining, setRefining] = useState(false);
  const [finalGoal, setFinalGoal] = useState("");
  const [identityLine, setIdentityLine] = useState("");
  const [goalAffirmation, setGoalAffirmation] = useState(null);
  const [struggle, setStruggle] = useState(null);
  const [dailyLoad, setDailyLoad] = useState(2);
  const [difficulty, setDifficulty] = useState("medium");

  // PLAN STATE
  const [planOptions, setPlanOptions] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(null);
  const [weekPlan, setWeekPlan] = useState(null); // the confirmed plan for this week
  const [editingDay, setEditingDay] = useState(null);
  const [customAction, setCustomAction] = useState("");

  // APP STATE
  const [screen, setScreen] = useState("onboarding");
  const [dayNumber, setDayNumber] = useState(1);
  const [weekDay, setWeekDay] = useState(0); // 0=Mon
  const [checked, setChecked] = useState({});
  const [partialChecked, setPartialChecked] = useState({});
  const [expandedAction, setExpandedAction] = useState(null);
  const [completionHistory, setCompletionHistory] = useState([]);
  const [checkinDone, setCheckinDone] = useState(false);
  const [checkinChoice, setCheckinChoice] = useState(null);
  const [showWritePrompt, setShowWritePrompt] = useState(false);
  const [checkinNote, setCheckinNote] = useState("");
  const [todayNudge, setTodayNudge] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [comebackMode, setComebackMode] = useState(false);
  const [planningMode, setPlanningMode] = useState(false); // user triggered replanning
  const [animPhase, setAnimPhase] = useState(0);

  // Welcome animation
  useEffect(() => {
    if (obScreen === 0) {
      const t1 = setTimeout(() => setAnimPhase(1), 300);
      const t2 = setTimeout(() => setAnimPhase(2), 700);
      const t3 = setTimeout(() => setAnimPhase(3), 1100);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [obScreen]);

  // Daily nudge
  useEffect(() => {
    const nudges = struggle ? (NUDGES_BY_STRUGGLE[struggle] || NUDGES_BY_STRUGGLE.consistency) : NUDGES_BY_STRUGGLE.consistency;
    setTodayNudge(nudges[dayNumber % nudges.length]);
  }, [struggle, dayNumber]);

  // Today's actions from plan
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

  // ── Goal analysis ──────────────────────────────────────────────────────────
  async function analyseGoal() {
    const trimmed = rawGoal.trim();
    if (trimmed.length < 4 || !struggle) return;
    setAnalysing(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 900,
          messages: [{ role: "user", content: `You are a habit formation expert combining James Clear's identity-based habits, BJ Fogg's behavior design, and Edwin Locke's goal-setting theory.

USER INPUT:
- Raw goal: "${trimmed}"
- Primary struggle: "${struggle}"

TASK: Evaluate this goal and prepare it for a habit-building system.

RULES:
1. A goal is INVALID only if it is complete gibberish (random letters, keyboard smash) or explicitly violent/harmful. Everything else is VALID — even ambitious, vague, unrealistic, or money-related goals. Goals about wealth, money, fitness, relationships, fame, or any personal aspiration are ALWAYS valid. Your job is not to judge the goal, only to clarify it if vague.
2. A goal is VAGUE if it lacks a specific domain, measurable indicator, or timeframe.
3. If VAGUE, generate ONE clarifying question: warm, max 15 words, targeting the most missing element. Never ask "why" — ask "what" or "how".
4. If CLEAR, generate:
   - refinedGoal: One specific sentence. Keep their language. Max 15 words.
   - identityStatement: Noun phrase 2-4 words. Format: "a [adjective] [noun]" e.g. "a daily reader". NEVER "someone who..."
5. affirmationHeadline: Bold, specific to their goal TYPE. Max 6 words. BAD: "You can do this!" GOOD: "Readers are built in minutes."
6. affirmationBody: Exactly 2 sentences. First = why this goal is achievable (cite behavioral science). Second = one specific mechanism their system will use. NO hollow encouragement.

Respond ONLY with valid JSON (no markdown):
{
  "valid": boolean,
  "isVague": boolean,
  "clarifyingQ": "string or empty",
  "refinedGoal": "string or empty",
  "identityStatement": "string or empty",
  "affirmationHeadline": "string",
  "affirmationBody": "string"
}` }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim());
      setGoalData(parsed);
      if (!parsed.valid) { parsed.valid = true; parsed.isVague = true; parsed.clarifyingQ = parsed.clarifyingQ || "What would success look like for you in 90 days?"; }
      if (parsed.isVague) { setObScreen(2); }
      else {
        setFinalGoal(parsed.refinedGoal || trimmed);
        setIdentityLine(parsed.identityStatement || "");
        setGoalAffirmation({ headline: parsed.affirmationHeadline, body: parsed.affirmationBody });
        setObScreen(3);
      }
    } catch (e) {
      if (trimmed.split(" ").length >= 3) { setFinalGoal(trimmed); setObScreen(3); }
    } finally { setAnalysing(false); }
  }

  async function refineGoal() {
    if (!clarifyAnswer.trim()) return;
    setRefining(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 600,
          messages: [{ role: "user", content: `A user is building a habit system.

Original goal: "${rawGoal}"
Clarifying question asked: "${goalData?.clarifyingQ}"
Their answer: "${clarifyAnswer}"

Synthesize into a clear goal. Keep THEIR vocabulary.

RULES:
1. refinedGoal: One specific sentence combining original intent + clarification. Max 15 words.
2. identityStatement: Noun phrase, 2-4 words. "a [adjective] [noun]". Must connect to the REFINED goal.
3. affirmationHeadline: Max 6 words. Specific to their goal type. No generic encouragement.
4. affirmationBody: Exactly 2 sentences. First = why achievable (behavioral science). Second = one mechanism their system uses.

Respond ONLY with valid JSON (no markdown):
{
  "refinedGoal": "string",
  "identityStatement": "string",
  "affirmationHeadline": "string",
  "affirmationBody": "string"
}` }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim());
      setFinalGoal(parsed.refinedGoal || `${rawGoal} — ${clarifyAnswer}`);
      setIdentityLine(parsed.identityStatement || "");
      setGoalAffirmation({ headline: parsed.affirmationHeadline, body: parsed.affirmationBody });
      setObScreen(3);
    } catch (e) {
      setFinalGoal(`${rawGoal} — ${clarifyAnswer}`); setObScreen(3);
    } finally { setRefining(false); }
  }

  // ── Generate weekly plans ──────────────────────────────────────────────────
  async function generatePlans(context) {
    setLoadingPlans(true);
    setPlanOptions(null);
    setSelectedPlanIdx(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 4000,
          messages: [{ role: "user", content: buildPlanPrompt(finalGoal, struggle, difficulty, dailyLoad, context) }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim());
      setPlanOptions(parsed.plans || []);
    } catch (e) {
      setPlanOptions(generateFallbackPlans(dailyLoad));
    } finally { setLoadingPlans(false); }
  }

  function confirmPlan(idx) {
    if (planOptions && planOptions[idx]) {
      setWeekPlan(planOptions[idx]);
      setSelectedPlanIdx(idx);
    }
  }

  function swapDayAction(dayKey, actionIdx, newAction) {
    if (!weekPlan) return;
    const updated = { ...weekPlan, days: { ...weekPlan.days } };
    const dayActions = [...updated.days[dayKey]];
    dayActions[actionIdx] = { ...dayActions[actionIdx], action: newAction };
    updated.days[dayKey] = dayActions;
    setWeekPlan(updated);
  }

  function enterApp() {
    if (!weekPlan) return;
    setChecked({}); setPartialChecked({}); setExpandedAction(null);
    setCheckinDone(false); setCheckinChoice(null);
    setIsReturning(false); setComebackMode(false);
    setPlanningMode(false);
    setScreen("today");
  }

  // ── Daily interactions ─────────────────────────────────────────────────────
  function toggleComplete(i) {
    setChecked(p => {
      const next = { ...p, [i]: !p[i] };
      if (next[i]) setPartialChecked(pc => ({ ...pc, [i]: false }));
      return next;
    });
  }

  function togglePartial(i) {
    if (!checked[i]) setPartialChecked(p => ({ ...p, [i]: !p[i] }));
  }

  function simulateDay(offset) {
    const c = todayActions.filter((_, i) => checked[i]).length;
    const p = todayActions.filter((_, i) => !checked[i] && partialChecked[i]).length;
    setCompletionHistory(prev => [...prev, { day: dayNumber, completed: c, partial: p, total: todayActions.length }]);
    setDayNumber(d => d + offset);
    setWeekDay(wd => (wd + offset) % 7);
    setChecked({}); setPartialChecked({}); setExpandedAction(null);
    setCheckinDone(false); setCheckinChoice(null); setCheckinNote(""); setShowWritePrompt(false);
    if (offset >= 3) { setComebackMode(true); setIsReturning(true); }
    else if (offset > 1) { setIsReturning(true); }
  }

  function startReplanning() {
    let context = "";
    if (completionHistory.length > 0) {
      const recentDays = completionHistory.slice(-7);
      const fullCompleteDays = recentDays.filter(d => d.completed === d.total).length;
      const partialDays = recentDays.filter(d => d.partial > 0 && d.completed < d.total).length;
      const zeroDays = recentDays.filter(d => d.completed === 0 && d.partial === 0).length;
      context = `PERFORMANCE DATA (last ${recentDays.length} days): ${fullCompleteDays} fully completed, ${partialDays} partial, ${zeroDays} missed entirely. Overall consistency: ${consistencyPct}% over ${completionHistory.length} total days. ${consistencyPct > 80 ? "User is doing well — consider slightly increasing challenge." : consistencyPct > 50 ? "User is maintaining — keep similar difficulty, swap struggling actions." : "User is struggling — reduce difficulty significantly, make 2-min versions the default actions."}`;
    }
    setPlanningMode(true);
    setScreen("replan");
    generatePlans(context);
  }

  function reduceLoad() {
    setDailyLoad(1);
    setComebackMode(false);
  }

  return (
    <AppCtx.Provider value={{
      obScreen, setObScreen,
      rawGoal, setRawGoal, analysing, goalData, analyseGoal,
      clarifyAnswer, setClarifyAnswer, refining, refineGoal,
      finalGoal, identityLine, goalAffirmation,
      struggle, setStruggle,
      dailyLoad, setDailyLoad, difficulty, setDifficulty,
      planOptions, loadingPlans, selectedPlanIdx, confirmPlan,
      weekPlan, setWeekPlan, generatePlans,
      editingDay, setEditingDay, customAction, setCustomAction, swapDayAction,
      enterApp,
      screen, setScreen,
      dayNumber, weekDay, todayKey, todayActions, tomorrowActions,
      checked, partialChecked, toggleComplete, togglePartial,
      expandedAction, setExpandedAction,
      completedCount, partialCount, totalActions,
      completionHistory, totalDaysTracked, daysWithActivity, consistencyPct,
      checkinDone, setCheckinDone, checkinChoice, setCheckinChoice,
      showWritePrompt, setShowWritePrompt, checkinNote, setCheckinNote,
      todayNudge,
      isReturning, setIsReturning, comebackMode, setComebackMode, reduceLoad,
      planningMode, setPlanningMode, startReplanning,
      simulateDay, animPhase,
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
    <div className="universe">
      <div className="phone">
        <StatusBar />
        <div className="screen-area">
          {screen === "onboarding" && <Onboarding />}
          {screen === "today" && <TodayScreen />}
          {screen === "nudges" && <NudgesScreen />}
          {screen === "reflection" && <ReflectionScreen />}
          {screen === "progress" && <ProgressScreen />}
          {screen === "replan" && <ReplanScreen />}
        </div>
        {screen !== "onboarding" && <BottomNav />}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="sb">
      <span className="sb-t">9:41</span>
      <div className="sb-notch" />
      <span className="sb-r">●●● 91%</span>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding() {
  const { obScreen } = useApp();
  return (
    <div className="screen">
      {obScreen === 0 && <OB_Welcome />}
      {obScreen === 1 && <OB_GoalStruggle />}
      {obScreen === 2 && <OB_Clarify />}
      {obScreen === 3 && <OB_DailyLoad />}
      {obScreen === 4 && <OB_PickPlan />}
      {obScreen === 5 && <OB_Ready />}
    </div>
  );
}

// ── Welcome ───────────────────────────────────────────────────────────────────
function OB_Welcome() {
  const { setObScreen, animPhase } = useApp();
  return (
    <div className="ob-screen welcome-bg">
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="welcome-content">
        <div className={`welcome-logo ${animPhase >= 1 ? "logo-in" : "logo-pre"}`}>1%</div>
        <h1 className={`welcome-h1 ${animPhase >= 2 ? "text-in" : "text-pre"}`}>
          The system that<br />makes habits stick.
        </h1>
        <p className={`welcome-sub ${animPhase >= 2 ? "text-in delay-1" : "text-pre"}`}>
          Not the same actions every day. A rotating plan<br />that keeps you engaged and growing.
        </p>

        <div className={`proof-strip ${animPhase >= 3 ? "strip-in" : "strip-pre"}`}>
          <div className="proof-item">
            <span className="proof-num">66</span>
            <span className="proof-lbl">days to a real habit</span>
          </div>
          <div className="proof-div" />
          <div className="proof-item">
            <span className="proof-num">91%</span>
            <span className="proof-lbl">follow-through<br />with triggers</span>
          </div>
          <div className="proof-div" />
          <div className="proof-item">
            <span className="proof-num">2×</span>
            <span className="proof-lbl">more effective<br />with tracking</span>
          </div>
        </div>

        <div className={`welcome-quote ${animPhase >= 3 ? "text-in delay-2" : "text-pre"}`}>
          <p>Most apps give you a checklist and hope you stick to it. This one gives you a plan that evolves with you.</p>
        </div>

        <button className={`btn-glow ${animPhase >= 3 ? "btn-in" : "btn-pre"}`} onClick={() => setObScreen(1)}>
          Build my system
        </button>
        <p className="ob-note">2 minutes · Free · No account needed</p>
      </div>
    </div>
  );
}

// ── Goal + Struggle ───────────────────────────────────────────────────────────
function OB_GoalStruggle() {
  const { rawGoal, setRawGoal, analysing, goalData, analyseGoal, struggle, setStruggle } = useApp();
  const invalid = goalData && !goalData.valid;
  const canGo = rawGoal.trim().length >= 4 && struggle && !analysing;

  return (
    <div className="ob-screen fade-in">
      <ObProgress step={1} total={5} />
      <p className="ob-eye">Step 1 · Goal &amp; challenge</p>
      <h2 className="ob-h">What are you<br />working toward?</h2>
      <p className="ob-p">Write it however it comes. Vague is fine.</p>

      <textarea className={`ob-input${invalid ? " ob-input-err" : ""}`}
        placeholder="e.g. get fit, learn to code, read more, save money"
        value={rawGoal} onChange={e => setRawGoal(e.target.value)} rows={2} />

      {invalid && (
        <div className="err-box fade-in">
          <span>⚠</span><p>That does not look like a real goal. What do you genuinely want?</p>
        </div>
      )}

      <div className="struggle-section">
        <h3 className="ob-h2">What usually stops you?</h3>
        <div className="struggle-grid">
          {STRUGGLES.map(s => (
            <button key={s.id} className={`str-btn${struggle === s.id ? " str-on" : ""}`}
              onClick={() => setStruggle(s.id)}>
              <span className="str-icon">{s.icon}</span>
              <span className="str-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button className={`btn-primary mt16${!canGo ? " btn-off" : ""}`}
        onClick={analyseGoal} disabled={!canGo}>
        {analysing ? <Dots label="Analysing" /> : "Continue"}
      </button>
    </div>
  );
}

// ── Clarify ───────────────────────────────────────────────────────────────────
function OB_Clarify() {
  const { rawGoal, goalData, clarifyAnswer, setClarifyAnswer, refining, refineGoal, setObScreen } = useApp();
  return (
    <div className="ob-screen fade-in">
      <ObProgress step={2} total={5} />
      <p className="ob-eye">Sharpening your goal</p>
      <h2 className="ob-h">One quick question.</h2>
      <div className="quote-box"><p>"{rawGoal}"</p></div>
      <div className="clarify-box">
        <span>💬</span>
        <p>{goalData?.clarifyingQ || "What would success look like in 90 days?"}</p>
      </div>
      <textarea className="ob-input" rows={3} placeholder="Be as specific as you like"
        value={clarifyAnswer} onChange={e => setClarifyAnswer(e.target.value)} style={{ marginTop: 12 }} />
      <button className={`btn-primary mt12${!clarifyAnswer.trim() || refining ? " btn-off" : ""}`}
        onClick={refineGoal} disabled={!clarifyAnswer.trim() || refining}>
        {refining ? <Dots label="Refining" /> : "That is my goal"}
      </button>
      <button className="ghost-btn" onClick={() => setObScreen(1)}>Back</button>
    </div>
  );
}

// ── Daily Load ────────────────────────────────────────────────────────────────
function OB_DailyLoad() {
  const { finalGoal, identityLine, goalAffirmation, struggle, dailyLoad, setDailyLoad, difficulty, setDifficulty, setObScreen, generatePlans } = useApp();
  const insight = STRUGGLE_INSIGHTS[struggle];

  function proceed() {
    setObScreen(4);
    generatePlans("");
  }

  return (
    <div className="ob-screen fade-in">
      <ObProgress step={3} total={5} />
      <p className="ob-eye">Step 2 · Your daily shape</p>

      {/* Goal confirmation */}
      {goalAffirmation && (
        <div className="aff-card stagger-1">
          <span className="aff-spark">✦</span>
          <h3 className="aff-h">{goalAffirmation.headline}</h3>
          <p className="aff-body">{goalAffirmation.body}</p>
          {identityLine && <p className="aff-id">Becoming: a {identityLine}</p>}
        </div>
      )}

      {insight && (
        <div className="insight-strip stagger-2"><span>💡</span><p>{insight}</p></div>
      )}

      <h2 className="ob-h" style={{ fontSize: 22, marginTop: 16 }}>How much per day?</h2>
      <p className="ob-p">This sets how many different actions you see each day. Your plan changes daily — no two days are the same.</p>

      <div className="load-grid stagger-3">
        {[
          { n: 1, icon: "🎯", name: "Focused", desc: "One action. Maximum simplicity. Best for building the foundation." },
          { n: 2, icon: "⚖️", name: "Balanced", desc: "Two actions. Enough variety to stay engaged without overwhelm." },
          { n: 3, icon: "🔥", name: "Ambitious", desc: "Three actions. Fastest progress. Requires real commitment." },
        ].map(opt => (
          <button key={opt.n} className={`load-btn${dailyLoad === opt.n ? " load-on" : ""}`}
            onClick={() => setDailyLoad(opt.n)}>
            <div className="load-top">
              <span className="load-icon">{opt.icon}</span>
              <span className="load-name">{opt.name}</span>
              <span className="load-n">{opt.n}/day</span>
            </div>
            <p className="load-desc">{opt.desc}</p>
          </button>
        ))}
      </div>

      <h3 className="ob-h2" style={{ marginTop: 16 }}>Intensity level</h3>
      <div className="diff-row stagger-4">
        {[
          { id: "easy", icon: "🌱", lbl: "Starter", t: "5–15 min" },
          { id: "medium", icon: "🔥", lbl: "Builder", t: "15–30 min" },
          { id: "hard", icon: "⚡", lbl: "Warrior", t: "30–60 min" },
        ].map(d => (
          <button key={d.id} className={`diff-btn${difficulty === d.id ? " diff-on" : ""}`}
            onClick={() => setDifficulty(d.id)}>
            <span>{d.icon}</span>
            <span className="diff-lbl">{d.lbl}</span>
            <span className="diff-t">{d.t}</span>
          </button>
        ))}
      </div>

      <button className="btn-primary mt16" onClick={proceed}>Generate my weekly plan</button>
    </div>
  );
}

// ── Pick Plan ─────────────────────────────────────────────────────────────────
function OB_PickPlan() {
  const { planOptions, loadingPlans, selectedPlanIdx, confirmPlan, weekPlan, setObScreen, editingDay, setEditingDay, customAction, setCustomAction, swapDayAction, dailyLoad } = useApp();
  const [viewingPlan, setViewingPlan] = useState(null);

  if (loadingPlans) return (
    <div className="ob-screen fade-in" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="gen-anim">
        <div className="gen-ring"><div className="gen-spinner" /></div>
        <h3 className="gen-title">Building your plans</h3>
        <p className="gen-sub">Creating 3 different weekly strategies<br />tailored to your goal and challenge.</p>
        <div className="gen-facts">
          <p className="gen-fact stagger-1">✦ Each day has a different action</p>
          <p className="gen-fact stagger-2">✦ Every action has a built-in trigger</p>
          <p className="gen-fact stagger-3">✦ Hard-day versions included</p>
        </div>
      </div>
    </div>
  );

  if (!planOptions || !planOptions.length) return (
    <div className="ob-screen fade-in">
      <p>Something went wrong generating plans.</p>
      <button className="btn-primary mt16" onClick={() => setObScreen(3)}>Try again</button>
    </div>
  );

  // Plan detail view
  if (viewingPlan !== null) {
    const plan = planOptions[viewingPlan];
    return (
      <div className="ob-screen fade-in">
        <ObProgress step={4} total={5} />
        <button className="ghost-btn" style={{ textAlign: "left", marginBottom: 8 }} onClick={() => setViewingPlan(null)}>← Back to plans</button>
        <h2 className="ob-h" style={{ fontSize: 20 }}>{plan.name}</h2>
        <p className="ob-p">{plan.philosophy}</p>

        <div className="week-detail">
          {DAYS.map((d, di) => {
            const key = d.toLowerCase();
            const actions = plan.days[key] || [];
            return (
              <div key={d} className="wd-day">
                <div className="wd-header">
                  <span className="wd-label">{DAY_FULL[di]}</span>
                </div>
                {actions.map((a, ai) => (
                  <div key={ai} className="wd-action">
                    <p className="wd-action-name">{a.action}</p>
                    <p className="wd-trigger">{a.trigger}</p>
                    <p className="wd-mini">Hard day: {a.twoMin}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <button className="btn-primary mt16" onClick={() => { confirmPlan(viewingPlan); setViewingPlan(null); }}>
          Choose this plan
        </button>
      </div>
    );
  }

  // Plan cards overview
  return (
    <div className="ob-screen fade-in">
      <ObProgress step={4} total={5} />
      <p className="ob-eye">Step 3 · Pick your plan</p>
      <h2 className="ob-h">Three strategies.<br />Your choice.</h2>
      <p className="ob-p">Each plan takes a different approach to your goal. Tap to explore, then choose one.</p>

      <div className="plan-cards">
        {planOptions.map((plan, idx) => (
          <div key={idx} className={`plan-card${selectedPlanIdx === idx ? " plan-sel" : ""}`}>
            <div className="plan-card-top" onClick={() => setViewingPlan(idx)}>
              <div className="plan-badge">{["A", "B", "C"][idx]}</div>
              <div className="plan-info">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-phil">{plan.philosophy}</p>
              </div>
            </div>
            <div className="plan-preview">
              {DAYS.map((d, di) => {
                const key = d.toLowerCase();
                const acts = plan.days[key] || [];
                return (
                  <div key={d} className="pp-day">
                    <span className="pp-label">{d}</span>
                    <span className="pp-dot">{acts.length > 0 ? "●" : "○"}</span>
                  </div>
                );
              })}
            </div>
            <div className="plan-actions">
              <button className="plan-view-btn" onClick={() => setViewingPlan(idx)}>View full week</button>
              <button className={`plan-choose-btn${selectedPlanIdx === idx ? " chosen" : ""}`}
                onClick={() => confirmPlan(idx)}>
                {selectedPlanIdx === idx ? "✓ Selected" : "Choose"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className={`btn-primary mt16${selectedPlanIdx === null ? " btn-off" : ""}`}
        onClick={() => selectedPlanIdx !== null && setObScreen(5)}
        disabled={selectedPlanIdx === null}>
        Confirm this plan
      </button>
    </div>
  );
}

// ── Ready ─────────────────────────────────────────────────────────────────────
function OB_Ready() {
  const { finalGoal, identityLine, weekPlan, enterApp } = useApp();
  return (
    <div className="ob-screen fade-in">
      <div className="ready-top">
        <div className="ready-ring pulse-ring">
          <span className="ready-check">✓</span>
        </div>
        <h2 className="ready-h">Your week<br />is planned.</h2>
        <p className="ready-sub">7 days of different actions, all driving toward one goal.</p>
      </div>

      <div className="ready-summary">
        <div className="rs-goal">
          <p className="rs-label">Your goal</p>
          <p className="rs-text">"{finalGoal}"</p>
          {identityLine && <p className="rs-id">🪞 Becoming: a {identityLine}</p>}
        </div>
        <div className="rs-divider" />
        <p className="rs-label">This week: {weekPlan?.name}</p>
        <p className="rs-phil">{weekPlan?.philosophy}</p>
        <div className="rs-week-mini">
          {DAYS.map((d, i) => {
            const acts = weekPlan?.days[d.toLowerCase()] || [];
            return (
              <div key={d} className="rs-day-mini">
                <span className="rs-d-label">{d}</span>
                {acts.map((a, j) => <p key={j} className="rs-d-action">{a.action}</p>)}
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn-glow mt12" onClick={enterApp}>Start day one</button>
    </div>
  );
}

// ─── TODAY ─────────────────────────────────────────────────────────────────────
function TodayScreen() {
  const {
    finalGoal, dayNumber, weekDay, todayActions, tomorrowActions,
    checked, partialChecked, toggleComplete, togglePartial,
    expandedAction, setExpandedAction,
    completedCount, partialCount, totalActions, setScreen,
    isReturning, setIsReturning, comebackMode, setComebackMode, reduceLoad,
    simulateDay, weekPlan, startReplanning,
  } = useApp();
  const allDone = completedCount === totalActions && totalActions > 0;
  const pct = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

  return (
    <div className="screen pad">
      {comebackMode && (
        <div className="comeback fade-in">
          <span>🌱</span>
          <div className="comeback-body">
            <p className="cb-t">Welcome back.</p>
            <p className="cb-s">Coming back is the hardest part. Want to simplify to 1 action per day?</p>
            <div className="cb-btns">
              <button className="cb-reduce" onClick={reduceLoad}>Simplify</button>
              <button className="cb-keep" onClick={() => setComebackMode(false)}>Keep my plan</button>
            </div>
          </div>
        </div>
      )}

      {isReturning && !comebackMode && (
        <div className="return-banner fade-in">
          <span>👋</span>
          <div><p className="ret-t">Welcome back.</p><p className="ret-s">You showed up. That is the whole game.</p></div>
          <button className="ret-x" onClick={() => setIsReturning(false)}>×</button>
        </div>
      )}

      <div className="today-top">
        <p className="eyebrow">{DAY_FULL[weekDay]} · Day {dayNumber}</p>
        <h2 className="today-h">{finalGoal}</h2>
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
          <p className="done-msg">Today's plan: complete.</p>
          <button className="btn-secondary" onClick={() => setScreen("reflection")}>Evening check-in</button>
        </div>
      )}

      {!allDone && totalActions > 0 && (
        <p className="encourage">{completedCount === 0 ? "Tap the circle to start. The first one is the hardest." : `${totalActions - completedCount} to go. You are already ahead of yesterday.`}</p>
      )}

      {/* Tomorrow preview */}
      {tomorrowActions.length > 0 && (
        <div className="tomorrow-peek">
          <p className="tp-label">Tomorrow · {DAY_FULL[(weekDay + 1) % 7]}</p>
          {tomorrowActions.map((a, i) => <p key={i} className="tp-action">{a.action}</p>)}
        </div>
      )}

      <div className="plan-actions-row">
        <button className="plan-refresh-btn" onClick={startReplanning}>🔄 Plan next week</button>
      </div>

      {/* Proto controls */}
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
  const cls = done ? " ac-done" : partial ? " ac-partial" : "";
  return (
    <div className={`acard${cls}`}>
      <div className="acard-inner">
        <button className={`acircle${done ? " acircle-done" : partial ? " acircle-partial" : ""}`} onClick={onComplete}>
          {done ? "✓" : partial ? "½" : <span className="ac-tap">tap</span>}
        </button>
        <div className="acard-text" onClick={onExpand} style={{ cursor: "pointer" }}>
          <span className="acard-name">{a.action}</span>
          {done && <span className="acard-sub-done">Done ✓</span>}
          {partial && <span className="acard-sub-part">Partial ✓</span>}
          {!done && !partial && a.trigger && <span className="acard-trigger">{a.trigger}</span>}
        </div>
        {!done && (
          <button className={`half-btn${partial ? " half-on" : ""}`} onClick={onPartial}>½</button>
        )}
      </div>
      {expanded && (
        <div className="acard-detail fade-in">
          {a.trigger && <div className="ad-row"><span className="ad-l">Trigger</span><span className="ad-v">{a.trigger}</span></div>}
          {a.twoMin && <div className="ad-row"><span className="ad-l">Hard day</span><span className="ad-v">{a.twoMin}</span></div>}
          {a.identity && <div className="ad-row"><span className="ad-l">Identity</span><span className="ad-v">{a.identity}</span></div>}
        </div>
      )}
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
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }} />
    </svg>
  );
}

// ─── NUDGES ───────────────────────────────────────────────────────────────────
function NudgesScreen() {
  const { todayNudge, todayActions, checked, completedCount, totalActions, setScreen, dayNumber, weekDay } = useApp();
  const n = todayNudge || { icon: "🗳️", msg: "Every action you complete is a vote for who you are becoming." };
  return (
    <div className="screen pad">
      <p className="eyebrow">Daily nudge · {DAY_FULL[weekDay]}</p>
      <div className="nudge-card fade-in">
        <span className="nudge-icon">{n.icon}</span>
        <p className="nudge-msg">{n.msg}</p>
      </div>
      <div className="nudge-status">
        <p className="ns-lbl">Today's actions</p>
        {todayActions.map((a, i) => (
          <div key={i} className={`mpill${checked[i] ? " mpill-done" : ""}`}>
            <span>{checked[i] ? "✓" : "○"}</span><span>{a.action}</span>
          </div>
        ))}
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

  function handleChoice(id) {
    setCheckinChoice(id);
    setShowWritePrompt(dayNumber % 3 === 0);
    setCheckinDone(true);
  }

  if (checkinDone) return (
    <div className="screen pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="done-pct fade-in">{pct}%</div>
      <h2 className="done-h">Day {dayNumber} done.</h2>
      <p className="done-resp fade-in">{CHECKIN_RESPONSES[checkinChoice]}</p>
      <div className="done-list">
        {todayActions.map((a, i) => (
          <div key={i} className={`srow${checked[i] ? " srow-done" : " srow-off"}`}>
            <span>{checked[i] ? "✓" : "○"}</span><span>{a.action}</span>
          </div>
        ))}
      </div>
      {showWritePrompt && (
        <div className="write-box fade-in">
          <p className="wb-label">Anything on your mind? (optional)</p>
          <textarea className="ob-input" rows={3} placeholder="Just for you."
            value={checkinNote} onChange={e => setCheckinNote(e.target.value)} />
        </div>
      )}
      <p className="done-foot">1% better. See you tomorrow. 🚀</p>
    </div>
  );

  return (
    <div className="screen pad">
      <p className="eyebrow">Check-in · {DAY_FULL[weekDay]}</p>
      <h2 className="ob-h" style={{ fontSize: 24 }}>How was today?</h2>
      <p className="ob-p">One tap.</p>
      <div className="checkin-grid">
        {CHECKIN_OPTIONS.map(opt => (
          <button key={opt.id} className="checkin-btn" onClick={() => handleChoice(opt.id)}>
            <span className="ci-icon">{opt.icon}</span>
            <span className="ci-label">{opt.label}</span>
          </button>
        ))}
      </div>
      <div className="score-strip">
        <span className="ss-l">Completion</span><span className="ss-v">{pct}%</span>
      </div>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function ProgressScreen() {
  const { completionHistory, dayNumber, daysWithActivity, totalDaysTracked, consistencyPct, completedCount, totalActions, finalGoal, identityLine, weekPlan, weekDay } = useApp();
  const showPct = totalDaysTracked >= 7;
  return (
    <div className="screen pad">
      <p className="eyebrow">Progress</p>
      <h2 className="ob-h" style={{ fontSize: 26, marginBottom: 14 }}>Your journey</h2>

      {identityLine && (
        <div className="id-card stagger-1"><span>🪞</span><div><p className="id-lbl">Identity</p><p className="id-txt">Becoming: a <strong>{identityLine}</strong></p></div></div>
      )}

      <div className="cons-card stagger-2">
        <div className="cons-left">
          {showPct ? <><p className="cons-big">{consistencyPct}%</p><p className="cons-lbl">consistency</p></> : <><p className="cons-big">{daysWithActivity}</p><p className="cons-lbl">day{daysWithActivity !== 1 ? "s" : ""} active</p></>}
          <p className="cons-sub">{totalDaysTracked > 0 ? `last ${totalDaysTracked} days` : "starting today"}</p>
        </div>
        <div className="cons-right">
          {totalDaysTracked === 0 ? <p className="cons-note">Your journey starts now.</p> : (
            <>
              <p className="cons-det">{daysWithActivity} of {totalDaysTracked} days active</p>
              {totalDaysTracked - daysWithActivity > 0 && <p className="cons-miss">{totalDaysTracked - daysWithActivity} rest — normal</p>}
              {showPct && <p className="cons-note">{consistencyPct}% beats 100% of people who never started.</p>}
            </>
          )}
        </div>
      </div>

      {totalDaysTracked > 0 && (
        <div className="cal-card stagger-3">
          <p className="sec-lbl">History</p>
          <div className="calgrid">
            {completionHistory.map((d, i) => (
              <div key={i} className={`cdot${d.completed > 0 || d.partial > 0 ? " cdot-on" : " cdot-off"}`} />
            ))}
          </div>
        </div>
      )}

      {weekPlan && (
        <div className="week-card stagger-4">
          <p className="sec-lbl">This week · {weekPlan.name}</p>
          <div className="week-mini">
            {DAYS.map((d, i) => {
              const acts = weekPlan.days[d.toLowerCase()] || [];
              const isToday = i === weekDay;
              return (
                <div key={d} className={`wm-day${isToday ? " wm-today" : ""}`}>
                  <span className="wm-d">{d}</span>
                  {acts.map((a, j) => <span key={j} className="wm-act">{a.action}</span>)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="goal-card"><p className="sec-lbl">Goal</p><p className="goal-txt">"{finalGoal}"</p></div>
    </div>
  );
}

// ─── REPLAN ───────────────────────────────────────────────────────────────────
function ReplanScreen() {
  const { planOptions, loadingPlans, selectedPlanIdx, confirmPlan, weekPlan, setScreen, setPlanningMode, enterApp } = useApp();
  const [viewing, setViewing] = useState(null);

  if (loadingPlans) return (
    <div className="screen pad" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="gen-ring"><div className="gen-spinner" /></div>
      <h3 className="gen-title" style={{ marginTop: 20 }}>Planning your next week</h3>
      <p className="gen-sub">Based on how this week went.</p>
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
          {DAYS.map((d, di) => {
            const key = d.toLowerCase();
            return (
              <div key={d} className="wd-day">
                <span className="wd-label">{DAY_FULL[di]}</span>
                {(plan.days[key] || []).map((a, ai) => (
                  <div key={ai} className="wd-action">
                    <p className="wd-action-name">{a.action}</p>
                    <p className="wd-trigger">{a.trigger}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <button className="btn-primary mt16" onClick={() => { confirmPlan(viewing); setViewing(null); }}>Choose this plan</button>
      </div>
    );
  }

  return (
    <div className="screen pad fade-in">
      <p className="eyebrow">New week</p>
      <h2 className="ob-h">Pick your<br />next plan.</h2>
      {planOptions?.map((plan, idx) => (
        <div key={idx} className={`plan-card${selectedPlanIdx === idx ? " plan-sel" : ""}`} style={{ marginBottom: 10 }}>
          <div className="plan-card-top" onClick={() => setViewing(idx)}>
            <div className="plan-badge">{["A", "B", "C"][idx]}</div>
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
        onClick={() => { if (selectedPlanIdx !== null) { setPlanningMode(false); setScreen("today"); } }}>
        Confirm new plan
      </button>
      <button className="ghost-btn" onClick={() => { setPlanningMode(false); setScreen("today"); }}>Keep current plan</button>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function BottomNav() {
  const { screen, setScreen, planningMode, startReplanning } = useApp();
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
  return (
    <div className="ob-prog">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`op-seg${i < step ? " op-done" : i === step ? " op-act" : ""}`} />
      ))}
    </div>
  );
}

function Dots({ label }) {
  return <span className="dots-wrap">{label}<span className="dot-anim"> ●</span><span className="dot-anim">●</span><span className="dot-anim">●</span></span>;
}

// ─── FALLBACK PLANS ───────────────────────────────────────────────────────────
function generateFallbackPlans(load) {
  const makeDay = (actions) => actions.slice(0, load);
  return [
    {
      name: "Foundation Builder",
      philosophy: "Start with the basics and build a solid base before adding complexity.",
      days: {
        mon: makeDay([{ action: "15-minute focused reading", trigger: "After I pour morning coffee", twoMin: "Read one page", identity: "I am a daily learner" }]),
        tue: makeDay([{ action: "10-minute journal entry", trigger: "After I sit at my desk", twoMin: "Write one sentence", identity: "I am someone who reflects" }]),
        wed: makeDay([{ action: "20-minute skill practice", trigger: "After lunch", twoMin: "Open the tool", identity: "I am building mastery" }]),
        thu: makeDay([{ action: "15-minute planning session", trigger: "After I brush teeth at night", twoMin: "Write tomorrow's priority", identity: "I am proactive" }]),
        fri: makeDay([{ action: "25-minute deep work block", trigger: "After breakfast", twoMin: "Write one sentence of work", identity: "I am a focused worker" }]),
        sat: makeDay([{ action: "30-minute exploration", trigger: "After morning coffee", twoMin: "Browse one new resource", identity: "I am curious" }]),
        sun: makeDay([{ action: "Weekly review", trigger: "After Sunday meal", twoMin: "Open calendar", identity: "I plan ahead" }]),
      }
    },
    {
      name: "Variety Engine",
      philosophy: "Mix different modalities to keep engagement high and prevent boredom.",
      days: {
        mon: makeDay([{ action: "Watch a tutorial video", trigger: "After morning coffee", twoMin: "Open YouTube", identity: "I learn from others" }]),
        tue: makeDay([{ action: "Hands-on practice session", trigger: "After lunch", twoMin: "Open the project", identity: "I learn by doing" }]),
        wed: makeDay([{ action: "Teach someone what you learned", trigger: "After dinner", twoMin: "Text one insight to a friend", identity: "I share knowledge" }]),
        thu: makeDay([{ action: "Read an article in your field", trigger: "After sitting at desk", twoMin: "Open one article", identity: "I stay informed" }]),
        fri: makeDay([{ action: "Creative application session", trigger: "After breakfast", twoMin: "Sketch one idea", identity: "I create" }]),
        sat: makeDay([{ action: "Community engagement", trigger: "After morning coffee", twoMin: "Post one question online", identity: "I connect with others" }]),
        sun: makeDay([{ action: "Rest and reflect", trigger: "After evening meal", twoMin: "Write one gratitude", identity: "I recharge intentionally" }]),
      }
    },
    {
      name: "Progressive Wave",
      philosophy: "Start gentle on Monday and build intensity toward Friday.",
      days: {
        mon: makeDay([{ action: "5-minute mindful intention setting", trigger: "After morning coffee", twoMin: "Take 3 deep breaths", identity: "I start with clarity" }]),
        tue: makeDay([{ action: "15-minute focused work", trigger: "After sitting at desk", twoMin: "Write one paragraph", identity: "I build momentum" }]),
        wed: makeDay([{ action: "25-minute practice session", trigger: "After lunch", twoMin: "Do 5 minutes only", identity: "I push my edge" }]),
        thu: makeDay([{ action: "30-minute deep dive", trigger: "After breakfast", twoMin: "Start with outline", identity: "I go deep" }]),
        fri: makeDay([{ action: "40-minute peak session", trigger: "After morning coffee", twoMin: "Start and set timer", identity: "I perform at my best" }]),
        sat: makeDay([{ action: "Recovery and light review", trigger: "After waking", twoMin: "Skim your notes", identity: "I consolidate" }]),
        sun: makeDay([{ action: "Plan and prepare for the week", trigger: "After evening meal", twoMin: "Open calendar", identity: "I am ready" }]),
      }
    }
  ];
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root{
  --bg:#F8F7F5;--ink:#1A1A1A;--muted:#999;--border:#ECEAE8;
  --warm:#EEEDEB;--accent:#D97706;--green:#166534;--green-bg:#EEF9F4;
  --green-border:#BBF7D0;--amber-bg:#FFFBEB;--amber-border:#FDE68A;
  --font-display:'Bricolage Grotesque',sans-serif;
  --font-body:'DM Sans',sans-serif;
}

.universe{min-height:100vh;background:#E2DFD9;display:flex;align-items:center;justify-content:center;font-family:var(--font-body);padding:24px 0;}
.phone{width:390px;height:780px;background:var(--bg);border-radius:52px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 0 0 1px rgba(0,0,0,0.07),0 32px 80px rgba(0,0,0,0.22);}
.sb{display:flex;justify-content:space-between;align-items:center;padding:14px 24px 2px;flex-shrink:0;}
.sb-t{font-size:12px;font-weight:600;color:var(--ink);}.sb-notch{width:80px;height:24px;background:var(--ink);border-radius:12px;}.sb-r{font-size:11px;color:#AAA;}
.screen-area{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;}.screen-area::-webkit-scrollbar{display:none;}
.screen{min-height:100%;display:flex;flex-direction:column;}.pad{padding:20px 22px;}

/* ─── ANIMATIONS ── */
.fade-in{animation:fadeIn 0.4s ease both;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.stagger-1{animation:fadeIn 0.4s ease 0.1s both;}
.stagger-2{animation:fadeIn 0.4s ease 0.2s both;}
.stagger-3{animation:fadeIn 0.4s ease 0.3s both;}
.stagger-4{animation:fadeIn 0.4s ease 0.4s both;}
.logo-pre{opacity:0;transform:scale(0.5);}.logo-in{opacity:1;transform:scale(1);transition:all 0.6s cubic-bezier(0.34,1.56,0.64,1);}
.text-pre{opacity:0;transform:translateY(20px);}.text-in{opacity:1;transform:none;transition:all 0.5s ease;}
.delay-1{transition-delay:0.15s!important;}.delay-2{transition-delay:0.3s!important;}
.strip-pre{opacity:0;transform:translateY(30px);}.strip-in{opacity:1;transform:none;transition:all 0.6s ease 0.1s;}
.btn-pre{opacity:0;transform:translateY(20px);}.btn-in{opacity:1;transform:none;transition:all 0.5s ease;}
.pulse-ring{animation:pulse 2s ease infinite;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(26,26,26,0.2);}50%{box-shadow:0 0 0 12px rgba(26,26,26,0);}}

/* ─── WELCOME ── */
.ob-screen{padding:20px 22px 24px;display:flex;flex-direction:column;min-height:100%;overflow-y:auto;position:relative;}
.welcome-bg{background:linear-gradient(170deg,#F8F7F5 0%,#EDE9E3 50%,#E0DAD0 100%);overflow:hidden;}
.orb{position:absolute;border-radius:50%;filter:blur(60px);opacity:0.3;pointer-events:none;}
.orb-1{width:200px;height:200px;background:#D4A574;top:-40px;right:-60px;animation:orbFloat 8s ease infinite;}
.orb-2{width:150px;height:150px;background:#A8C4BB;bottom:100px;left:-40px;animation:orbFloat 10s ease 2s infinite;}
.orb-3{width:120px;height:120px;background:#C4B5A0;top:40%;right:20%;animation:orbFloat 12s ease 4s infinite;}
@keyframes orbFloat{0%,100%{transform:translate(0,0);}50%{transform:translate(15px,-20px);}}
.welcome-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;flex:1;}
.welcome-logo{font-family:var(--font-display);font-size:56px;font-weight:800;color:var(--ink);letter-spacing:-4px;margin:32px 0 16px;}
.welcome-h1{font-family:var(--font-display);font-size:26px;font-weight:800;color:var(--ink);text-align:center;line-height:1.2;letter-spacing:-1px;margin-bottom:8px;}
.welcome-sub{font-size:13px;color:var(--muted);text-align:center;line-height:1.6;margin-bottom:20px;}
.proof-strip{display:flex;align-items:center;background:rgba(255,255,255,0.7);backdrop-filter:blur(20px);border-radius:18px;padding:16px 14px;gap:12px;margin-bottom:18px;width:100%;border:1px solid rgba(0,0,0,0.05);}
.proof-item{display:flex;flex-direction:column;align-items:center;flex:1;gap:2px;}
.proof-num{font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--ink);letter-spacing:-1px;}
.proof-lbl{font-size:9px;color:var(--muted);text-align:center;line-height:1.4;}
.proof-div{width:1px;height:30px;background:#DDD;}
.welcome-quote{background:var(--ink);border-radius:18px;padding:16px 18px;margin-bottom:18px;width:100%;}
.welcome-quote p{font-size:13px;color:var(--bg);line-height:1.65;font-weight:500;}
.btn-glow{width:100%;padding:16px;background:var(--ink);color:var(--bg);border:none;border-radius:16px;font-family:var(--font-display);font-size:15px;font-weight:700;cursor:pointer;transition:all 0.15s;box-shadow:0 4px 20px rgba(26,26,26,0.3);}
.btn-glow:hover{transform:translateY(-2px);box-shadow:0 6px 30px rgba(26,26,26,0.4);}
.ob-note{font-size:11px;color:#C0BEBB;text-align:center;margin-top:10px;}

/* ─── ONBOARDING SHARED ── */
.ob-prog{display:flex;gap:4px;margin-bottom:20px;}
.op-seg{flex:1;height:3px;border-radius:2px;background:var(--border);transition:0.3s;}.op-done{background:var(--ink);}.op-act{background:#888;}
.ob-eye{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#C0BEBB;font-weight:600;margin-bottom:8px;}
.ob-h{font-family:var(--font-display);font-size:28px;font-weight:800;color:var(--ink);line-height:1.15;letter-spacing:-1px;margin-bottom:10px;}
.ob-h2{font-family:var(--font-display);font-size:18px;font-weight:800;color:var(--ink);margin-bottom:8px;}
.ob-p{font-size:13px;color:var(--muted);line-height:1.65;margin-bottom:12px;}
.ob-input{width:100%;background:var(--warm);border:2px solid transparent;border-radius:16px;padding:14px 16px;font-family:var(--font-body);font-size:15px;color:var(--ink);resize:none;outline:none;transition:0.2s;display:block;}
.ob-input:focus{border-color:var(--ink);}.ob-input::placeholder{color:#C0BEBB;}
.ob-input-err{border-color:#F87171!important;}
.err-box{display:flex;gap:10px;background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:12px;margin-top:10px;font-size:13px;color:#DC2626;}
.quote-box{background:var(--warm);border-radius:14px;padding:12px 14px;margin-bottom:12px;font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--ink);}
.clarify-box{display:flex;gap:10px;background:var(--amber-bg);border:1px solid var(--amber-border);border-radius:14px;padding:12px 14px;font-family:var(--font-display);font-size:15px;font-weight:700;color:#92400E;line-height:1.35;}

/* ─── STRUGGLE ── */
.struggle-section{margin-top:18px;padding-top:16px;border-top:1px solid var(--border);}
.struggle-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.str-btn{background:var(--warm);border:2px solid transparent;border-radius:14px;padding:12px;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:var(--font-body);transition:0.2s;}
.str-btn:hover{border-color:#CCC;}.str-on{background:var(--ink);border-color:var(--ink);}
.str-icon{font-size:18px;}.str-label{font-family:var(--font-display);font-size:12px;font-weight:700;color:var(--ink);}.str-on .str-label{color:var(--bg);}

/* ─── DAILY LOAD ── */
.aff-card{background:var(--warm);border-radius:18px;padding:18px;margin-bottom:12px;text-align:center;}
.aff-spark{font-size:24px;display:block;margin-bottom:8px;}
.aff-h{font-family:var(--font-display);font-size:18px;font-weight:800;color:var(--ink);margin-bottom:6px;}
.aff-body{font-size:12px;color:#666;line-height:1.6;}.aff-id{font-size:11px;color:var(--muted);font-style:italic;margin-top:6px;}
.insight-strip{display:flex;gap:8px;background:var(--amber-bg);border:1px solid var(--amber-border);border-radius:12px;padding:10px 12px;margin-bottom:4px;font-size:12px;color:#92400E;font-weight:600;line-height:1.4;align-items:center;}
.load-grid{display:flex;flex-direction:column;gap:8px;margin-bottom:4px;}
.load-btn{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:14px;cursor:pointer;text-align:left;transition:0.2s;font-family:var(--font-body);}
.load-btn:hover{border-color:#CCC;}.load-on{background:var(--ink);border-color:var(--ink);}
.load-top{display:flex;align-items:center;gap:8px;margin-bottom:4px;}
.load-icon{font-size:18px;}.load-name{font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--ink);flex:1;}.load-on .load-name{color:var(--bg);}
.load-n{font-family:var(--font-display);font-size:12px;font-weight:700;color:var(--muted);}.load-on .load-n{color:rgba(248,247,245,0.5);}
.load-desc{font-size:11px;color:#888;line-height:1.5;}.load-on .load-desc{color:rgba(248,247,245,0.6);}
.diff-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;}
.diff-btn{background:var(--warm);border:2px solid transparent;border-radius:14px;padding:10px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:0.2s;font-family:var(--font-body);}
.diff-on{background:var(--ink);border-color:var(--ink);}
.diff-lbl{font-family:var(--font-display);font-size:12px;font-weight:700;color:var(--ink);}.diff-on .diff-lbl{color:var(--bg);}
.diff-t{font-size:10px;color:var(--muted);}.diff-on .diff-t{color:rgba(248,247,245,0.5);}

/* ─── PLAN GENERATION ── */
.gen-anim{display:flex;flex-direction:column;align-items:center;text-align:center;padding:20px;}
.gen-ring{width:80px;height:80px;border-radius:50%;border:4px solid var(--border);border-top-color:var(--ink);display:flex;align-items:center;justify-content:center;margin-bottom:20px;}
.gen-spinner{animation:spin 1s linear infinite;width:100%;height:100%;}
@keyframes spin{to{transform:rotate(360deg);}}
.gen-ring{animation:spin 1s linear infinite;}
.gen-title{font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--ink);margin-bottom:6px;}
.gen-sub{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:24px;}
.gen-facts{text-align:left;display:flex;flex-direction:column;gap:8px;}
.gen-fact{font-size:13px;color:#888;line-height:1.5;}

/* ─── PLAN CARDS ── */
.plan-cards{display:flex;flex-direction:column;gap:10px;margin-bottom:8px;}
.plan-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;overflow:hidden;transition:0.2s;}
.plan-sel{border-color:var(--ink);box-shadow:0 2px 12px rgba(26,26,26,0.12);}
.plan-card-top{display:flex;gap:12px;padding:14px 16px;cursor:pointer;align-items:flex-start;}
.plan-badge{width:32px;height:32px;background:var(--ink);color:var(--bg);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:14px;font-weight:800;flex-shrink:0;}
.plan-info{flex:1;min-width:0;}
.plan-name{font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--ink);margin-bottom:2px;}
.plan-phil{font-size:11px;color:var(--muted);line-height:1.4;}
.plan-preview{display:flex;gap:4px;padding:0 16px 10px;justify-content:space-between;}
.pp-day{display:flex;flex-direction:column;align-items:center;gap:3px;}
.pp-label{font-size:9px;color:var(--muted);font-weight:600;}.pp-dot{font-size:8px;color:var(--ink);}
.plan-actions{display:flex;gap:8px;padding:0 16px 14px;}
.plan-view-btn{flex:1;padding:8px;background:var(--warm);border:none;border-radius:10px;font-family:var(--font-display);font-size:12px;font-weight:700;color:var(--ink);cursor:pointer;transition:0.15s;}
.plan-choose-btn{flex:1;padding:8px;background:var(--ink);border:none;border-radius:10px;font-family:var(--font-display);font-size:12px;font-weight:700;color:var(--bg);cursor:pointer;transition:0.15s;}
.chosen{background:var(--green-bg);color:var(--green);border:1px solid var(--green-border);}

/* ─── WEEK DETAIL ── */
.week-detail{display:flex;flex-direction:column;gap:8px;margin-bottom:8px;}
.wd-day{background:var(--warm);border-radius:14px;padding:12px 14px;}
.wd-header{margin-bottom:6px;}
.wd-label{font-family:var(--font-display);font-size:12px;font-weight:700;color:var(--ink);}
.wd-action{margin-bottom:6px;}
.wd-action-name{font-size:13px;font-weight:600;color:var(--ink);}
.wd-trigger{font-size:11px;color:var(--accent);font-weight:600;}
.wd-mini{font-size:10px;color:#4A9D6F;font-style:italic;}

/* ─── READY ── */
.ready-top{text-align:center;padding:8px 0 16px;}
.ready-ring{width:72px;height:72px;background:var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.ready-check{font-size:28px;color:var(--bg);font-weight:700;}
.ready-h{font-family:var(--font-display);font-size:28px;font-weight:800;color:var(--ink);letter-spacing:-1px;line-height:1.2;margin-bottom:8px;}
.ready-sub{font-size:13px;color:var(--muted);line-height:1.6;}
.ready-summary{background:var(--warm);border-radius:20px;padding:18px;margin-bottom:14px;}
.rs-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C0BEBB;font-weight:600;margin-bottom:5px;}
.rs-goal{margin-bottom:12px;}
.rs-text{font-family:var(--font-display);font-size:15px;font-weight:700;color:var(--ink);margin-bottom:4px;}
.rs-id{font-size:11px;color:var(--muted);font-style:italic;}
.rs-divider{height:1px;background:#DDD;margin:12px 0;}
.rs-phil{font-size:12px;color:#666;margin-bottom:10px;line-height:1.5;}
.rs-week-mini{display:flex;flex-direction:column;gap:6px;}
.rs-day-mini{display:flex;gap:8px;align-items:baseline;}
.rs-d-label{font-size:10px;font-weight:700;color:var(--muted);width:30px;flex-shrink:0;}
.rs-d-action{font-size:12px;color:var(--ink);font-weight:500;}

/* ─── TODAY ── */
.eyebrow{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#C0BEBB;font-weight:600;margin-bottom:6px;}
.today-top{margin-bottom:12px;}
.today-h{font-family:var(--font-display);font-size:19px;font-weight:800;color:var(--ink);letter-spacing:-0.4px;line-height:1.25;margin-bottom:4px;}
.today-plan{font-size:11px;color:var(--muted);}
.pstrip{display:flex;align-items:center;gap:14px;background:var(--warm);border-radius:20px;padding:14px 18px;margin-bottom:12px;}
.pstrip-mid{display:flex;flex-direction:column;}
.pbig{font-family:var(--font-display);font-size:38px;font-weight:800;color:var(--ink);line-height:1;letter-spacing:-2px;}
.ptot{font-size:20px;color:#C0BEBB;}.plbl{font-size:11px;color:var(--muted);margin-top:2px;}.plbl-p{font-size:10px;color:var(--accent);font-weight:600;}
.pct-badge{margin-left:auto;background:var(--ink);color:var(--bg);font-family:var(--font-display);font-size:17px;font-weight:800;padding:8px 12px;border-radius:12px;}

/* Action cards */
.action-list{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
.acard{background:#fff;border:1.5px solid var(--border);border-radius:18px;overflow:hidden;transition:0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
.acard:hover{border-color:#CCC;}.ac-done{background:var(--ink);border-color:var(--ink);}.ac-partial{background:var(--amber-bg);border-color:var(--amber-border);}
.acard-inner{display:flex;align-items:center;gap:12px;padding:14px;}
.acircle{width:44px;height:44px;border-radius:50%;border:2px solid #DDD;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;background:transparent;font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--ink);transition:0.2s;}
.acircle:hover{border-color:#999;}.acircle-done{background:var(--bg);border-color:var(--bg);}.acircle-partial{background:#FDE68A;border-color:#F59E0B;}
.ac-tap{font-size:9px;color:#C0BEBB;letter-spacing:1px;text-transform:uppercase;font-weight:600;}
.acard-text{flex:1;min-width:0;cursor:pointer;display:flex;flex-direction:column;gap:2px;}
.acard-name{font-size:14px;font-weight:600;color:var(--ink);line-height:1.3;}
.ac-done .acard-name{color:var(--bg);text-decoration:line-through;opacity:0.7;}
.ac-partial .acard-name{color:#92400E;}
.acard-trigger{font-size:11px;color:var(--accent);font-weight:500;}
.ac-done .acard-trigger{color:rgba(248,247,245,0.35);}
.acard-sub-done{font-size:11px;color:rgba(248,247,245,0.5);}.acard-sub-part{font-size:11px;color:var(--accent);font-weight:600;}
.half-btn{background:var(--warm);border:1.5px solid #DDD;border-radius:10px;padding:6px 10px;font-family:var(--font-display);font-size:12px;font-weight:700;color:var(--muted);cursor:pointer;flex-shrink:0;transition:0.15s;}
.half-btn:hover{border-color:#F59E0B;color:var(--accent);}.half-on{background:#FDE68A;border-color:#F59E0B;color:#92400E;}
.acard-detail{padding:0 14px 14px;border-top:1px solid var(--border);}
.ac-done .acard-detail{border-color:rgba(248,247,245,0.1);}
.ad-row{display:flex;gap:8px;padding:8px 0;border-bottom:1px solid #F5F4F2;}.ad-row:last-child{border:none;}
.ad-l{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#C0BEBB;font-weight:600;width:70px;flex-shrink:0;padding-top:1px;}
.ad-v{font-size:12px;color:#666;line-height:1.5;flex:1;}.ac-done .ad-v{color:rgba(248,247,245,0.5);}

.all-done{background:var(--warm);border-radius:20px;padding:22px;text-align:center;margin-bottom:12px;}
.done-msg{font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--ink);margin-top:10px;}
.encourage{font-size:13px;color:var(--muted);text-align:center;line-height:1.6;}

.tomorrow-peek{background:var(--warm);border-radius:14px;padding:12px 14px;margin-bottom:12px;opacity:0.7;}
.tp-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C0BEBB;font-weight:600;margin-bottom:6px;}
.tp-action{font-size:12px;color:var(--muted);margin-bottom:3px;}

.plan-actions-row{display:flex;gap:8px;margin-bottom:12px;}
.plan-refresh-btn{flex:1;padding:10px;background:var(--warm);border:1.5px solid var(--border);border-radius:12px;font-family:var(--font-display);font-size:12px;font-weight:700;color:var(--ink);cursor:pointer;transition:0.15s;text-align:center;}
.plan-refresh-btn:hover{border-color:var(--ink);}

/* Banners */
.comeback{display:flex;gap:12px;background:var(--amber-bg);border:1px solid var(--amber-border);border-radius:16px;padding:16px;margin-bottom:14px;}
.comeback-body{flex:1;}.cb-t{font-family:var(--font-display);font-size:15px;font-weight:700;color:#92400E;margin-bottom:4px;}
.cb-s{font-size:12px;color:#92400E;opacity:0.85;line-height:1.5;margin-bottom:10px;}
.cb-btns{display:flex;gap:8px;}
.cb-reduce{background:var(--ink);color:var(--bg);border:none;border-radius:10px;padding:8px 14px;font-family:var(--font-display);font-size:12px;font-weight:700;cursor:pointer;}
.cb-keep{background:transparent;color:#92400E;border:1.5px solid var(--accent);border-radius:10px;padding:8px 14px;font-family:var(--font-display);font-size:12px;font-weight:700;cursor:pointer;}
.return-banner{display:flex;gap:12px;background:var(--green-bg);border:1px solid var(--green-border);border-radius:16px;padding:14px 16px;margin-bottom:14px;align-items:flex-start;}
.ret-t{font-size:14px;font-weight:700;color:var(--green);}.ret-s{font-size:12px;color:var(--green);opacity:0.8;}
.ret-x{background:none;border:none;color:var(--green);font-size:18px;cursor:pointer;margin-left:auto;opacity:0.6;flex-shrink:0;}

/* Proto */
.proto{margin-top:16px;padding:12px;background:#F0EFED;border-radius:14px;border:1px dashed #CCC;}
.proto-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#AAA;font-weight:600;margin-bottom:8px;}
.proto-row{display:flex;gap:6px;}
.proto-btn{background:#fff;border:1px solid #DDD;border-radius:8px;padding:7px 12px;font-family:var(--font-body);font-size:11px;color:#666;cursor:pointer;transition:0.15s;}
.proto-btn:hover{background:var(--ink);color:var(--bg);border-color:var(--ink);}

/* Nudges */
.nudge-card{background:var(--ink);border-radius:24px;padding:26px 22px;margin-bottom:16px;}
.nudge-icon{font-size:30px;display:block;margin-bottom:12px;}
.nudge-msg{font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--bg);line-height:1.45;letter-spacing:-0.3px;}
.nudge-status{background:var(--warm);border-radius:20px;padding:16px;margin-bottom:16px;}
.ns-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C0BEBB;font-weight:600;margin-bottom:10px;}
.mpill{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:8px;margin-bottom:7px;}.mpill-done{color:var(--ink);font-weight:600;}
.ns-count{font-family:var(--font-display);font-size:15px;font-weight:700;color:var(--ink);margin-top:8px;}

/* Reflection */
.checkin-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.checkin-btn{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:20px 14px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;transition:0.15s;font-family:var(--font-body);}
.checkin-btn:hover{border-color:var(--ink);}.checkin-btn:active{background:var(--ink);}
.checkin-btn:active .ci-label{color:var(--bg);}
.ci-icon{font-size:28px;}.ci-label{font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--ink);}
.done-pct{width:96px;height:96px;border-radius:50%;background:var(--ink);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:24px;font-weight:800;color:var(--bg);letter-spacing:-1px;margin-bottom:18px;}
.done-h{font-family:var(--font-display);font-size:28px;font-weight:800;color:var(--ink);letter-spacing:-1px;margin-bottom:6px;text-align:center;}
.done-resp{font-size:13px;color:#555;text-align:center;line-height:1.65;margin-bottom:18px;max-width:300px;font-style:italic;}
.done-list{width:100%;background:var(--warm);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.srow{display:flex;gap:10px;align-items:center;font-size:13px;font-weight:500;}.srow-done{color:var(--ink);}.srow-off{color:#AAA;}
.done-foot{font-size:13px;color:var(--muted);text-align:center;}
.write-box{width:100%;margin-bottom:14px;}.wb-label{font-size:11px;color:#AAA;margin-bottom:6px;}
.score-strip{display:flex;justify-content:space-between;padding:14px 16px;background:var(--warm);border-radius:14px;}
.ss-l{font-size:13px;color:var(--muted);}.ss-v{font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--ink);}

/* Progress */
.id-card{display:flex;gap:10px;background:var(--warm);border-radius:14px;padding:13px 15px;align-items:flex-start;}
.id-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C0BEBB;font-weight:600;margin-bottom:3px;}
.id-txt{font-size:13px;color:#555;line-height:1.5;}.id-txt strong{color:var(--ink);}
.cons-card{display:flex;gap:16px;background:var(--ink);border-radius:24px;padding:22px 20px;margin-bottom:12px;align-items:flex-start;}
.cons-left{display:flex;flex-direction:column;align-items:center;flex-shrink:0;}
.cons-big{font-family:var(--font-display);font-size:48px;font-weight:800;color:var(--bg);letter-spacing:-3px;line-height:1;}
.cons-lbl{font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--bg);margin-top:2px;}
.cons-sub{font-size:10px;color:#666;margin-top:2px;}
.cons-right{display:flex;flex-direction:column;gap:5px;}
.cons-det{font-size:13px;font-weight:600;color:var(--bg);}.cons-miss{font-size:11px;color:#888;}
.cons-note{font-size:11px;color:#666;line-height:1.5;margin-top:4px;}
.sec-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C0BEBB;font-weight:600;margin-bottom:6px;}
.cal-card{background:var(--warm);border-radius:20px;padding:16px;margin-bottom:12px;}
.calgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin:8px 0;}
.cdot{aspect-ratio:1;border-radius:5px;}.cdot-on{background:var(--ink);}.cdot-off{background:#E5E3E0;}
.week-card{background:var(--warm);border-radius:18px;padding:14px 16px;margin-bottom:12px;}
.week-mini{display:flex;flex-direction:column;gap:4px;}
.wm-day{display:flex;gap:8px;align-items:baseline;padding:4px 0;}
.wm-today{background:rgba(26,26,26,0.06);border-radius:8px;padding:4px 8px;margin:-4px -8px;}
.wm-d{font-size:10px;font-weight:700;color:var(--muted);width:28px;flex-shrink:0;}
.wm-act{font-size:12px;color:var(--ink);font-weight:500;}
.goal-card{background:var(--warm);border-radius:14px;padding:14px 16px;margin-bottom:12px;}
.goal-txt{font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--ink);line-height:1.4;}

/* Buttons */
.btn-primary{width:100%;padding:16px;background:var(--ink);color:var(--bg);border:none;border-radius:16px;font-family:var(--font-display);font-size:15px;font-weight:700;cursor:pointer;transition:all 0.15s;}
.btn-primary:hover{background:#2D2D2D;transform:translateY(-1px);}.btn-primary:active{transform:none;}
.btn-off{opacity:0.25;cursor:not-allowed;}.btn-off:hover{background:var(--ink);transform:none;}
.btn-secondary{width:100%;padding:14px;background:transparent;color:var(--ink);border:2px solid var(--ink);border-radius:16px;font-family:var(--font-display);font-size:14px;font-weight:700;cursor:pointer;transition:0.15s;margin-top:12px;}
.btn-secondary:hover{background:var(--ink);color:var(--bg);}
.ghost-btn{background:none;border:none;color:#C0BEBB;font-size:13px;cursor:pointer;font-family:var(--font-body);padding:10px 0;display:block;width:100%;text-align:center;margin-top:4px;}
.mt12{margin-top:12px;}.mt16{margin-top:16px;}
.dots-wrap{font-size:13px;color:#888;}.dot-anim{display:inline-block;margin:0 2px;animation:blink 1.2s infinite;}.dot-anim:nth-child(2){animation-delay:0.2s;}.dot-anim:nth-child(3){animation-delay:0.4s;}
@keyframes blink{0%,100%{opacity:0.2;}50%{opacity:1;}}

/* Nav */
.bnav{display:flex;background:var(--bg);border-top:1px solid var(--border);padding:10px 0 22px;flex-shrink:0;}
.nbtn{flex:1;background:none;border:none;cursor:pointer;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0.26;transition:0.15s;}.nbtn-on{opacity:1;}
.nico{font-size:18px;color:var(--ink);}.nlbl{font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink);font-weight:600;}
`;
