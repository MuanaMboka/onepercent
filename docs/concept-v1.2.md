# 1% — Product Concept Document v1.2

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

### Brand/Coach Voice Guardrails (NEW)

**Allowed patterns:**
- Acknowledge effort: "You showed up today."
- Normalize setbacks: "Rest is part of the system."
- Reference identity: "As a Daily Mover, you..."
- Explain reasoning: "I'm suggesting this because you said mornings work best."
- Celebrate without comparison: "21 days — this is who you are now."

**Forbidden patterns:**
- ❌ Guilt language: "You missed yesterday," "You're falling behind"
- ❌ Comparison to others: "Most users do X," "Top performers..."
- ❌ Pressure/urgency: "Don't break your streak," "You need to..."
- ❌ Mental health claims: "This will help your anxiety," "Proven to reduce stress"
- ❌ Overclaiming: "Guaranteed results," "Science proves..."
- ❌ Unsolicited difficulty escalation: never increase difficulty without user opt-in

**Escalation rules:**
- If user expresses distress → respond with empathy, suggest professional resources, do not attempt to coach through it
- If user reports harmful content from coach → log incident, show pre-written safe response, flag for human review
- Coach domain boundary: habits and identity only. No medical, financial, or relationship advice.

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
- **Max onboarding time budget: 4 minutes.** If user has not reached plan generation by 4 min, offer to skip to quick-start defaults.
- **Branching logic**: If user selects 1 area → 3 questions. 2 areas → 4 questions. 3 areas → 5-6 questions.
- Extracts: specific goals, daily routine anchors, available time, past failure patterns
- Maps everything to max 3 IDENTITIES ("I am a daily mover")
- **Trust layer**: Coach explains its reasoning — "I'm suggesting this because you said mornings are your best time."
- **Abandonment handling**: If user closes mid-onboarding, state is preserved. On return, resume from last completed step with "Welcome back — let's pick up where you left off." If abandoned 3+ times, offer streamlined quick-start.

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

**Today Clarity lock-in**: The morning screen shows exactly what, when, how long, and why — anchored to identity. "As a Daily Mover, your 7am action is 10 pushups (2 min)."

**Time-to-first-win target: First habit completion within 5 minutes of first app open.** The onboarding flow is optimized so users can complete their first action before the dopamine of setup wears off.

### Phase 5: Failure Recovery
- **48-hour reboot plan**: After 2+ missed days, system detects and offers a simplified "reboot day" — just 1-2 easy actions to rebuild momentum
- **Adaptive difficulty guardrails**: If completion rate drops below 50% for a week, AI suggests easier variants (user must opt-in). If above 90% for 2+ weeks, suggests leveling up (user must opt-in). No automatic difficulty changes.
- **Identity narrative in celebrations**: Milestones reference identity, not just streaks. "21 days as a Daily Mover — this is who you are now."
- **Comeback mode**: No guilt, just "You're back. Let's start easy."

### Phase 6: Growth & Retention
- Milestones at days 3, 7, 14, 21, 30, 66
- Progress screen with consistency %, mood timeline, area coverage
- Weekly replanning with completion-rate-aware AI
- Retention-critical window: Days 8-42 get extra attention (see Retention Strategy below)

---

## 3. RETENTION STRATEGY

The biggest risk is churn in weeks 2-6 after the onboarding honeymoon.

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
1. **Event tracking from day 1**: Every tap, screen view, completion, skip, and session duration logged locally, synced to server after auth migration (Phase 2).
2. **Cohort analysis**: Group users by onboarding week, track D1/D7/D14/D30 retention per cohort.
3. **Churn prediction signals**:
   - Completion rate dropping 2+ days in a row
   - Session duration shrinking
   - Evening check-in skipped 3+ times
   - App not opened by usual time
