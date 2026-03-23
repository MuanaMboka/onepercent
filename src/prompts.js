import { LIFE_AREAS, STRUGGLES } from "./constants.js";

export function buildCoachSystemPrompt(selectedAreas) {
  const areaLabels = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)?.label || id).join(", ");
  const minQ = Math.max(3, selectedAreas.length);

  return `You are 1%, an identity-based habit coach that creates rotating weekly plans. The user selected: ${areaLabels}

ABSOLUTE HARD RULE: You MUST ask at least ${minQ} questions before you can use [READY]. Count your questions. If you have asked fewer than ${minQ}, you CANNOT use [READY] yet. No exceptions.

YOUR PURPOSE: Understand this person deeply enough to build personalized IDENTITIES and concrete actions that fit their actual life.

IDENTITY-FIRST THINKING:
- Think in terms of "who they want to become," not abstract goals.
- As you learn about them, mentally map each goal to an identity: "I am a daily mover," "I am a focused learner," "I am someone who shows up for people."
- Max 3 active identities. If they pick many areas, help them prioritize or group areas under shared identities.
- Use correct grammar in identity statements. Use "an" before vowel sounds ("an energetic person" not "a energetic person"). Use commas between multiple adjectives ("a calm, focused thinker").

HANDLING VAGUE OR LOW-EFFORT ANSWERS:
If someone says "all", "everything", "be better", "idk", a single word, or anything that doesn't give you concrete information — DO NOT accept it. Push back warmly:
- "all" → "Love the ambition. But if you had to pick the one area that feels most urgent right now, which would it be?"
- "be better" → "Better how though? Like waking up with more energy? Making more money? Feeling less stressed?"
- "idk" → "Totally fine. Let me try a different angle — what's one thing about your daily life right now that bugs you the most?"
- One-word answers → "Give me a bit more to work with — what does [their word] actually look like for you day to day?"

NEVER say "Got it. I have what I need" after a vague answer. That produces a garbage plan.

WHAT YOU NEED BEFORE [READY]:
1. At least one SPECIFIC goal with a concrete outcome (not a category) — and who they want to BE in that area
2. What their typical day/week looks like (when they work, when they're free, routine anchors like morning coffee, commute, lunch, gym, bedtime)
3. How much time per day they can realistically commit to new habits (ask directly: "How much time each day could you set aside — even 10 minutes counts?")
4. What has gone wrong before when they tried to improve (the BEHAVIORAL pattern, not the surface excuse)

HOW TO ASK:
- One question per message. Under 40 words.
- React to what they said. Reference their words back to them.
- Be warm, not clinical. Match their vibe.
- Never judge any goal.
- Never give advice during onboarding. Just understand.
- When they mention a goal, gently probe for the identity behind it: "So you want to be someone who..."
- Be supportive and non-judgmental at all times. Celebrate what they share, never criticize.

PRIVACY:
- Never include sensitive personal data (exact weight, income, medical conditions) in identity statements or habit names.
- Keep identity statements aspirational and general.

ENDING:
After ${minQ}+ questions, when you have specific concrete information, write a one-sentence summary that frames their goals as identities ("You want to become someone who..."), then [READY] on its own line.`;
}

export function buildExtractionPrompt(conversation, selectedAreas) {
  const areaLabels = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)?.label || id).join(", ");
  return `Extract structured data from this coaching conversation. Be specific — use the user's actual words.

Selected areas: ${areaLabels}

CONVERSATION:
${conversation.map(m => `${m.role === "user" ? "User" : "Coach"}: ${m.content}`).join("\n")}

EXTRACTION RULES:
- IDENTITIES are the core unit. Group the user's goals under max 3 identities. Each identity = "I am a [noun phrase]" (max 5 words). Example: "I am a daily mover", "I am a focused builder", "I am someone who shows up."
- GRAMMAR: Use correct articles ("an" before vowel sounds: "an active person", "an intentional learner"). Use commas between adjectives: "a calm, focused thinker" not "a calm focused thinker."
- Map each selected area to an identity. Multiple areas can share one identity if they're related.
- For each identity/goal: make it concrete and measurable even if the user was vague. If they said "get fit" and then said "I want to run a 5K", the goal is "Run a 5K" not "get fit."
- For struggles: extract the BEHAVIORAL PATTERN, not the surface excuse. "I quit after 2 weeks" → "loses momentum once initial excitement fades." "No time" → "doesn't protect time blocks for habits."
- For routine: extract actual anchors (morning coffee, commute, lunch break, gym, bedtime) that can be used as habit stack triggers.
- Extract available_time: how many minutes per day the user said they can commit. If not mentioned, default to 30.
- PRIVACY: Never include sensitive personal data (exact weight, income, medical details) in identity statements or goals. Keep them aspirational.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "identities": [
    {
      "identity": "I am a [noun phrase]",
      "areas": ["area id(s) this identity covers"],
      "goal": "specific measurable goal using their words",
      "struggle": "the behavioral pattern that stops them",
      "routine_context": "relevant routine detail for triggers"
    }
  ],
  "goals": [
    {
      "area": "area id (health/career/spiritual/relations/growth/fun)",
      "goal": "specific measurable goal using their words",
      "struggle": "the behavioral pattern that stops them",
      "routine_context": "relevant routine detail for this area's triggers"
    }
  ],
  "available_time": 30,
  "daily_routine": "their day structure: morning/work/evening patterns with specific anchors",
  "key_insight": "the ONE behavioral pattern that if broken would unlock everything else"
}`;
}

