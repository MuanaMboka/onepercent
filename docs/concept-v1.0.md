# 1% — Product Concept Document v1.0

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

### Phase 3: Plan Generation
- User selects struggle patterns (consistency, motivation, time, overwhelm, forgetting, perfectionism)
- System shows how the plan adapts to each struggle
- AI generates habit suggestions (5+ per area, three difficulty tiers)
- User curates their habit pool, adds custom ones
- AI generates 3 weekly plan variants; user picks one

### Phase 4: Daily Use (The Core Loop)
```
Morning: Open app -> See today's 3-5 actions with triggers
Throughout day: Tap to complete (full or partial)
Evening: Check-in (easy/hard/partial/rest) + optional journal
Weekly: Plan auto-rotates with variety
```

### Phase 5: Growth & Retention
- Milestones at days 3, 7, 14, 21, 30, 66
- Progress screen with consistency %, mood timeline, area coverage
- Weekly replanning with completion-rate-aware AI
- Comeback mode for users who disappeared (no guilt, just "you're back")

---

## 3. FEATURE ROADMAP

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

### TIER 2 — Engagement & Retention (Next Sprint)
- [ ] **Gamification System**
  - XP earned per completion (10 full, 5 partial, 3 rest day)
  - Levels tied to identity growth (Lv1 "Beginner Mover" -> Lv10 "Daily Athlete")
  - Badges for milestones, streaks, variety, comebacks
  - Weekly XP summary with trend graph
- [ ] **Smart Notifications**
  - Push notifications at trigger times ("After your morning coffee — time for 10 pushups")
  - Adaptive timing based on completion patterns
  - Gentle re-engagement after 2+ days inactive
- [ ] **Enhanced Analytics Dashboard**
  - Completion rate by area, day of week, time of day
  - AI insights ("You're 40% more likely to complete morning habits")
  - Mood correlation with completion rates
  - Weekly/monthly trend charts
- [ ] **Habit Streaks with Grace Days**
  - Track streaks but allow 1 "grace day" per week without breaking
  - Visual streak counter on each habit
  - Streak milestones (7, 14, 30, 60, 100 days)

### TIER 3 — Social & Ecosystem (Month 2-3)
- [ ] **Accountability Partners**
  - Invite a friend to see your daily completion (not details, just %)
  - Mutual encouragement messages
  - Joint goals ("Both hit 80% this week")
- [ ] **Guild System**
  - Join or create small groups (5-20 people) around shared identities
  - Group challenges ("Guild completes 100 total actions this week")
  - Group leaderboard (opt-in, no shaming)
- [ ] **Google Calendar Sync**
  - Two-way sync: habits appear as calendar events
  - Smart scheduling around existing commitments
  - Time block protection for habit time
- [ ] **Share Cards**
  - Beautiful shareable image of daily/weekly progress
  - "Day 30" milestone cards for social media
  - No data leakage — just progress art

### TIER 4 — Platform & Scale (Month 3-6)
- [ ] **React Native Rewrite**
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
- [ ] **Premium Tier ($4.99/mo)**
  - Unlimited AI replanning (free: 2x/month)
  - Advanced analytics & AI insights
  - Custom themes & icons
  - Priority support
  - Guild creation (free: join only)

---

## 4. SYSTEM ARCHITECTURE

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

### Target (Month 3+)
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

### Data Model Evolution
```
Current: localStorage blob
    -> All state in one JSON object
    -> No user accounts
    -> No sync

Target: Relational DB
    -> users (id, email, created_at, tier)
    -> identities (id, user_id, statement, areas[])
    -> habits (id, user_id, identity_id, action, two_min, triggers[])
    -> plans (id, user_id, week_start, days JSON)
    -> completions (id, habit_id, date, status, mood, note)
    -> milestones (id, user_id, type, earned_at)
    -> guilds (id, name, members[])
    -> friendships (user_id, friend_id, status)
```

---

## 5. MONETIZATION STRATEGY

### Free Tier (Forever)
- Full onboarding + AI coach
- 1 weekly plan generation
- Basic progress tracking
- 6 milestones
- Join 1 guild

### Premium ($4.99/month or $39.99/year)
- Unlimited AI replanning
- Advanced analytics + AI insights
- Streak grace days
- Custom themes
- Create guilds
- Priority coach responses
- Share cards
- Calendar sync

### Revenue Projections
- Target: 20,000 paying users in 6 months
- At $4.99/mo = $99,800/month ARR
- Conversion rate target: 8-12% of free users
- Needed free users: ~200,000

---

## 6. KEY METRICS

### North Star: "Weekly Active Completions"
Not DAU. Not downloads. How many habit completions happen per week per user.

### Supporting Metrics
- D1/D7/D30 retention
- Onboarding completion rate (target: >70%)
- Actions per day (target: 2-4)
- Partial completion rate (higher = system working)
- Comeback rate (users returning after 3+ day gap)
- Time to first completion after install
- Weekly plan acceptance rate

---

## 7. COMPETITIVE MOAT

What makes 1% defensible:

1. **Identity-first architecture** — No competitor maps habits to identities. This creates emotional investment that's hard to leave.
2. **Rotating plans** — Eliminates the #1 reason people quit: boredom from the same checklist.
3. **Compassion-first design** — Partial credit, rest days, comeback mode. Users don't feel punished.
4. **AI that learns** — Each replanning cycle uses completion data. The system genuinely improves.
5. **Community around identity** — Guilds organized by identity ("Daily Movers", "Focused Builders") create belonging, not competition.

---

*Document version: 1.0*
*Status: Ready for Codex technical review*