4. **Intervention playbook** (with frequency caps):
   - Day 2 silent: gentle push notification ("Your plan is waiting") — max 1 notification/day
   - Day 3 silent: 48-hour reboot plan offered on next open
   - Day 7 silent: "We kept your progress. Pick up where you left off."
   - Day 14+ silent: Full comeback mode with simplified plan
   - **Frequency cap**: Max 1 re-engagement notification per 48 hours. After 3 ignored notifications, stop sending until user re-opens app.
   - **Consent gate**: User opts into notifications during onboarding. Can disable anytime. No notifications sent without explicit opt-in.

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

### TIER 2a — Instrumentation & Dashboard (Next Sprint, Weeks 1-3)
> **Goal: See what's happening before trying to change it.**
> **Exit criteria: Event pipeline shipping >95% of events, dashboard showing D1/D7 retention, completion funnel live.**

- [ ] **Retention Analytics**
  - Client-side event tracking (completions, skips, sessions, screens)
  - Completion funnel instrumentation
  - Churn signal detection (declining completion rate, session gaps)
  - Weekly cohort retention dashboard (D1/D7/D14/D30)

### TIER 2b — Interventions & Engagement (Weeks 4-6)
> **Goal: Act on data from 2a. Only ship interventions backed by instrumented signals.**
> **Exit criteria: Streak feature live, push notifications live with opt-in rate >50%, D7 retention improved by ≥5% vs pre-intervention cohort.**

- [ ] **Streaks with Grace Days**
  - Track streaks but allow 1 "grace day" per week without breaking
  - Visual streak counter on each habit — framed as "consistency" not "perfection"
  - Streak milestones (7, 14, 30, 60, 100 days)
  - Streaks derived from completion_events, never stored as canonical
  - **Identity framing**: "23 days as a Daily Mover" not "23-day streak"

- [ ] **Smart Notifications**
  - Push notifications at trigger times ("After your morning coffee — time for 10 pushups")
  - Adaptive timing based on completion patterns
  - Gentle re-engagement after 2+ days inactive
  - 48-hour reboot plan auto-trigger
  - Frequency caps and consent gates (see Retention Strategy)

- [ ] **Lightweight Gamification**
  - XP earned per completion (10 full, 5 partial, 3 rest day)
  - Levels tied to identity growth (Lv1 "Beginner Mover" → Lv10 "Daily Athlete")
  - Badges for milestones, streaks, variety, comebacks
  - Weekly XP summary — keep it simple, avoid dopamine treadmill

- [ ] **A/B Testing Framework**
  - See Experimentation Governance section for hypothesis template, stop rules, sample size

### TIER 3 — Analytics & Paywall (Month 2-3)
> **Exit criteria: Premium conversion rate ≥3% of users who see paywall, analytics dashboard NPS >7.**

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
- [ ] **Share Cards**

### TIER 4 — Social (Month 3-4)
> **Exit criteria: Accountability partner adoption ≥20% of D30 retained users before building guilds.**

- [ ] **Accountability Partners** (start here, not guilds)
  - Invite a friend to see your daily completion (not details, just %)
  - Mutual encouragement messages
  - Joint goals ("Both hit 80% this week")

- [ ] **Guild System** (only if partner feature hits exit criteria)
  - Join or create small groups (5-20 people) around shared identities
  - Group challenges ("Guild completes 100 total actions this week")
  - Group leaderboard (opt-in, no shaming)
  - **Moderation pipeline**: report/block, content review queue, auto-flag harmful patterns, escalation to human review

### TIER 5 — Platform & Scale (Month 4-6)
> **Exit criteria: Web D30 retention ≥25%, 10k MAU, PMF survey score ≥40% "very disappointed."**

- [ ] **React Native App**
- [ ] **Timed Routines**
- [ ] **AI Coach Evolution** (coach memory separated from identity statements)

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
    - Session model: JWT with 7-day refresh token
    - Device linking: one user, multiple devices, last-write-wins for preferences
    - Exit criteria: auth flow working, user can sign in on two devices

Phase 2: Keep localStorage as local cache
    - Exit criteria: localStorage reads/writes go through storageService abstraction

Phase 3: Introduce server as source of truth (Supabase)
    - Exit criteria: all new writes go to server, reads fall back to local cache on failure

