import { useState, memo } from "react";
import { DAYS, DAY_FULL, LIFE_AREAS } from "../constants.js";
import { useApp } from "../App.jsx";

export default memo(function EditScheduleScreen() {
  const { weekPlan, setWeekPlan, removeActionFromPlan, addActionToPlan, userHabits, removedActions, setScreen } = useApp();
  const [showAddModal, setShowAddModal] = useState(null); // { day, slot }

  if (!weekPlan) return null;

  const timeSlots = ["morning", "midday", "afternoon", "evening"];
  const slotLabels = { morning: "☀️ Morning", midday: "🌤️ Midday", afternoon: "🌅 Afternoon", evening: "🌙 Evening" };

  // Collect all unique actions from the plan, user habits, and previously removed actions
  const allActions = [];
  const seen = new Set();
  DAYS.forEach(d => {
    (weekPlan.days[d.toLowerCase()] || []).forEach(a => {
      const key = a.action + a.area;
      if (!seen.has(key)) { seen.add(key); allActions.push(a); }
    });
  });
  (userHabits || []).forEach(h => {
    const key = h.action + h.area;
    if (!seen.has(key)) { seen.add(key); allActions.push(h); }
  });
  (removedActions || []).forEach(a => {
    const key = a.action + a.area;
    if (!seen.has(key)) { seen.add(key); allActions.push(a); }
  });

  return (
    <div className="screen pad fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 className="ob-h" style={{ fontSize: 22, margin: 0 }}>Edit Schedule</h2>
        <button className="ghost-btn" onClick={() => setScreen("today")}>Done</button>
      </div>
      <p className="ob-p">Tap x to remove, + to add actions to any time slot.</p>

      {DAYS.map((d, di) => {
        const dayKey = d.toLowerCase();
        const actions = weekPlan.days[dayKey] || [];
        return (
          <div key={d} className="es-day">
            <p className="es-day-label">{DAY_FULL[di]}</p>
            {timeSlots.map(slot => {
              const slotActions = actions.map((a, i) => ({ ...a, origIdx: i })).filter(a => a.timeSlot === slot);
              return (
                <div key={slot} className="es-slot">
                  <span className="es-slot-label">{slotLabels[slot]}</span>
                  <div className="es-slot-actions">
                    {slotActions.map(a => {
                      const area = LIFE_AREAS.find(la => la.id === a.area);
                      return (
                        <div key={a.origIdx} className="es-action">
                          <span className="es-action-dot" style={{ background: area?.color || "#999" }} />
                          <span className="es-action-name">{a.action}</span>
                          <button className="es-remove" onClick={() => removeActionFromPlan(dayKey, a.origIdx)}>x</button>
                        </div>
                      );
                    })}
                    <button className="es-add-btn" onClick={() => setShowAddModal({ day: dayKey, slot })}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {showAddModal && (
        <div className="es-modal-bg" onClick={() => setShowAddModal(null)}>
          <div className="es-modal" onClick={e => e.stopPropagation()}>
            <h3 className="es-modal-title">Add to {DAY_FULL[DAYS.findIndex(d => d.toLowerCase() === showAddModal.day)]} — {slotLabels[showAddModal.slot]}</h3>
            {allActions.length === 0 && <p style={{ color: "#999", fontSize: 13 }}>No actions available.</p>}
            {allActions.map((a, i) => {
              const area = LIFE_AREAS.find(la => la.id === a.area);
              return (
                <button key={i} className="es-modal-item" onClick={() => { addActionToPlan(showAddModal.day, a, showAddModal.slot); setShowAddModal(null); }}>
                  <span className="es-action-dot" style={{ background: area?.color || "#999" }} />
                  {a.action}
                </button>
              );
            })}
            <button className="ghost-btn" style={{ marginTop: 8 }} onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
});
