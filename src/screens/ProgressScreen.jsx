import { memo } from "react";
import { LIFE_AREAS } from "../constants.js";
import { useApp } from "../App.jsx";

export default memo(function ProgressScreen() {
  const { completionHistory, dayNumber, daysWithActivity, totalDaysTracked, consistencyPct, extractedData, weekPlan, weekDay, selectedAreas, earnedMilestones } = useApp();
  const showPct = totalDaysTracked >= 7;
  const areas = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="screen pad">
      <p className="eyebrow">Progress</p>
      <h2 className="ob-h" style={{ fontSize: 26, marginBottom: 14 }}>Progress</h2>

      {extractedData?.identities?.length > 0 && (
        <div className="id-card stagger-1"><span>🪞</span><div><p className="id-lbl">{extractedData.identities.length > 1 ? "Identities" : "Identity"}</p>{extractedData.identities.map((id, i) => <p key={i} className="id-txt">Becoming: <strong>{id.identity}</strong></p>)}</div></div>
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
            {completionHistory.map((d, i) => {
              const pct = d.total > 0 ? d.completed / d.total : 0;
              return (
                <div key={i} className={`cdot${d.completed > 0 || d.partial > 0 ? " cdot-on" : " cdot-off"}`}
                  style={pct > 0 ? { opacity: 0.4 + pct * 0.6 } : {}}
                  title={`Day ${d.day}: ${d.completed}/${d.total}${d.mood ? ` · ${d.mood}` : ""}`} />
              );
            })}
          </div>
        </div>
      )}

      {completionHistory.some(d => d.mood) && (
        <div className="mood-card stagger-5">
          <p className="sec-lbl">Mood timeline</p>
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
    </div>
  );
});
