import { memo, useMemo, useState, useEffect } from "react";
import { LIFE_AREAS } from "../constants.js";
import { useApp } from "../App.jsx";
import { ProgressRing } from "../components/shared.jsx";

export default memo(function ProgressScreen() {
  const {
    completionHistory, dayNumber, daysWithActivity, totalDaysTracked,
    consistencyPct, extractedData, weekPlan, weekDay, selectedAreas,
    earnedMilestones, currentStreak, bestStreak,
  } = useApp();

  const showPct = totalDaysTracked >= 7;
  const [animVal, setAnimVal] = useState(0);

  // Animate hero number on mount
  useEffect(() => {
    const target = showPct ? consistencyPct : daysWithActivity;
    let frame, start;
    const duration = 800;
    function tick(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setAnimVal(Math.round(p * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [showPct, consistencyPct, daysWithActivity]);

  // Per-area completion rates
  const areaStats = useMemo(() => {
    if (!weekPlan?.days || completionHistory.length === 0) return [];
    const areaCounts = {};
    selectedAreas.forEach(id => { areaCounts[id] = { total: 0, done: 0 }; });

    // Count from weekly plan how many actions per area exist
    for (const dayActions of Object.values(weekPlan.days)) {
      for (const a of (dayActions || [])) {
        if (areaCounts[a.area]) areaCounts[a.area].total++;
      }
    }

    return selectedAreas.map(id => {
      const area = LIFE_AREAS.find(a => a.id === id);
      const stats = areaCounts[id] || { total: 0, done: 0 };
      // Estimate area engagement from total actions ratio
      const actionsPerWeek = stats.total;
      return { area, actionsPerWeek };
    }).filter(s => s.area);
  }, [weekPlan, selectedAreas, completionHistory]);

  // Weekly trend: completion rates for last 4 weeks
  const weeklyTrend = useMemo(() => {
    if (completionHistory.length === 0) return [];
    const weeks = [];
    for (let i = completionHistory.length; i > 0; i -= 7) {
      const start = Math.max(0, i - 7);
      const chunk = completionHistory.slice(start, i);
      const totalPossible = chunk.reduce((s, d) => s + d.total, 0);
      const totalDone = chunk.reduce((s, d) => s + d.completed + d.partial * 0.5, 0);
      const pct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
      const activeDays = chunk.filter(d => d.completed > 0 || d.partial > 0).length;
      weeks.unshift({ pct, activeDays, totalDays: chunk.length });
    }
    return weeks.slice(-4);
  }, [completionHistory]);

  // Smart insight
  const insight = useMemo(() => {
    if (completionHistory.length < 3) return null;
    const recent = completionHistory.slice(-7);
    const totalPossible = recent.reduce((s, d) => s + d.total, 0);
    const totalDone = recent.reduce((s, d) => s + d.completed, 0);
    const recentRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    if (weeklyTrend.length >= 2) {
      const prev = weeklyTrend[weeklyTrend.length - 2]?.pct || 0;
      const curr = weeklyTrend[weeklyTrend.length - 1]?.pct || 0;
      if (curr > prev + 10) return { icon: "📈", text: `Up ${curr - prev}% from last week. The momentum is real.` };
      if (curr < prev - 15) return { icon: "🫂", text: "Tougher week. That's data, not failure. Adjust and continue." };
    }

    if (currentStreak >= 7) return { icon: "🔥", text: `${currentStreak}-day streak. Your consistency is becoming automatic.` };
    if (currentStreak >= 3) return { icon: "⚡", text: `${currentStreak} days running. The pattern is forming.` };
    if (recentRate >= 80) return { icon: "💪", text: "Strong week. You're proving who you're becoming." };
    if (recentRate >= 50) return { icon: "🌱", text: "Steady progress. Half the battle is showing up." };
    return { icon: "🫂", text: "Every action, even partial, is building the person you want to be." };
  }, [completionHistory, weeklyTrend, currentStreak]);

  const maxWeekPct = Math.max(...weeklyTrend.map(w => w.pct), 1);

  return (
    <div className="screen pad prog-screen">
      <p className="eyebrow">Your journey</p>

      {/* Hero section */}
      <div className="prog-hero fade-in">
        <div className="prog-ring-wrap">
          <ProgressRing done={showPct ? consistencyPct : daysWithActivity} total={showPct ? 100 : (totalDaysTracked || dayNumber)} size={130} />
          <div className="prog-ring-inner">
            <span className="prog-hero-num">{animVal}{showPct ? "%" : ""}</span>
            <span className="prog-hero-lbl">{showPct ? "consistency" : `day${daysWithActivity !== 1 ? "s" : ""} active`}</span>
          </div>
        </div>
        <div className="prog-hero-stats">
          <div className="prog-stat">
            <span className="prog-stat-val">{dayNumber}</span>
            <span className="prog-stat-lbl">Day</span>
          </div>
          <div className="prog-stat-divider" />
          <div className="prog-stat">
            <span className="prog-stat-val">{currentStreak}</span>
            <span className="prog-stat-lbl">Streak</span>
          </div>
          <div className="prog-stat-divider" />
          <div className="prog-stat">
            <span className="prog-stat-val">{bestStreak}</span>
            <span className="prog-stat-lbl">Best</span>
          </div>
        </div>
      </div>

      {/* Smart insight */}
      {insight && (
        <div className="prog-insight stagger-1">
          <span className="pi-icon">{insight.icon}</span>
          <span className="pi-text">{insight.text}</span>
        </div>
      )}

      {/* Weekly trend */}
      {weeklyTrend.length > 1 && (
        <div className="prog-card stagger-2">
          <p className="sec-lbl">Weekly trend</p>
          <div className="prog-bars">
            {weeklyTrend.map((w, i) => (
              <div key={i} className="prog-bar-col">
                <div className="prog-bar-track">
                  <div className="prog-bar-fill" style={{
                    height: `${Math.max(4, (w.pct / maxWeekPct) * 100)}%`,
                    opacity: i === weeklyTrend.length - 1 ? 1 : 0.5,
                  }} />
                </div>
                <span className="prog-bar-val">{w.pct}%</span>
                <span className="prog-bar-lbl">{i === weeklyTrend.length - 1 ? "This" : `W${i + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Identity cards */}
      {extractedData?.identities?.length > 0 && (
        <div className="prog-card stagger-2">
          <p className="sec-lbl">Becoming</p>
          <div className="prog-identities">
            {extractedData.identities.map((id, i) => {
              const area = LIFE_AREAS.find(a => id.areas?.includes(a.id));
              return (
                <div key={i} className="prog-id-chip" style={{ borderColor: area?.color || "#999" }}>
                  <span className="prog-id-icon">{area?.icon || "🪞"}</span>
                  <span className="prog-id-txt">{id.identity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-area breakdown */}
      {areaStats.length > 0 && (
        <div className="prog-card stagger-3">
          <p className="sec-lbl">Life areas</p>
          <div className="prog-areas">
            {areaStats.map(({ area, actionsPerWeek }) => (
              <div key={area.id} className="prog-area-row">
                <span className="prog-area-icon" style={{ background: area.color + "18", color: area.color }}>{area.icon}</span>
                <span className="prog-area-name">{area.label}</span>
                <span className="prog-area-freq">{actionsPerWeek}x/wk</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity heatmap */}
      {totalDaysTracked > 0 && (
        <div className="prog-card stagger-3">
          <p className="sec-lbl">Activity</p>
          <div className="prog-heatmap">
            {completionHistory.map((d, i) => {
              const pct = d.total > 0 ? d.completed / d.total : 0;
              const partialPct = d.total > 0 ? d.partial / d.total : 0;
              const level = pct >= 0.8 ? 4 : pct >= 0.5 ? 3 : (pct > 0 || partialPct > 0) ? 2 : d.total > 0 ? 1 : 0;
              return (
                <div key={i} className={`prog-heat-cell prog-heat-${level}`}
                  title={`Day ${d.day}: ${d.completed}/${d.total}${d.partial > 0 ? ` +${d.partial} partial` : ""}${d.mood ? ` · ${d.mood}` : ""}`} />
              );
            })}
          </div>
          <div className="prog-heat-legend">
            <span className="phl-text">Less</span>
            <div className="prog-heat-cell prog-heat-1" />
            <div className="prog-heat-cell prog-heat-2" />
            <div className="prog-heat-cell prog-heat-3" />
            <div className="prog-heat-cell prog-heat-4" />
            <span className="phl-text">More</span>
          </div>
        </div>
      )}

      {/* Milestones */}
      {earnedMilestones.length > 0 && (
        <div className="prog-card stagger-4">
          <p className="sec-lbl">Milestones</p>
          <div className="prog-milestones">
            {earnedMilestones.map((m, i) => (
              <div key={m.day} className="prog-ms-item">
                <div className="prog-ms-line-wrap">
                  <div className={`prog-ms-dot${i === earnedMilestones.length - 1 ? " prog-ms-dot-latest" : ""}`}>
                    <span>{m.icon}</span>
                  </div>
                  {i < earnedMilestones.length - 1 && <div className="prog-ms-line" />}
                </div>
                <div className="prog-ms-content">
                  <span className="prog-ms-title">{m.title}</span>
                  <span className="prog-ms-msg">{m.msg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood timeline */}
      {completionHistory.some(d => d.mood) && (
        <div className="prog-card stagger-4">
          <p className="sec-lbl">How it felt</p>
          <div className="mood-timeline">
            {completionHistory.slice(-14).map((d, i) => {
              const moodIcon = d.mood === "easy" ? "🌊" : d.mood === "hard" ? "🏔️" : d.mood === "partial" ? "🌤️" : d.mood === "rest" ? "🛋️" : "·";
              return (
                <div key={i} className="mood-entry">
                  <span className="mood-icon">{moodIcon}</span>
                  <span className="mood-day">D{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="mood-legend">
            <span>🌊 Easy</span><span>🏔️ Hard</span><span>🌤️ Partial</span><span>🛋️ Rest</span>
          </div>
        </div>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
});