Phase 4: Build sync engine — optimistic local writes, background server sync
    - Idempotency: every write carries a client-generated UUID; server deduplicates
    - Retry policy: exponential backoff (1s, 2s, 4s, max 30s), max 5 retries
    - Exit criteria: offline writes queue and sync on reconnect within 60 seconds

Phase 5: Conflict resolution
    - Plans: server wins (plans are authoritative from generation source)
    - Completions: merge (both client and server completions are valid; dedupe by UUID)
    - Preferences: last-write-wins with timestamp
    - Coach memory: server wins (AI-generated, single source)
    - Exit criteria: conflict resolution tested with simulated offline/online scenarios

Timeline: Start Phase 1 in Month 2, complete Phase 3 by Month 4 (revised from Month 3)
```

### Architecture Non-Functional Requirements (NFRs) (NEW)

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| API availability | 99.5% uptime (allows ~3.6 hrs/month downtime) | Uptime monitoring (e.g., Better Uptime) |
| API latency (p95) | < 2 seconds for non-AI calls | Server-side instrumentation |
| AI call latency (p95) | < 15 seconds with fallback | Client-side timing + fallback trigger rate |
| Error budget | 0.5% of requests may fail | Error rate monitoring |
| Client TTI | < 3 seconds on 4G connection | Lighthouse CI |
| Interaction latency | < 100ms for tap-to-feedback | Client-side profiling |
| Data sync latency | < 60 seconds after reconnect | Sync completion timestamp |
| Incident ownership | Single on-call engineer | PagerDuty/Opsgenie rotation (when team >1) |

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
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    tier ENUM('free','premium') NOT NULL DEFAULT 'free',
    onboarded_at TIMESTAMP NULL,
    last_active_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL              -- soft delete
)
-- Index: users(email), users(last_active_at)

identities (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    statement TEXT NOT NULL,
    areas TEXT[] NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    active BOOLEAN NOT NULL DEFAULT true
)
-- Index: identities(user_id, active)

ai_interactions (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    type ENUM('onboarding','replan','checkin','insight') NOT NULL,
    input_summary TEXT,                    -- never store raw user input long-term
    output_summary TEXT,
    tokens_used INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT now()
)
-- Retention: 90 days, then summarize and delete raw
-- Index: ai_interactions(user_id, created_at)

coach_memory (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(user_id, key)
)
-- Index: coach_memory(user_id)

habits (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    identity_id UUID FK → identities,
    action TEXT NOT NULL,
    two_min_version TEXT,
    triggers TEXT[],
    difficulty_tier ENUM('easy','medium','hard') NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    archived_at TIMESTAMP NULL
)
-- Index: habits(user_id, archived_at)

habit_instances (
    id UUID PK,
    habit_id UUID FK → habits NOT NULL,
    plan_version_id UUID FK → plan_versions NOT NULL,
    scheduled_date DATE NOT NULL,
    time_slot TEXT,
    status ENUM('pending','completed','partial','skipped','rest') NOT NULL DEFAULT 'pending'
)
-- Index: habit_instances(habit_id, scheduled_date)

plan_versions (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    week_start DATE NOT NULL,
    variant_index INTEGER NOT NULL,
    days JSONB NOT NULL,                   -- structured: {mon: [{habit_id, time_slot}], ...}
    generated_by ENUM('ai','manual_edit') NOT NULL,
    completion_rate FLOAT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
)
-- JSONB schema: validated at application layer, documented in Event & Sync Spec
-- Index: plan_versions(user_id, week_start)

completion_events (
    id UUID PK,                            -- client-generated UUID for idempotency
    user_id UUID FK → users NOT NULL,
    habit_instance_id UUID FK → habit_instances NOT NULL,
    status ENUM('full','partial','skipped','rest') NOT NULL,
    mood TEXT NULL,
    note TEXT NULL,
    completed_at TIMESTAMP NOT NULL,
    synced_at TIMESTAMP NULL               -- NULL = not yet synced
)
-- Dedupe: UNIQUE(id) — client UUID prevents duplicates
-- Index: completion_events(user_id, completed_at)

analytics_events (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    event_type TEXT NOT NULL,
    metadata JSONB,                        -- schema documented per event_type in Event Spec
    created_at TIMESTAMP NOT NULL DEFAULT now()
)
-- Retention: 180 days raw, then aggregate to daily summaries
-- Index: analytics_events(user_id, event_type, created_at)

notification_events (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    type ENUM('trigger','reengagement','milestone','reboot') NOT NULL,
    sent_at TIMESTAMP NOT NULL,
    opened_at TIMESTAMP NULL,
    action_taken TEXT NULL
)
-- Index: notification_events(user_id, sent_at)

milestones (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    type TEXT NOT NULL,
    identity_id UUID FK → identities NULL,
    earned_at TIMESTAMP NOT NULL
)

user_preferences (
    user_id UUID FK → users PK,
    notification_enabled BOOLEAN NOT NULL DEFAULT true,
    quiet_hours_start TIME NULL,
    quiet_hours_end TIME NULL,
    theme TEXT NOT NULL DEFAULT 'default',
    timezone TEXT NOT NULL DEFAULT 'UTC'
)

experiments (
    id UUID PK,
    name TEXT NOT NULL UNIQUE,
    variants JSONB NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    status ENUM('draft','running','paused','completed') NOT NULL DEFAULT 'draft'
)

experiment_assignments (
    id UUID PK,
    user_id UUID FK → users NOT NULL,
    experiment_id UUID FK → experiments NOT NULL,
    variant TEXT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(user_id, experiment_id)
)

-- Social (Tier 4, schema reserved)
friendships (user_id UUID FK, friend_id UUID FK, status ENUM, created_at TIMESTAMP, PRIMARY KEY(user_id, friend_id))
guilds (id UUID PK, name TEXT NOT NULL, created_by UUID FK, max_members INT DEFAULT 20, created_at TIMESTAMP)
guild_members (guild_id UUID FK, user_id UUID FK, joined_at TIMESTAMP, role ENUM('member','admin'), PRIMARY KEY(guild_id, user_id))
```

