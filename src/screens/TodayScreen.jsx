import { memo, useState, useCallback, useMemo } from "react";
import { DAYS, DAY_FULL, LIFE_AREAS, CHECKIN_RESPONSES } from "../constants.js";
import { useApp } from "../App.jsx";
import { ProgressRing } from "../components/shared.jsx";
import { getDailyGreeting, getCompletionMessage, getAllDoneCelebration, getPartialNudge } from "../utils/variableRewards.js";

export default memo(function TodayScreen() {
  const {
    dayNumber, weekDay, todayActions, tomorrowActions,
    checked, partialChecked, toggleComplete, togglePartial,
    expandedAction, setExpandedAction,
    completedCount, partialCount, totalActions, setScreen,
    isReturning, setIsReturning, comebackMode, setComebackMode,
    simulateDay, weekPlan, startReplanning, milestone, dismissMilestone,
    extractedData, consistencyPct, daysWithActivity, totalDaysTracked,
    currentStreak,
  } = useApp();
  const allDone = completedCount === totalActions && totalActions > 0;
  const pct = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;
  const [showWeek, setShowWeek] = useState(false);
  const [justCompleted, setJustCompleted] = useState(null);

  const greeting = useMemo(() => getDailyGreeting(dayNumber, currentStreak), [dayNumber, currentStreak]);
  const allDoneCelebration = useMemo(() => getAllDoneCelebration(dayNumber), [dayNumber]);
  const partialNudge = useMemo(() => getPartialNudge(dayNumber), [dayNumber]);

  const handleComplete = useCallback((i) => {
    toggleComplete(i);
    const action = todayActions[i];
    if (action && !checked[i]) {
      const isLast = completedCount + 1 === totalActions;
      const msg = getCompletionMessage(dayNumber, i, action.identity, isLast);
      setJustCompleted({ idx: i, message: msg });
      setTimeout(() => setJustCompleted(null), 2200);
    }
  }, [toggleComplete, todayActions, checked, completedCount, totalActions, dayNumber]);

  const consistencyLabel = totalDaysTracked < 7
    ? `${daysWithActivity}/${totalDaysTracked || dayNumber} days active`
    : `${consistencyPct}% consistency`;

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
            <p className="cb-s">Yesterday was neutral. Today counts normally.</p>
            <p className="cb-hint">Start with just the 2-min versions if you need to.</p>
            <button className="cb-keep" onClick={() => setComebackMode(false)}>Let's go</button>
          </div>
        </div>
      )}

      {isReturning && !comebackMode && (
        <div className="return-banner fade-in">
          <span>👋</span>
          <div>
            <p className="ret-t">Welcome back.</p>
            <p className="ret-s">Pick up where you left off. No penalty.</p>
          </div>
          <button className="ret-x" onClick={() => setIsReturning(false)}>×</button>
        </div>
      )}

      <div className="today-top">
        <div className="today-eyebrow-row">
          <p className="eyebrow">{DAY_FULL[weekDay]} · Day {dayNumber}</p>
          <p className="daily-greeting">{greeting}</p>
        </div>
        <div className="today-header-row">
          <div className="today-header-left">
            <ProgressRing done={completedCount} total={totalActions} size={48} />
            <div className="today-header-stats">
              <span className="today-done-count">{completedCount}<span className="today-done-total">/{totalActions}</span></span>
              {partialCount > 0 && <span className="today-partial-tag">+{partialCount} partial</span>}
            </div>
          </div>
          <div className="today-consistency-pill">
            <span className="tcp-value">{consistencyLabel}</span>
          </div>
        </div>
      </div>

      {justCompleted && (
        <div className="identity-toast fade-in" key={justCompleted.idx}>
          <span className="it-check">✓</span>
          <span className="it-text">{justCompleted.message}</span>
        </div>
      )}

      <div className="action-list">
        {todayActions.map((a, i) => (
          <ActionCard key={i} idx={i} action={a}
            done={!!checked[i]} partial={!!partialChecked[i]}
            expanded={expandedAction === i}
            onExpand={() => setExpandedAction(expandedAction === i ? null : i)}
            onComplete={() => handleComplete(i)}
            onPartial={() => togglePartial(i)} />
        ))}
      </div>

      {allDone && (
        <div className="all-done fade-in">
          <span style={{ fontSize: 34 }}>{allDoneCelebration.icon}</span>
          <p className="done-msg">{allDoneCelebration.message}</p>
          <button className="btn-secondary" onClick={() => setScreen("reflection")}>Evening check-in</button>
        </div>
      )}

      {!allDone && (completedCount > 0 || partialCount > 0) && (
        <div className="checkin-nudge fade-in">
          <p className="nudge-text">{partialNudge}</p>
          <button className="btn-secondary" onClick={() => setScreen("reflection")}>Evening check-in</button>
        </div>
      )}

      <button className="week-toggle" onClick={() => setShowWeek(v => !v)}>
        {showWeek ? "Hide week" : "See this week"} <span className="wt-arrow">{showWeek ? "▲" : "▼"}</span>
      </button>
      {showWeek && <WeekCalendar />}

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
    </div>
  );
});

function ActionCard({ idx, action, done, partial, expanded, onExpand, onComplete, onPartial }) {
  const { updateTrigger, todayKey, setActionRecurrence } = useApp();
  const a = action;
  const area = LIFE_AREAS.find(la => la.id === a.area);
  const cls = done ? " ac-done" : partial ? " ac-partial" : "";
  const trigger = a.selectedTrigger || a.trigger || (a.suggestedTriggers?.[0]) || "";
  const timeLabel = a.timeSlot === "morning" ? "☀️ Morning" : a.timeSlot === "midday" ? "🌤️ Midday" : a.timeSlot === "afternoon" ? "🌅 Afternoon" : a.timeSlot === "evening" ? "🌙 Evening" : "";
  const freqLabels = { daily: "Every day", weekdays: "Weekdays", "3x": "3x/week", "2x": "2x/week", "1x": "1x/week" };

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
                  <button key={ti}
                    className={`ad-trig-btn${(a.selectedTrigger || a.suggestedTriggers[0]) === t ? " ad-trig-on" : ""}`}
                    onClick={() => updateTrigger(todayKey, idx, t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!a.suggestedTriggers && trigger && <div className="ad-row"><span className="ad-l">Trigger</span><span className="ad-v">{trigger}</span></div>}
          <div className="ad-triggers">
            <span className="ad-l">Frequency</span>
            <div className="ad-trigger-opts">
              {Object.entries(freqLabels).map(([k, v]) => (
                <button key={k}
                  className={`ad-trig-btn${(a.frequency || "1x") === k ? " ad-trig-on" : ""}`}
                  onClick={() => setActionRecurrence(todayKey, idx, k)}>
                  {v}
                </button>
              ))}
            </div>
          </div>
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
