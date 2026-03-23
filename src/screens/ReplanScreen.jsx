import { useState, memo } from "react";
import { DAYS, DAY_FULL, LIFE_AREAS } from "../constants.js";
import { useApp } from "../App.jsx";

export default memo(function ReplanScreen() {
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
});