**Key design decisions:**
- Streaks are DERIVED from completion_events, never stored as source of truth
- Coach memory is separate from identity statements
- Weekly stats are materialized views refreshed on write
- All JSONB columns have documented schemas (see Event & Sync Spec)
- Soft delete on users; hard delete available via deletion workflow

---

## 7. DATA GOVERNANCE & PRIVACY (NEW)

### Data Classification

| Category | Examples | Storage | Retention |
|----------|----------|---------|-----------|
| **Identity** | Email, user preferences | Encrypted at rest (Supabase default AES-256) | Until account deletion |
| **Behavioral** | Completions, analytics events, sessions | Encrypted at rest | Raw: 180 days, then aggregated |
| **AI Content** | Coach conversations, input/output summaries | Encrypted at rest | 90 days, then summarized |
| **Sensitive** | Mood data, journal notes | Encrypted at rest, access-controlled | Until account deletion, user can delete individually |

### Data Minimization
- **ai_interactions**: Store summaries only, never raw conversation transcripts after processing
- **analytics_events metadata**: No PII in metadata fields. Validated at write time.
- **coach_memory**: Stores behavioral patterns (e.g., "prefers mornings"), never raw personal disclosures
- **Journal notes**: User-owned, deletable individually, never used for AI training

### Right to Delete (GDPR/CCPA)
1. User requests deletion via settings → "Delete my account"
2. System soft-deletes user record (deleted_at timestamp)
3. Within 30 days: all user data hard-deleted across all tables
4. AI interaction summaries purged
5. Analytics events anonymized (user_id → null) for aggregate retention
6. Confirmation email sent
7. **Deletion workflow tested quarterly**

### Consent Model
- **Notification consent**: Explicit opt-in during onboarding. Can disable in settings.
- **Analytics consent**: App tracks behavioral events for product improvement. Disclosed in privacy policy. User can opt out of analytics (events still logged locally but not synced).
- **AI data usage**: Coach conversations used only for that user's personalization. Never used for model training. Disclosed in onboarding.
- **Data export**: User can export all their data as JSON via settings (premium feature).

