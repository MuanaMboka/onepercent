import { useState, useEffect, memo } from "react";
import { DAY_FULL, CHECKIN_OPTIONS, CHECKIN_RESPONSES } from "../constants.js";
import { useApp } from "../App.jsx";
import { ProgressRing } from "../components/shared.jsx";

export default memo(function ReflectionScreen() {
  const { checkinDone, setCheckinDone, checkinChoice, setCheckinChoice, showWritePrompt, setShowWritePrompt, checkinNote, setCheckinNote, completedCount, totalActions, todayActions, checked, dayNumber, weekDay, partialCount, setScreen } = useApp();
  const pct = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;
  const perfect = pct === 100;
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    if (!checkinDone) return;
    let frame; let start;
    const duration = 1200;
    function tick(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setAnimPct(Math.round(progress * pct));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [checkinDone, pct]);

  function handleChoice(id) { setCheckinChoice(id); setShowWritePrompt(dayNumber % 3 === 0); setCheckinDone(true); }

  const doneMsg = perfect ? "Perfect day." : pct >= 70 ? "Strong day." : pct >= 40 ? "Solid effort." : "You showed up.";

  if (checkinDone) return (
    <div className="screen pad refl-done-screen">
      {perfect && <div className="confetti-container">{Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 1.5}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
          background: ["#2D9A6F","#D97706","#7C5CBF","#DC4A68","#2563EB","#0D9488"][i % 6],
        }} />
      ))}</div>}
      <div className="refl-ring-wrap fade-in">
        <ProgressRing done={completedCount} total={totalActions} size={120} />
        <div className="refl-pct-over">{animPct}%</div>
      </div>
      <h2 className="done-h slide-up">{doneMsg}</h2>
      <p className="done-day slide-up">Day {dayNumber} · {CHECKIN_RESPONSES[checkinChoice]}</p>
      {partialCount > 0 && <p className="done-partial slide-up">+{partialCount} partial. That counts too.</p>}
      {showWritePrompt && (
        <div className="write-box slide-up">
          <p className="wb-label">Anything on your mind? (optional)</p>
          <textarea className="ob-input" rows={3} placeholder="Just for you." value={checkinNote} onChange={e => setCheckinNote(e.target.value)} />
        </div>
      )}
      <button className="btn-secondary slide-up" style={{ marginTop: 20 }} onClick={() => setScreen("today")}>Back to today</button>
      <p className="done-foot slide-up">See you tomorrow.</p>
    </div>
  );

  return (
    <div className="screen pad">
      <p className="eyebrow">Check-in · {DAY_FULL[weekDay]}</p>
      <h2 className="ob-h" style={{ fontSize: 24 }}>How was today?</h2>
      <div className="checkin-grid">
        {CHECKIN_OPTIONS.map(opt => (
          <button key={opt.id} className="checkin-btn" onClick={() => handleChoice(opt.id)}>
            <span className="ci-icon">{opt.icon}</span><span className="ci-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});
