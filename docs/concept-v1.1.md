# 1% — Product Concept Document v1.1

## Vision
The world's most effective habit app. Not through more features, but through the right system: identity-based coaching, rotating weekly plans, and a design that makes coming back feel better than giving up.

## Core Thesis
Every habit app fails the same way: it becomes a guilt machine. 1% inverts this. Missing a day is expected. Partial credit counts. The plan rotates so boredom never sets in. And the AI coach knows WHO you're becoming, not just WHAT you're doing.

---

## 1. BRAND IDENTITY

### Tagline
"The habit system that works."

### Design Language
- **Palette**: Warm cream (#FAFAF8) + deep ink (#151515) + burnt orange accent (#C2632A)
- **Typography**: Instrument Serif (display) + Satoshi (body) — editorial, not clinical
- **Tone**: Calm confidence. Never pushy. Never guilt-tripping. Like a friend who ran a marathon and doesn't brag about it.
- **Motion**: Subtle fade-ins, stagger animations, pulse rings. Nothing flashy. Everything intentional.

### Brand Differentiator
Other apps track habits. 1% builds identities.
- Habitica = gamified to-do list
- Streaks = streak counter with Apple integration
- Habitify = analytics dashboard
- **1% = AI identity coach with rotating weekly plans**

---

## 2. USER JOURNEY

### Phase 1: First Impression (USP Carousel)
Three slides. No sign-up wall. No tutorial dump.
1. "Not the same list every day." — Plans rotate weekly
2. "One app. Your whole life." — Multi-area coverage
3. "You came back." — Compassion-first design

Interaction: Swipe or tap. Skip available on slides 1-2. Last slide CTA: "Build my system."

### Phase 2: Onboarding (AI Coach Chat)
- User picks 1-3 life areas (Health, Career, Spiritual, Relationships, Growth, Fun)
- AI coach has a real conversation (3-6 questions, one per message)
- Extracts: specific goals, daily routine anchors, available time, past failure patterns
- Maps everything to max 3 IDENTITIES ("I am a daily mover")
- **Trust layer**: Coach explains its reasoning — "I'm suggesting this because you said mornings are your best time." Transparency builds buy-in.

### Phase 3: Plan Generation
- User selects struggle patterns (consistency, motivation, time, overwhelm, forgetting, perfectionism)
- System shows how the plan adapts to each struggle
- AI generates habit suggestions (5+ per area, three difficulty tiers)
- User curates their habit pool, adds custom ones
- AI generates 3 weekly plan variants; user picks one

### Phase 4: Daily Use (The Core Loop)
```
Morning: Open app -> "Today Clarity" screen — 3-5 actions with triggers, time estimates, identity link
Throughout day: Tap to complete (full or partial)
Evening: Check-in (easy/hard/partial/rest) + optional journal
Weekly: Plan auto-rotates with variety
```

**Today Clarity lock-in**: The morning screen shows exactly what, when, how long, and why — anchored to identity. "As a Daily Mover, your 7am action is 10 pushups (2 min)." Reduces decision fatigue to zero.

### Phase 5: Failure Recovery
- **48-hour reboot plan**: After 2+ missed days, system detects and offers a simplified "reboot day" — just 1-2 easy actions to rebuild momentum
- **Adaptive difficulty guardrails**: If completion rate drops below 50% for a week, AI automatically suggests easier variants. If above 90%, suggests leveling up.
- **Identity narrative in celebrations**: Milestones reference identity, not just streaks. "21 days as a Daily Mover — this is who you are now."
- **Comeback mode**: No guilt, just "You're back. Let's start easy."

### Phase 6: Growth & Retention
- Milestones at days 3, 7, 14, 21, 30, 66
- Progress screen with consistency %, mood timeline, area coverage
- Weekly replanning with completion-rate-aware AI
- Retention-critical window: Days 8-42 get extra attention (see Retention Strategy below)

---

## 3. RETENTION STRATEGY (NEW)

The biggest risk is churn in weeks 2-6 after the onboarding honeymoon. This section defines how we fight it.

### The Retention Funnel
```
Day 1-3:   Onboarding magic → First completions → "Started" milestone
Day 4-7:   Routine forming → Plan feels personal → "One Week" milestone
Day 8-14:  ⚠️ DANGER ZONE — novelty fades, real life intrudes
Day 15-30: ⚠️ CRITICAL — habit vs. abandonment decided here
Day 31-66: Consolidation → identity internalized → automatic behavior
Day 67+:   Retained user → expansion (social, premium)
```

### Retention Instruments
1. **Event tracking from day 1**: Every tap, screen view, completion, skip, and session duration logged locally. This is the foundation for all retention insights.
2. **Cohort analysis**: Group users by onboarding week, track D1/D7/D14/D30 retention per cohort.
3. **Churn prediction signals**:
   - Completion rate dropping 2+ days in a row
   - Session duration shrinking
   - Evening check-in skipped 3+ times
   - App not opened by usual time
4. **Intervention playbook**:
   - Day 2 silent: gentle push notification ("Your plan is waiting")
   - Day 3 silent: 48-hour reboot plan offered on next open
   - Day 7 silent: "We kept your progress. Pick up where you left off."
   - Day 14+ silent: Full comeback mode with simplified plan

### Instrumentation Requirements
Before building any Tier 2 feature, implement:
- [ ] Client-side event bus (action, timestamp, metadata)
- [ ] Session tracking (open/close, duration, screens visited)
- [ ] Completion funnel (plan shown → action tapped → marked complete)
- [ ] Weekly retention report (automated, viewable in admin)

---

## 4. FEATURE ROADMAP (REVISED)

> **Principle: Retention instrumentation before engagement features. Measure before you optimize.**

### TIER 1 — Foundation (Current State)
- [x] Identity-based AI onboarding coach
- [x] Rotating weekly plans with variety
- [x] 2-minute fallback versions for every habit
- [x] Habit stacking triggers
- [x] Full + partial completion tracking
- [x] Evening check-in with mood tracking
- [x] Milestone celebrations
- [x] Comeback mode (no-guilt return)
- [x] Manual schedule editing
- [x] PWA installable from browser
- [x] State persistence via localStorage

### TIER 2 — Retention & Measurement (Next Sprint)
> **Goal: Understand why users stay or leave before adding new features.**

- [ ] **Retention Analytics (PRIORITY 1)**
  - Client-side event tracking (completions, skips, sessions, screens)
  - Completion funnel instrumentation
  - Churn signal detection (declining completion rate, session gaps)
  - Weekly cohort retention dashboard (D1/D7/D14/D30)
  - A/B testing framework for plan variants

- [ ] **Streaks with Grace Days (PRIORITY 2)**
  - Track streaks but allow 1 "grace day" per week without breaking
  - Visual streak counter on each habit
  - Streak milestones (7, 14, 30, 60, 100 days)
  - Streaks derived from completion_events, never stored as canonical

- [ ] **Smart Notifications (PRIORITY 3)**
  - Push notifications at trigger times ("After your morning coffee — time for 10 pushups")
  - Adaptive timing based on completion patterns
  - Gentle re-engagement after 2+ days inactive
  - 48-hour reboot plan auto-trigger

- [ ] **Lightweight Gamification (PRIORITY 4)**
  - XP earned per completion (10 full, 5 partial, 3 rest day)
  - Levels tied to identity growth (Lv1 "Beginner Mover" → Lv10 "Daily Athlete")
  - Badges for milestones, streaks, variety, comebacks
  - Weekly XP summary — keep it simple, avoid dopamine treadmill

### TIER 3 — Analytics & Paywall (Month 2-3)
> **Goal: Build the premium value prop around insights, then test conversion.**

- [ ] **Enhanced Analytics Dashboard**
  - Completion rate by area, day of week, time of day
  - AI insights ("You're 40% more likely to complete morning habits")
  - Mood correlation with completion rates
  - Weekly/monthly trend charts
  - Identity progress narrative ("You've been a Daily Mover for 23 days")

- [ ] **Paywall Experiments**
  - Free: full onboarding + daily execution + 14-day history + basic streaks
  - Premium: advanced analytics + unlimited replans + deeper AI insights + export
  - Test conversion at different gates (analytics, replanning, history depth)
  - Track paywall impression → conversion → retention of paid users

- [ ] **Google Calendar Sync**
  - Two-way sync: habits appear as calendar events
  - Smart scheduling around existing commitments
  - Time block protection for habit time

- [ ] **Share Cards**
  - Beautiful shareable image of daily/weekly progress
  - "Day 30" milestone cards for social media
  - No data leakage — just progress art

### TIER 4 — Social (Month 3-4)
> **Goal: Social features only after core retention is proven. Start small.**

- [ ] **Accountability Partners** (start here, not guilds)
  - Invite a friend to see your daily completion (not details, just %)
  - Mutual encouragement messages
  - Joint goals ("Both hit 80% this week")

- [ ] **Guild System** (only if partner feature shows traction)
  - Join or create small groups (5-20 people) around shared identities
  - Group challenges ("Guild completes 100 total actions this week")
  - Group leaderboard (opt-in, no shaming)
  - **Toxicity guardrails**: no public shame, no negative comparisons, report/block

### TIER 5 — Platform & Scale (Month 4-6)
> **Goal: Native apps only after product-market fit is validated on web.**

- [ ] **React Native App**
  - iOS + Android native apps
  - Apple Health / Google Fit auto-tracking
  - Haptic feedback on completions
  - Widget for home screen (today's next action)

- [ ] **Timed Routines**
  - Chain multiple habits into a timed sequence
  - Countdown timer with ambient sounds
  - "Morning routine" and "Evening wind-down" presets

- [ ] **AI Coach Evolution**
  - Mid-week check-ins ("I noticed you skipped Tuesday — was that intentional?")
  - Proactive difficulty adjustment
  - Seasonal/life-event awareness ("Starting a new job? Let's simplify your plan")
  - Voice interaction for hands-free check-ins
  - **Coach memory separated from identity statements** — coach context stored independently for richer personalization

---

## 5. SYSTEM ARCHITECTURE

### Current (Web PWA)
```
[Browser/PWA]
    |
    |--- React SPA (Vite)
    |       |--- App.jsx (components + state provider)
    |       |--- constants.js (data)
    |       |--- prompts.js (AI prompts)
    |       |--- styles.js (CSS)
    |
    |--- localStorage (persistence)
    |
    |--- /api/chat (Vercel serverless)
            |--- Anthropic Claude API
```

### Near-term Refactor (Before Server Migration)
```
State Architecture Refactor:
    Current: single useState blob in AppProvider (~40 variables)

    Step 1: useReducer per domain
        |--- authStore    (user, session, preferences)
        |--- planStore    (weekPlan, planVariants, schedule)
        |--- habitStore   (habits, completions, streaks, milestones)
        |--- uiStore      (screen, modals, loading states, animations)

    Step 2: Selectors + memoization
        |--- useTodayPlan()     — precomputed today view model
        |--- useCompletionRate() — derived metrics, memoized
        |--- useStreaks()        — derived from completions, never stored

    Step 3: Service layer
        |--- aiService     (all Claude API calls, strict timeout, retry)
        |--- storageService (persistence abstraction over localStorage)
        |--- eventService   (client-side analytics event bus)

    Step 4: State machines for complex flows
        |--- onboardingMachine (areas → chat → struggles → habits → calendar → ready)
        |--- checkinMachine    (prompt → select → journal → reflect → done)
```

### Strangler Migration (localStorage → Server)
```
Phase 1: Add user_id + lightweight auth (magic link or OAuth)
Phase 2: Keep localStorage as local cache
Phase 3: Introduce server as source of truth (Supabase)
Phase 4: Build sync engine — optimistic local writes, background server sync
Phase 5: Conflict resolution (server wins for plans, merge for completions)

Timeline: Start Phase 1 in Month 2, complete Phase 3 by Month 3
```

### Target (Month 4+)
```
[React Native App]        [Web App]
       \                    /
        \                  /
    [API Gateway (Vercel/AWS)]
            |
    [Supabase / PostgreSQL]
       |        |        |
    Users    Habits    Social
       |        |        |
    [Claude API]  [Push Notifications]  [Calendar API]
            |
    [Analytics Pipeline]
       |
    [AI Insights Engine]
```

---

## 6. DATA MODEL (REVISED)

### Current: localStorage blob
```
All state in one JSON object → no user accounts → no sync
```

### Target: Relational DB (Supabase/PostgreSQL)
```sql
-- Core entities
users (
    id UUID PK,
    email TEXT UNIQUE,
    created_at TIMESTAMP,
    tier ENUM('free','premium'),
    onboarded_at TIMESTAMP,
    last_active_at TIMESTAMP
)

identities (
    id UUID PK,
    user_id FK → users,
    statement TEXT,          -- "I am a daily mover"
    areas TEXT[],
    created_at TIMESTAMP,
    active BOOLEAN
)

-- Coach memory separate from identities
ai_interactions (
    id UUID PK,
    user_id FK → users,
    type ENUM('onboarding','replan','checkin','insight'),
    input_summary TEXT,
    output_summary TEXT,
    tokens_used INTEGER,
    created_at TIMESTAMP
)

coach_memory (
    id UUID PK,
    user_id FK → users,
    key TEXT,               -- 'routine_anchors', 'failure_patterns', 'preferences'
    value JSONB,
    updated_at TIMESTAMP
)

-- Habits & execution
habits (
    id UUID PK,
    user_id FK → users,
    identity_id FK → identities,
    action TEXT,
    two_min_version TEXT,
    triggers TEXT[],
    difficulty_tier ENUM('easy','medium','hard'),
    created_at TIMESTAMP,
    archived_at TIMESTAMP NULL
)

habit_instances (
    id UUID PK,
    habit_id FK → habits,
    plan_version_id FK → plan_versions,
    scheduled_date DATE,
    time_slot TEXT,
    status ENUM('pending','completed','partial','skipped','rest')
)

plan_versions (
    id UUID PK,
    user_id FK → users,
    week_start DATE,
    variant_index INTEGER,
    days JSONB,
    generated_by ENUM('ai','manual_edit'),
    completion_rate FLOAT NULL,
    created_at TIMESTAMP
)

completion_events (
    id UUID PK,
    user_id FK → users,
    habit_instance_id FK → habit_instances,
    status ENUM('full','partial','skipped','rest'),
    mood TEXT NULL,
    note TEXT NULL,
    completed_at TIMESTAMP
)

-- Derived / cached (recomputed, not canonical)
-- Streaks are DERIVED from completion_events, not stored as source of truth
-- Weekly stats are materialized views refreshed on write

-- Retention & analytics
analytics_events (
    id UUID PK,
    user_id FK → users,
    event_type TEXT,         -- 'screen_view','tap','completion','session_start','session_end'
    metadata JSONB,
    created_at TIMESTAMP
)

notification_events (
    id UUID PK,
    user_id FK → users,
    type ENUM('trigger','reengagement','milestone','reboot'),
    sent_at TIMESTAMP,
    opened_at TIMESTAMP NULL,
    action_taken TEXT NULL
)

-- Growth & social
milestones (
    id UUID PK,
    user_id FK → users,
    type TEXT,
    identity_id FK → identities NULL,
    earned_at TIMESTAMP
)

user_preferences (
    user_id FK → users PK,
    notification_enabled BOOLEAN DEFAULT true,
    quiet_hours_start TIME NULL,
    quiet_hours_end TIME NULL,
    theme TEXT DEFAULT 'default',
    timezone TEXT
)

-- Experimentation
experiments (
    id UUID PK,
    name TEXT,
    variants JSONB,
    start_date DATE,
    end_date DATE NULL
)

experiment_assignments (
    id UUID PK,
    user_id FK → users,
    experiment_id FK → experiments,
    variant TEXT,
    assigned_at TIMESTAMP
)

-- Social (Tier 4, schema reserved)
friendships (user_id FK, friend_id FK, status ENUM, created_at)
guilds (id UUID PK, name TEXT, created_by FK, max_members INT, created_at)
guild_members (guild_id FK, user_id FK, joined_at, role ENUM)
```

---

## 7. MONETIZATION STRATEGY (REVISED)

### Free Tier (Forever)
- Full onboarding + AI coach
- Daily execution (today screen, completions, check-ins)
- 14-day completion history
- Basic streaks (no grace days)
- 1 AI replan per month
- 6 milestones
- Join 1 accountability partner

### Premium ($4.99/month or $39.99/year)
- Unlimited AI replanning
- Full completion history + advanced analytics
- AI insights ("You're 40% more likely to complete morning habits")
- Streak grace days
- Custom themes
- Calendar sync
- Share cards
- Create guilds (free: join only)
- Priority coach responses
- Export data

### Monetization Principles
1. **Free tier must deliver full daily value.** Users should love the app before they ever see a paywall.
2. **Premium unlocks depth, not core function.** Analytics, history, and customization — not basic habit tracking.
3. **Gate on insight, not on action.** Never block a user from completing a habit. Block them from seeing deeper patterns.

### Revenue Projections (Revised)
- **Conservative target**: 5,000 paying users in 6 months
- **Stretch target**: 15,000 paying users in 6 months
- At $4.99/mo = $24,950 - $74,850/month ARR
- Conversion rate target: 5-8% of active users (industry average for habit apps)
- Required free MAU: ~100,000 - 200,000
- **Key assumption**: Distribution (ASO, content marketing, referrals) is the bottleneck, not product quality
- **Milestone gates**: Don't invest in premium features until 10,000 free MAU reached

---

## 8. KEY METRICS

### North Star: "Weekly Active Completions"
Not DAU. Not downloads. How many habit completions happen per week per user.

### Retention Metrics (PRIORITY)
- D1/D7/D14/D30 retention by cohort
- Comeback rate (users returning after 3+ day gap)
- Time to first completion after install
- Churn prediction accuracy (signal → actual churn correlation)
- Reboot plan acceptance rate

### Engagement Metrics
- Onboarding completion rate (target: >70%)
- Actions per day (target: 2-4)
- Partial completion rate (higher = system working)
- Weekly plan acceptance rate
- Evening check-in completion rate
- Session duration and frequency

### Business Metrics
- Free → Premium conversion rate
- Paywall impression → conversion
- Premium retention (month over month)
- Revenue per user (ARPU)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)

---

## 9. COMPETITIVE MOAT & RISK MITIGATION

### What makes 1% defensible:
1. **Identity-first architecture** — No competitor maps habits to identities. This creates emotional investment that's hard to leave.
2. **Rotating plans** — Eliminates the #1 reason people quit: boredom from the same checklist.
3. **Compassion-first design** — Partial credit, rest days, comeback mode. Users don't feel punished.
4. **AI that learns** — Each replanning cycle uses completion data. The system genuinely improves.
5. **Community around identity** — Guilds organized by identity ("Daily Movers", "Focused Builders") create belonging, not competition.

### Risk Register (NEW)

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Distribution bottleneck** — Product quality doesn't matter if nobody finds it | High | High | Content marketing from day 1. SEO-optimized landing page. Referral program in Tier 3. Share cards for organic social. |
| **AI coaching commoditization** — Every app adds "AI coach" | High | Medium | Differentiate on identity architecture, not AI itself. AI is the engine, identity is the moat. Open-source the coaching framework to build community. |
| **Retention cliff after novelty** — Users love onboarding, leave in week 3 | High | High | Retention instrumentation in Tier 2. 48-hour reboot plans. Adaptive difficulty. Measure before you optimize. |
| **Premature platform rewrite** — React Native before PMF | Medium | Medium | Stay on web PWA until 10k MAU. Only go native when web retention proves the system works. |
| **Social feature overreach** — Guilds before accountability partners | Medium | Medium | Start with 1:1 partners. Only build guilds if partner feature shows 20%+ adoption. |
| **Weak instrumentation** — Shipping features without measuring impact | High | High | Every Tier 2+ feature ships with success metrics defined upfront. No feature without measurement. |
| **Social toxicity** — Public shaming, negative comparisons | Medium | Low | No public shame. Opt-in leaderboards only. Report/block from day 1. Identity-based groups, not competition-based. |
| **Trust/safety incidents** — AI coach gives harmful advice | Medium | Low | Coach stays in habit domain only. No mental health advice. Clear disclaimers. Human escalation path. |
| **Incumbent response** — Habitica/Streaks copy identity features | Medium | Medium | Move fast. First-mover advantage in identity-based coaching. Build switching costs through personalized AI memory. |

---

## 10. PERFORMANCE STRATEGY (NEW)

### Current Risks
- Single localStorage blob grows unbounded as completion history accumulates
- All state re-renders on any change (no memoization)
- AI API calls have no timeout or retry logic
- No render profiling or performance budgets

### Performance Roadmap

**Immediate (This Sprint)**
- Debounced, batched localStorage writes (300ms debounce, write only changed slices)
- Persist by domain slice (plans, completions, ui separately) instead of one blob
- Add strict 15-second timeout to all AI API calls with graceful fallback
- Precompute "today plan" view model on plan load, not on every render

**Near-term (Tier 2)**
- React.memo on all leaf components
- useMemo for derived data (completion rates, streaks, filtered lists)
- Web Vitals monitoring (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Render profiling in development builds
- Lazy load non-critical screens (Progress, Settings)

**Server Migration (Tier 3+)**
- API response caching with stale-while-revalidate
- Pagination for completion history (load 2 weeks, fetch more on scroll)
- Background sync with optimistic UI updates
- Service worker cache for offline-first experience

### AI API Budget
- Onboarding: ~6 API calls (coach conversation) — budget 30 seconds total
- Plan generation: 2-3 calls — budget 20 seconds with fallback plans
- Weekly replan: 1-2 calls — budget 15 seconds
- All calls: 15-second hard timeout, fallback to local generation on failure
- Track tokens per user per month for cost modeling

---

## 11. TECHNICAL DEBT PAYDOWN PLAN (NEW)

### Current Debt
The app is a monolith React SPA with ~1658 lines in App.jsx, ~40 useState variables in a single provider, no type safety, no tests, and CSS-in-JS as a string blob.

### Paydown Sequence (Ordered by Risk Reduction)

**Phase 1: State Refactor (Week 1-2)**
```
1. Extract useReducer for each domain (auth, plan, habit, ui)
2. Create custom hooks: useTodayPlan(), useCompletionRate(), useStreaks()
3. Add React.memo to all screen components
4. Result: Predictable state, testable reducers, fewer re-renders
```

**Phase 2: Service Layer (Week 2-3)**
```
1. Create aiService.js — all Claude API calls with timeout/retry/fallback
2. Create storageService.js — persistence abstraction (localStorage now, Supabase later)
3. Create eventService.js — analytics event bus
4. Result: Swappable backends, testable services, clear API boundary
```

**Phase 3: Component Extraction (Week 3-4)**
```
1. Extract screen components to /screens/*.jsx
2. Extract shared UI components to /components/*.jsx
3. Move to CSS Modules or Tailwind (from CSS string blob)
4. Result: Navigable codebase, reusable components
```

**Phase 4: Type Safety & Testing (Month 2)**
```
1. Add TypeScript incrementally (strict: false, migrate file by file)
2. Unit tests for reducers and services
3. Integration tests for onboarding flow
4. Result: Confidence for refactoring, catch regressions early
```

---

*Document version: 1.1*
*Status: Revised based on Codex technical review of v1.0*
*Changes from v1.0: Reordered roadmap (retention-first), added retention strategy section, expanded data model (13 new entities), revised monetization (conservative projections, gate-on-insight principle), added risk register, added performance strategy, added tech debt paydown plan, added state refactor architecture, enhanced UX (today clarity, 48-hour reboot, adaptive difficulty, trust layer)*