### PII Boundaries
- No PII in: analytics_events.metadata, experiment_assignments, notification_events
- PII present in: users.email, coach_memory (potential), completion_events.note (potential)
- PII fields are tagged in schema and excluded from any future data pipeline exports

---

## 8. EVENT & SYNC SPEC (NEW)

### Event Schema

Every event follows this structure:
```json
{
  "id": "uuid-v4",              // client-generated, idempotency key
  "user_id": "uuid",
  "event_type": "string",       // from allowed enum
  "metadata": {},               // type-specific, schema below
  "client_timestamp": "ISO8601",
  "server_timestamp": null,     // set on sync
  "schema_version": 1
}
```

### Event Types & Metadata Schemas

| Event Type | Metadata Fields | Example |
|------------|----------------|---------|
| `session_start` | `{device, app_version, timezone}` | `{device:"pwa", app_version:"1.2", timezone:"EST"}` |
| `session_end` | `{duration_seconds, screens_visited[]}` | `{duration_seconds:320, screens_visited:["today","progress"]}` |
| `screen_view` | `{screen_name, source}` | `{screen_name:"today", source:"app_open"}` |
| `habit_complete` | `{habit_id, status, time_slot}` | `{habit_id:"uuid", status:"full", time_slot:"morning"}` |
| `checkin_submit` | `{mood, note_length, day_number}` | `{mood:"easy", note_length:42, day_number:7}` |
| `plan_generated` | `{variant_index, habit_count, areas[]}` | `{variant_index:1, habit_count:4, areas:["health"]}` |
| `notification_received` | `{notification_type, response}` | `{notification_type:"reengagement", response:"opened"}` |
| `paywall_impression` | `{gate_type, context}` | `{gate_type:"analytics", context:"progress_screen"}` |

### Schema Versioning
- Every event carries `schema_version` field
- On version bump: old events remain valid, new fields are additive only
- Breaking changes require new event_type (e.g., `habit_complete_v2`)

### Event Delivery Semantics
- **Guarantee**: At-least-once delivery (client retries until server ACK)
- **Deduplication**: Server deduplicates by event `id` (UUID)
- **Ordering**: Events are timestamped client-side; server does not guarantee ordering
- **Offline queue**: Events queued in localStorage when offline, synced on reconnect
- **Queue size limit**: Max 500 events queued locally; oldest dropped if exceeded (with warning logged)
- **Retry policy**: Exponential backoff (1s, 2s, 4s, max 30s), max 5 retries per batch
- **Batch sync**: Events synced in batches of 50, max 1 batch per 5 seconds

### Sync Protocol (Completion Events)
```
Client                              Server
  |--- POST /sync/completions ------->|
  |    body: [{id, habit_instance_id, |
  |           status, mood, note,     |
  |           completed_at}]          |
  |                                   |--- dedupe by id
  |                                   |--- validate habit_instance_id exists
  |                                   |--- store, set synced_at
  |<--- 200 {synced: [ids]} ---------|
  |--- remove synced from local queue |
```

### Failure Modes
- **Server unreachable**: Queue locally, retry on reconnect
- **Validation failure**: Log error, remove from queue, do not retry (bad data)
- **Partial batch failure**: Server returns per-item success/failure; client retries only failures

---

## 9. EXPERIMENTATION GOVERNANCE (NEW)

### Hypothesis Template
Every experiment must document:
1. **Hypothesis**: "If we [change], then [metric] will [improve/decrease] by [amount] because [reason]."
2. **Primary metric**: One metric that determines success/failure
3. **Guardrail metrics**: Metrics that must NOT degrade (e.g., D7 retention, crash rate)
4. **Sample size**: Minimum users per variant (calculated from expected effect size)
5. **Duration**: Minimum runtime (typically 2 weeks for habit apps due to weekly cycles)
6. **Owner**: Person responsible for monitoring and decision