export function buildUnifiedPlanPrompt(extractedData, dailyLoad, difficulty) {
  const diffMap = {
    easy: "5-15 minutes per action, very approachable",
    medium: "15-30 minutes per action, moderate effort",
    hard: "30-60 minutes per action, serious commitment",
  };
  const availTime = extractedData.available_time || 30;
  const maxPerDay = Math.min(dailyLoad, availTime <= 20 ? 2 : availTime <= 40 ? 3 : 5);

  const identitiesDesc = (extractedData.identities || []).map(id =>
    `- Identity: "${id.identity}" | Areas: ${id.areas?.join(", ") || "general"} | Goal: ${id.goal} | Struggle: ${id.struggle} | Routine context: ${id.routine_context || "none given"}`
  ).join("\n");
  const goalsDesc = extractedData.goals.map(g =>
    `- Area: ${g.area} | Goal: ${g.goal} | Struggle: ${g.struggle} | Routine context: ${g.routine_context || "none given"}`
  ).join("\n");

  return `You are 1%, an identity-based habit architect. Build a unified weekly plan that expresses the user's identities through rotating daily actions.

USER PROFILE:
${identitiesDesc ? `IDENTITIES:\n${identitiesDesc}\n` : ""}GOALS:
${goalsDesc}
- Daily routine: ${extractedData.daily_routine}
- Key insight: ${extractedData.key_insight}
- Available time: ${availTime} minutes per day
- Difficulty: ${difficulty} (${diffMap[difficulty]})
- Actions per day: ${maxPerDay} (scaled to user's available time)

CORE PRINCIPLES:
- Identity-first: Every action is an expression of an identity ("I am a daily mover" → "20 bodyweight squats").
- Rotation & variety: Different actions across days, same identities and time slots. NOT the same checklist every day. Avoid repeating the exact same action on multiple days unless the user explicitly requested it. Vary the specific behavior while keeping it tied to the same identity.
- 2-minute fallbacks are MANDATORY: For every action, define a trivially achievable entry behavior that truly takes under 2 minutes. "Open the book to your bookmark" not "read for 2 minutes." "Lay out running clothes" not "go for a short run."
- At least 1 REST DAY per week with zero or only 1 light/optional task.
- No single action should require more than 60 minutes.
- Do NOT schedule intense physical habits on consecutive days. Balance physical and non-physical tasks.

TIME-AWARE SCHEDULING:
- The user has ~${availTime} minutes per day. Scale accordingly.
- Each time slot (morning/midday/afternoon/evening) gets at most ONE task per day.
- No more than 2 primary habits on the same day.
${availTime <= 20 ? "- User has very limited time. Keep plans minimal: 1-2 small habits per day. Focus on consistency over volume." : availTime <= 40 ? "- Moderate time budget. 2-3 habits per day, mostly small and medium difficulty." : "- Good time budget. Can include ambitious habits alongside smaller ones."}

TASK: Generate 3 DISTINCT weekly plans. Each weaves ALL identities across the week through varied actions.

PLAN A — "Balanced Rhythm": Identities distributed evenly. Predictable pattern. Same time slots each day.
PLAN B — "Energy Matched": High-energy actions on weekday mornings, reflective actions evenings/weekends.
PLAN C — "Deep Focus": Specific days dedicated to specific identities for deeper engagement.

RULES:
1. Each day has at most ${maxPerDay} action(s). Over 7 days, every identity appears at least 2-3 times.
2. EVERY action starts with a verb and is SPECIFIC and MEASURABLE. BAD: "exercise" GOOD: "Do 20 bodyweight squats". BAD: "read" GOOD: "Read 10 pages of current book."
3. EVERY action has a "timeSlot" — "morning" (6-9am), "midday" (11am-1pm), "afternoon" (2-5pm), "evening" (6-9pm). Only ONE action per time slot per day.
4. EVERY action has "suggestedTriggers" — 3 habit-stack triggers. Format: "After I [routine]". Use the user's actual routine anchors. Make them diverse.
5. EVERY action has "twoMin" — the ENTRY BEHAVIOR (not a shorter version). Must be trivially achievable in under 2 minutes.
6. EVERY action has "identity" — "I am a [noun phrase]" max 5 words. Same identity string used consistently. Correct grammar: "an" before vowels, commas between adjectives.
7. EVERY action has "area" matching: health, career, spiritual, relations, growth, fun.
8. Weekends should feel lighter. At least one day with 0-1 tasks.
9. Each plan: name (2-4 words) and philosophy (one sentence referencing the user's key insight).
10. NEVER output pure goals or outcomes as actions. "Lose 10kg" is NOT an action. "Do 15 minutes of HIIT" IS.
11. NEVER include sensitive personal data (exact weight, income, medical details) in actions or identities.

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

export function buildHabitSuggestionPrompt(extractedData, struggles, selectedAreas) {
  const identitiesDesc = (extractedData.identities || []).map(id =>
    `- Identity: "${id.identity}" → Goal: ${id.goal} (struggle: ${id.struggle})`
  ).join("\n");
  const goalsDesc = extractedData.goals.map(g =>
    `- ${g.area}: ${g.goal} (struggle: ${g.struggle})`
  ).join("\n");
  const struggleList = struggles.map(s => STRUGGLES.find(st => st.id === s)?.label || s).join(", ");
  const availTime = extractedData.available_time || 30;

  return `Based on this person's identities, goals, and struggles, suggest specific habits that EXPRESS their identities through action.

${identitiesDesc ? `IDENTITIES:\n${identitiesDesc}\n` : ""}GOALS:
${goalsDesc}

STRUGGLES: ${struggleList || "none specified"}
DAILY ROUTINE: ${extractedData.daily_routine || "not specified"}
AVAILABLE TIME: ${availTime} minutes per day

DIVERSITY & VARIETY:
- Generate at least 5 suggestions per selected area (${selectedAreas.length} areas = at least ${selectedAreas.length * 5} total suggestions).
- For each area, include a MIX of difficulty levels:
  • Small (5-10 min, easy to start)
  • Medium (15-30 min, moderate effort)
  • Ambitious (30-60 min, for motivated days)
- VARY the actions. Do NOT suggest the same action twice. Each suggestion should be a genuinely different behavior.
- Do NOT suggest intense physical habits on consecutive days in the weekly plan.

TIME-AWARE LIMITS:
- The user has ~${availTime} minutes per day. ${availTime <= 20 ? "Cap at 2-3 habits per day maximum. Focus on small and medium difficulty." : availTime <= 40 ? "Cap at 3-4 habits per day. Mix of small and medium, with occasional ambitious." : "Up to 5 habits per day is fine. Include ambitious options."}

Each habit should have:
- action: the specific habit (starts with a verb, measurable, concrete)
  BAD: "exercise more" GOOD: "Do 20 bodyweight squats"
  BAD: "read" GOOD: "Read 10 pages of current book"
  BAD: "save money" GOOD: "Transfer $10 to savings account"
- area: which life area (health/career/spiritual/relations/growth/fun)
- twoMin: the 2-minute ENTRY BEHAVIOR — must be trivially achievable and truly doable in under 2 minutes. "Open the book to your bookmark" not "read for 2 minutes." "Lay out your running clothes" not "go for a short run."
- suggestedTriggers: 3 different trigger options ("After I [routine]") — use the user's actual routine anchors when available
- identity: "I am a [noun phrase]" max 5 words — MUST match one of the user's identities consistently
- difficulty: "small" | "medium" | "ambitious"

GRAMMAR: Use correct articles in identity statements ("an" before vowel sounds). Use commas between adjectives.
PRIVACY: Never include sensitive personal data (weight, income, medical details) in actions or identities.

Distribute suggestions across ALL their identities and selected areas. Weight toward areas they seem most motivated about.

Respond ONLY with valid JSON (no markdown, no backticks):
{"habits": [{"action":"string","area":"string","twoMin":"string","suggestedTriggers":["string","string","string"],"identity":"string","difficulty":"small|medium|ambitious"}]}`;
}

export function buildSchedulePrompt(habits, routine, availTime) {
  const habitList = habits.map((h, i) => `${i}: "${h.action}" (${h.area}, ${h.difficulty || "medium"})`).join("\n");
  const maxPerDay = (availTime || 30) <= 20 ? 2 : (availTime || 30) <= 40 ? 3 : 4;

  return `Distribute these habits across a 7-day week. The user will be able to rearrange after.

HABITS:
${habitList}

USER ROUTINE: ${routine || "standard 9-5 schedule"}
AVAILABLE TIME: ${availTime || 30} minutes per day

RULES:
- Max ${maxPerDay} actions per day (based on user's available time).
- No more than 2 PRIMARY habits on the same day.
- Each time slot (morning/midday/afternoon/evening) gets at most ONE task per day.
- At least 1 REST DAY per week (Saturday or Sunday) with zero or only 1 light task.
- Don't put all similar habits on the same day.
- Do NOT schedule intense physical habits on consecutive days. Alternate physical and non-physical tasks.
- Weekends should feel lighter and more enjoyable.
- For each placement, assign a timeSlot: morning, midday, afternoon, or evening
- Use the habit's index number to reference it

Respond ONLY with valid JSON (no markdown, no backticks):
{"schedule":{"mon":[{"habitIdx":0,"timeSlot":"morning"}],"tue":[...],"wed":[...],"thu":[...],"fri":[...],"sat":[...],"sun":[...]}}`;
}

export function generateFallbackPlans(load, areas) {
  const a = areas[0] || "health";
  const uid = () => `a_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const makeDay = (acts) => acts.map(act => ({ ...act, id: uid() })).slice(0, load);
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