### Stop Rules
- **Stop for harm**: If guardrail metric degrades by >10% at any point, pause experiment immediately
- **Stop for signal**: If primary metric reaches statistical significance (p < 0.05) with sufficient sample, stop early
- **Stop for duration**: Maximum experiment runtime: 6 weeks. If no signal by then, declare inconclusive and roll back.
- **Dead-man switch**: If no one checks experiment results for 7 days, auto-pause

### Sample Size Guardrails
- Minimum 200 users per variant for feature-level experiments
- Minimum 50 users per variant for UI copy experiments
- Never run more than 2 simultaneous experiments on the same user (interaction effects)
- New users and existing users in separate experiment pools

### Ethics Constraints
- Never experiment on notification frequency without consent disclosure
- Never withhold safety features (comeback mode, reboot plans) from any variant
- Never experiment on pricing without clear disclosure that prices may vary
- All experiments logged in experiments table with full audit trail

---

## 10. MONETIZATION STRATEGY (REVISED)

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

### Revenue Projections (Corrected)

| Scenario | Paying Users (6mo) | Monthly Revenue (MRR) | Annual Run Rate (ARR) |
|----------|--------------------|-----------------------|-----------------------|
| Conservative | 5,000 | $24,950/mo | $299,400/yr |
| Stretch | 15,000 | $74,850/mo | $898,200/yr |

- Conversion rate target: 5-8% of monthly active users
- Required free MAU: ~63,000 (conservative) to ~188,000 (stretch)
- **Key assumption**: Distribution (ASO, content marketing, referrals) is the bottleneck, not product quality
- **Milestone gate**: Don't invest in premium features until 10,000 free MAU reached

### Unit Economics (NEW)

| Metric | Estimate | Notes |
|--------|----------|-------|
| **AI cost per user/month** | ~$0.15 | ~10 API calls/mo avg at ~$0.015/call (Claude Haiku for daily, Sonnet for replans) |
| **Infrastructure cost/user/month** | ~$0.05 | Supabase + Vercel at scale |
| **Total COGS per user/month** | ~$0.20 | |
| **Gross margin (premium)** | ~96% | $4.99 - $0.20 = $4.79 |
| **Gross margin (free)** | negative | ~$0.20/mo cost, $0 revenue |
| **Break-even free:paid ratio** | ~25:1 | 25 free users per 1 paid user to break even on infra |
| **Target LTV (premium)** | ~$30 | Assuming 6-month avg subscription length |
| **Max CAC** | ~$10 | LTV/3 rule for sustainable growth |

### AI Token Budget Per User

| Action | Model | Est. Tokens | Est. Cost | Frequency |
|--------|-------|-------------|-----------|-----------|
| Onboarding (6 msgs) | Sonnet | ~4,000 | $0.06 | Once |
| Weekly replan | Sonnet | ~2,000 | $0.03 | 4x/month |
| Daily coach nudge | Haiku | ~500 | $0.001 | 20x/month |
| AI insight generation | Sonnet | ~1,500 | $0.02 | 1x/month |
| **Monthly total (active user)** | | | **~$0.15** | |

### Price Testing Plan
- Phase 1: Launch at $4.99/mo, $39.99/yr (20% annual discount)
- Phase 2: Test $3.99 and $6.99 price points with new cohorts
- Phase 3: Test 7-day free trial vs. immediate paywall
- Phase 4: Test annual-first vs. monthly-first presentation
- All price tests follow Experimentation Governance (Section 9)

---

## 11. KEY METRICS

### North Star: "Weekly Active Completions"
Not DAU. Not downloads. How many habit completions happen per week per user.

**Definition**: Count of completion_events where status IN ('full', 'partial') per user per calendar week (Mon-Sun). Excludes 'rest' and 'skipped'.

### Metrics Dictionary (NEW)

| Metric | Formula | Window | Denominator | Alert Threshold |
|--------|---------|--------|-------------|-----------------|
| **D1 Retention** | Users active on day 1 after install / Users installed that day | Rolling daily | Install cohort | < 40% → 🔴 |
| **D7 Retention** | Users active on day 7 / Install cohort | Rolling daily | Install cohort | < 25% → 🔴 |
| **D30 Retention** | Users active on day 30 / Install cohort | Rolling daily | Install cohort | < 15% → 🔴 |
| **Onboarding Completion** | Users reaching "today" screen / Users starting onboarding | Rolling daily | Onboarding starters | < 60% → 🟡, < 50% → 🔴 |
| **Weekly Completions/User** | Avg completion_events (full+partial) per user per week | Weekly | Active users (≥1 session) | < 5 → 🟡, < 3 → 🔴 |

### Red Metrics (Paging Thresholds)
These 5 metrics trigger immediate investigation if breached:

1. **D1 Retention < 40%** — Onboarding is broken
2. **API Error Rate > 2%** — Infrastructure failure
3. **AI Fallback Rate > 20%** — Claude API degradation
4. **Onboarding Completion < 50%** — Flow is too long or confusing
5. **Crash-free Sessions < 99%** — Critical stability issue

### Supporting Metrics

**Retention**: Comeback rate, time to first completion, churn prediction accuracy, reboot plan acceptance rate

**Engagement**: Actions per day (target: 2-4), partial completion rate, plan acceptance rate, evening check-in completion rate, session duration and frequency

**Business**: Free→Premium conversion, paywall impression→conversion, premium retention MoM, ARPU, CAC, LTV

---

## 12. COMPETITIVE MOAT & RISK MITIGATION

### What makes 1% defensible:
1. **Identity-first architecture** — No competitor maps habits to identities. This creates emotional investment that's hard to leave.
2. **Rotating plans** — Eliminates the #1 reason people quit: boredom from the same checklist.
3. **Compassion-first design** — Partial credit, rest days, comeback mode. Users don't feel punished.
4. **AI that learns** — Each replanning cycle uses completion data. The system genuinely improves.
5. **Community around identity** — Guilds organized by identity ("Daily Movers", "Focused Builders") create belonging, not competition.

### Risk Register

| # | Risk | Severity | Likelihood | Owner | Leading Indicator | Mitigation | Contingency |
|---|------|----------|------------|-------|-------------------|------------|-------------|
| 1 | **Distribution bottleneck** — nobody finds the app | High | High | Marketing | Install rate < 100/week | Content marketing, SEO landing page, share cards, referral program | Paid acquisition test at $5 CAC cap |
| 2 | **AI coaching commoditization** — every app adds "AI coach" | High | Medium | Product | Competitor launches with identity framing | Differentiate on identity architecture, not AI. AI is engine, identity is moat | Open-source coaching framework for community/brand |
| 3 | **Retention cliff** — users churn weeks 2-6 | High | High | Product | D14 retention < 15% | Retention instrumentation, 48-hour reboot, adaptive difficulty | Simplify core loop, reduce friction, user interviews |
| 4 | **Premature platform rewrite** | Medium | Medium | Engineering | Team pressure before 10k MAU | Stay on web PWA until PMF validated | Delay native by 2 months if retention not proven |
| 5 | **Social feature overreach** | Medium | Medium | Product | Building guilds before partner adoption data | 1:1 partners first, guilds only at 20%+ adoption | Kill guilds feature, double down on 1:1 |
| 6 | **Weak instrumentation** | High | High | Engineering | Shipping features without metrics | Every feature has success metrics pre-defined | Freeze feature development, instrument retroactively |
| 7 | **Social toxicity** | Medium | Low | Trust & Safety | User reports, negative sentiment | No public shame, opt-in leaderboards, report/block, moderation queue | Disable social features, manual review |
| 8 | **Trust/safety — AI harmful advice** | Medium | Low | Trust & Safety | User reports of bad coach advice | Coach domain boundaries, no mental health advice, disclaimers | Kill coach feature, revert to static suggestions |
| 9 | **Incumbent response** | Medium | Medium | Product | Habitica/Streaks announce identity features | Move fast, build switching costs via AI memory | Deepen AI personalization, make data export easy |

### Trust & Safety Moderation Pipeline (NEW)
```
User reports harmful content
    → Auto-flag in moderation queue
    → Pre-written safe response shown to user immediately
    → Human reviewer triages within 24 hours
    → Actions: dismiss / warn author / remove content / ban user
    → Quarterly review of flagged patterns for systemic issues
```

---

## 13. PERFORMANCE STRATEGY

### Performance Budgets (NEW)

| Metric | Budget | Enforcement |
|--------|--------|-------------|
| TTI (Time to Interactive) | < 3 seconds on 4G | Lighthouse CI in PR checks |
| LCP (Largest Contentful Paint) | < 2.5 seconds | Web Vitals SDK |
| FID (First Input Delay) | < 100ms | Web Vitals SDK |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse CI |
| Interaction latency (tap → feedback) | < 100ms | Manual profiling quarterly |
| JS bundle size | < 200KB gzipped | Bundle analyzer in CI |
| Memory ceiling | < 50MB heap | Chrome DevTools profiling |

### Low-End Device Strategy (NEW)
- Target: Samsung Galaxy A13 (2GB RAM, mid-range 2022 phone) as reference device
- Reduced animations on devices with < 4GB RAM (use `prefers-reduced-motion` + manual check)
- No heavy images; SVG icons and CSS gradients only
- Lazy load all screens except "today" — today screen must render in < 1 second

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
- **Slow network mitigation**: Show skeleton UI with "Your coach is thinking..." during AI calls. If >8 seconds, show progress indicator. If >15 seconds, trigger local fallback and log AI timeout event.

---

## 14. TECHNICAL DEBT PAYDOWN PLAN

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
> **Exit criteria**: All useState variables replaced with domain reducers. Zero prop-drilling between domains. useTodayPlan() returns precomputed view model.

**Phase 2: Service Layer (Week 2-3)**
```
1. Create aiService.js — all Claude API calls with timeout/retry/fallback
2. Create storageService.js — persistence abstraction (localStorage now, Supabase later)
3. Create eventService.js — analytics event bus
4. Result: Swappable backends, testable services, clear API boundary
```
> **Exit criteria**: All AI calls go through aiService with 15s timeout. storageService has read/write/subscribe interface. eventService can queue and flush events.

**Phase 3: Component Extraction (Week 3-4)**
```
1. Extract screen components to /screens/*.jsx
2. Extract shared UI components to /components/*.jsx
3. Move to CSS Modules or Tailwind (from CSS string blob)
4. Result: Navigable codebase, reusable components
```
> **Exit criteria**: App.jsx < 200 lines (imports + router + provider). Each screen in own file. No inline CSS strings.

**Phase 4: Type Safety & Testing (Month 2)**
```
1. Add TypeScript incrementally (strict: false, migrate file by file)
2. Unit tests for reducers and services (target: 80% coverage on reducers/services)
3. Integration tests for onboarding flow
4. Result: Confidence for refactoring, catch regressions early
```
> **Exit criteria**: All reducers and services in TypeScript. 80% test coverage on reducers + services. CI runs tests on every PR.

### Sequencing Policy
- **No migration (Section 5 Phase 1+) before Phase 2 exit criteria met** — storageService abstraction must exist before swapping backends
- **No Tier 2b features before Phase 1 exit criteria met** — state refactor must be done before adding streaks/notifications state
- **Refactor freeze during feature sprints** — alternate: 1 week refactor, 1 week features. Never both simultaneously.

---

*Document version: 1.2*
*Status: Revised based on Codex Round 2 review (7.6/10)*
*Changes from v1.1: Added Brand/Coach Voice Guardrails, onboarding abandonment handling, time-to-first-win target, split Tier 2 into 2a/2b with exit criteria, added Architecture NFRs table, added full schema constraints/indexes/soft-delete, added Data Governance & Privacy section, added Event & Sync Spec, added Experimentation Governance, fixed MRR/ARR labeling, added unit economics and AI token budget, added Metrics Dictionary with red metrics/paging thresholds, expanded risk register to full table with owner/leading indicators/contingency, added Trust & Safety moderation pipeline, added performance budgets and low-end device strategy, added exit criteria per debt paydown phase, added sequencing policy*
