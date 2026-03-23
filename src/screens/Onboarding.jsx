import { useState, useRef, useEffect } from "react";
import { LIFE_AREAS, STRUGGLES, STRUGGLE_SOLUTIONS, DAYS, DAY_FULL } from "../constants.js";
import { useApp } from "../App.jsx";
import { ObProgress, Dots } from "../components/shared.jsx";

export default function Onboarding() {
  const { obPhase } = useApp();
  return (
    <div className="screen">
      {obPhase === "areas" && <OB_Areas />}
      {obPhase === "preview" && <OB_Preview />}
      {obPhase === "chat" && <OB_Chat />}
      {obPhase === "struggles" && <OB_Struggles />}
      {obPhase === "habits" && <OB_Habits />}
      {obPhase === "calendar" && <OB_Calendar />}
      {obPhase === "ready" && <OB_Ready />}
    </div>
  );
}

function OB_Areas() {
  const { selectedAreas, toggleArea, showPreview } = useApp();
  return (
    <div className="ob-screen fade-in">
      <ObProgress step={1} total={6} />
      <h2 className="ob-h">What matters to you?</h2>
      <p className="ob-p">Pick up to 3 for best results. More areas won't mean more daily tasks.</p>

      <div className="area-grid">
        {LIFE_AREAS.map(a => {
          const on = selectedAreas.includes(a.id);
          return (
            <button key={a.id}
              className={`area-btn${on ? " area-on" : ""}`}
              style={on ? { borderColor: a.color, background: a.color + "12" } : {}}
              onClick={() => toggleArea(a.id)}>
              <span className="area-icon">{a.icon}</span>
              <span className="area-label">{a.label}</span>
              {on && <span className="area-check" style={{ color: a.color }}>✓</span>}
            </button>
          );
        })}
      </div>

      {selectedAreas.length > 0 && (
        <p className="area-count fade-in">{selectedAreas.length} area{selectedAreas.length !== 1 ? "s" : ""} selected</p>
      )}

      <button className={`btn-primary mt16${selectedAreas.length === 0 ? " btn-off" : ""}`}
        onClick={showPreview} disabled={selectedAreas.length === 0}>
        Continue
      </button>
    </div>
  );
}

const PREVIEW_HABITS = {
  health:    [{ action: "Do 20 bodyweight squats", identity: "I am a daily mover", twoMin: "Do 3 squats" }],
  career:    [{ action: "Work on top priority for 25 min", identity: "I am someone who ships", twoMin: "Open the doc and write one line" }],
  spiritual: [{ action: "5 minutes of quiet reflection", identity: "I am a reflective person", twoMin: "Sit and take 3 deep breaths" }],
  relations: [{ action: "Send a thoughtful message to someone", identity: "I am someone who shows up", twoMin: "Open messages and pick one person" }],
  growth:    [{ action: "Read 10 pages of a book", identity: "I am a lifelong learner", twoMin: "Open book to your bookmark" }],
  fun:       [{ action: "Spend 15 minutes on a creative project", identity: "I am a creative person", twoMin: "Open your project and look at it" }],
};

function OB_Preview() {
  const { selectedAreas, startChat, skipChat } = useApp();
  const previewItems = selectedAreas.map(aId => {
    const area = LIFE_AREAS.find(a => a.id === aId);
    const habit = PREVIEW_HABITS[aId]?.[0];
    return { area, habit };
  }).filter(p => p.area && p.habit);

  return (
    <div className="ob-screen fade-in">
      <ObProgress step={2} total={6} />
      <p className="ob-eye">Your first day could look like</p>
      <h2 className="ob-h">Here's a start.</h2>

      <div className="preview-habits stagger-1">
        {previewItems.map(({ area, habit }) => (
          <div key={area.id} className="preview-habit-card">
            <div className="ph-left">
              <div className="ph-circle" style={{ borderColor: area.color }}>
                <span>{area.icon}</span>
              </div>
            </div>
            <div className="ph-right">
              <span className="ph-area" style={{ color: area.color }}>{area.label}</span>
              <span className="ph-action">{habit.action}</span>
              <span className="ph-identity">{habit.identity}</span>
              <span className="ph-fallback">Hard day: {habit.twoMin}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="preview-note stagger-2">We keep it small so you actually sustain it.</p>

      <button className="btn-primary mt16 stagger-3" onClick={skipChat}>
        This works, next
      </button>
      <button className="ghost-btn stagger-4" onClick={startChat}>
        Personalize with AI coach
      </button>
    </div>
  );
}

function OB_Chat() {
  const { chatMessages, chatInput, setChatInput, chatLoading, sendChat, coachReady, finishChat, extracting, selectedAreas } = useApp();
  const bottomRef = useRef(null);
  const userMsgCount = chatMessages.filter(m => m.role === "user").length;
  const minQuestions = Math.max(3, selectedAreas.length);
  const canSkip = userMsgCount >= minQuestions && !coachReady;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, chatLoading]);

  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }

  return (
    <div className="ob-screen chat-screen">
      <ObProgress step={2} total={6} />
      <div className="chat-header">
        <div className="coach-avatar">1%</div>
        <div><p className="coach-name">Your habit coach</p><p className="coach-sub">Getting to know you</p></div>
      </div>

      <div className="chat-body">
        {chatMessages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === "user" ? "cb-user" : "cb-coach"} fade-in`}>
            <p>{m.content}</p>
          </div>
        ))}
        {chatLoading && (
          <div className="chat-bubble cb-coach fade-in">
            <p className="typing">●●●</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {(coachReady || canSkip) && !extracting && (
        <div className="chat-ready fade-in">
          <p>{coachReady ? "I have what I need." : "Shared enough?"}</p>
          <button className="btn-primary" onClick={finishChat}>Build my system</button>
          {canSkip && !coachReady && <p className="chat-ready-hint">Or keep chatting for a more personalized plan.</p>}
        </div>
      )}

      {extracting && (
        <div className="chat-ready fade-in">
          <p><Dots label="Understanding your goals" /></p>
        </div>
      )}

      {!coachReady && !canSkip && !extracting && (
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1} placeholder="Type here..."
            value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={handleKey} disabled={chatLoading} />
          <button className={`chat-send${!chatInput.trim() || chatLoading ? " send-off" : ""}`}
            onClick={sendChat} disabled={!chatInput.trim() || chatLoading}>↑</button>
        </div>
      )}

      {coachReady && !extracting && (
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1} placeholder="Add more detail or tap Build..."
            value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={handleKey} disabled={chatLoading} />
          <button className={`chat-send${!chatInput.trim() || chatLoading ? " send-off" : ""}`}
            onClick={sendChat} disabled={!chatInput.trim() || chatLoading}>↑</button>
        </div>
      )}

      {canSkip && !coachReady && !extracting && (
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1} placeholder="Type here..."
            value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={handleKey} disabled={chatLoading} />
          <button className={`chat-send${!chatInput.trim() || chatLoading ? " send-off" : ""}`}
            onClick={sendChat} disabled={!chatInput.trim() || chatLoading}>↑</button>
        </div>
      )}
    </div>
  );
}

function OB_Struggles() {
  const { struggles, toggleStruggle, generateHabitSuggestions, extractedData } = useApp();
  return (
    <div className="ob-screen fade-in">
      <ObProgress step={3} total={6} />
      <h2 className="ob-h">What gets in the way?</h2>
      <p className="ob-p">Tap what feels familiar.</p>

      {extractedData?.key_insight && (
        <div className="insight-card stagger-1">
          <span>🔑</span>
          <div>
            <p className="ic-label">What the AI noticed</p>
            <p className="ic-text">{extractedData.key_insight}</p>
          </div>
        </div>
      )}

      <div className="struggle-grid stagger-2">
        {STRUGGLES.map(s => {
          const on = struggles.includes(s.id);
          return (
            <button key={s.id} className={`struggle-btn${on ? " struggle-on" : ""}`} onClick={() => toggleStruggle(s.id)}>
              <span className="str-icon">{s.icon}</span>
              <div className="str-text">
                <span className="str-label">{s.label}</span>
                <span className="str-desc">{s.desc}</span>
              </div>
              {on && <span className="str-check">✓</span>}
            </button>
          );
        })}
      </div>

      {struggles.length > 0 && (
        <div className="struggle-solutions fade-in">
          <p className="ss-header">How your plan adapts</p>
          {struggles.map(id => {
            const sol = STRUGGLE_SOLUTIONS[id];
            return sol ? (
              <div key={id} className="ss-item">
                <span className="ss-icon">{sol.icon}</span>
                <p className="ss-text">{sol.solution}</p>
              </div>
            ) : null;
          })}
        </div>
      )}

      <button className="btn-primary mt16" onClick={generateHabitSuggestions}>
        {struggles.length > 0 ? "Next" : "Skip"}
      </button>
    </div>
  );
}

function OB_Habits() {
  const { suggestedHabits, toggleHabitSelection, addCustomHabit, removeHabit,
    newHabitText, setNewHabitText, newHabitArea, setNewHabitArea,
    loadingHabits, buildSchedule, selectedAreas, extractedData } = useApp();

  const selectedCount = suggestedHabits.filter(h => h.selected).length;

  if (loadingHabits) return (
    <div className="ob-screen fade-in" style={{ justifyContent: "center", alignItems: "center", background: "#151515" }}>
      <div className="gen-anim">
        <div className="gen-orbit">
          <div className="gen-core" />
          <div className="gen-ring-1" />
          <div className="gen-ring-2" />
          <div className="gen-ring-3" />
        </div>
        <h3 className="gen-title" style={{ color: "#FAFAF8" }}>Finding your habits</h3>
        <div className="gen-steps">
          <p className="gen-step gs-1">Reading your goals</p>
          <p className="gen-step gs-2">Finding what fits</p>
          <p className="gen-step gs-3">Building your options</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ob-screen fade-in">
      <ObProgress step={4} total={6} />
      <h2 className="ob-h">Your habits.</h2>
      <p className="ob-p">Select, remove, or add your own.</p>

      <div className="habit-list">
        {suggestedHabits.map(h => {
          const area = LIFE_AREAS.find(a => a.id === h.area);
          return (
            <div key={h.id} className={`habit-card${h.selected ? " habit-sel" : ""}`}>
              <button className="habit-toggle" onClick={() => toggleHabitSelection(h.id)}>
                {h.selected ? <span className="ht-on">✓</span> : <span className="ht-off" />}
              </button>
              <div className="habit-info" onClick={() => toggleHabitSelection(h.id)}>
                <span className="habit-area-tag" style={{ color: area?.color }}>{area?.icon} {area?.label}</span>
                <span className="habit-action">{h.action}</span>
                {h.twoMin && <span className="habit-twomin">Hard day: {h.twoMin}</span>}
              </div>
              <button className="habit-remove" onClick={() => removeHabit(h.id)}>×</button>
            </div>
          );
        })}
      </div>

      <div className="add-habit-box">
        <p className="ah-label">Add your own habit</p>
        <input className="ob-input" placeholder="e.g. Walk for 20 minutes"
          value={newHabitText} onChange={e => setNewHabitText(e.target.value)} />
        <div className="ah-areas">
          {selectedAreas.map(aId => {
            const a = LIFE_AREAS.find(la => la.id === aId);
            return (
              <button key={aId} className={`ah-area-btn${newHabitArea === aId ? " ah-area-on" : ""}`}
                style={newHabitArea === aId ? { background: a?.color + "18", borderColor: a?.color, color: a?.color } : {}}
                onClick={() => setNewHabitArea(aId)}>
                {a?.icon} {a?.label}
              </button>
            );
          })}
        </div>
        <button className={`btn-secondary${!newHabitText.trim() || !newHabitArea ? " btn-off" : ""}`}
          onClick={addCustomHabit} disabled={!newHabitText.trim() || !newHabitArea}>
          Add habit
        </button>
      </div>

      <div className="habit-footer">
        <p className="hf-count">{selectedCount} habit{selectedCount !== 1 ? "s" : ""} selected</p>
        <button className={`btn-primary${selectedCount === 0 ? " btn-off" : ""}`}
          onClick={buildSchedule} disabled={selectedCount === 0}>
          Next
        </button>
      </div>
    </div>
  );
}

function OB_Calendar() {
  const { weekSchedule, loadingSchedule, confirmSchedule, removeFromSchedule, userHabits, addToSchedule } = useApp();
  const [showAddModal, setShowAddModal] = useState(null);
  const timeSlots = ["morning", "midday", "afternoon", "evening"];
  const slotLabels = { morning: "☀️ Morning", midday: "🌤️ Midday", afternoon: "🌅 Afternoon", evening: "🌙 Evening" };

  if (loadingSchedule) return (
    <div className="ob-screen fade-in" style={{ justifyContent: "center", alignItems: "center", background: "#151515" }}>
      <div className="gen-anim">
        <div className="gen-orbit">
          <div className="gen-core" />
          <div className="gen-ring-1" />
          <div className="gen-ring-2" />
          <div className="gen-ring-3" />
        </div>
        <h3 className="gen-title" style={{ color: "#FAFAF8" }}>Laying out the week</h3>
        <div className="gen-steps">
          <p className="gen-step gs-1">Spreading habits across days</p>
          <p className="gen-step gs-2">Matching time of day</p>
          <p className="gen-step gs-3">Balancing the week</p>
        </div>
      </div>
    </div>
  );

  const totalActions = weekSchedule ? Object.values(weekSchedule).flat().length : 0;

  return (
    <div className="ob-screen fade-in">
      <ObProgress step={5} total={6} />
      <h2 className="ob-h">Your week.</h2>
      <p className="ob-p">Rearrange however you want.</p>

      {showAddModal && (
        <div className="add-modal-bg" onClick={() => setShowAddModal(null)}>
          <div className="add-modal" onClick={e => e.stopPropagation()}>
            <p className="am-title">Add to {DAY_FULL[DAYS.indexOf(showAddModal.day.charAt(0).toUpperCase() + showAddModal.day.slice(1))] || showAddModal.day} · {slotLabels[showAddModal.slot]}</p>
            {userHabits.map(h => {
              const area = LIFE_AREAS.find(a => a.id === h.area);
              return (
                <button key={h.id} className="am-habit" onClick={() => {
                  addToSchedule(showAddModal.day, h, showAddModal.slot);
                  setShowAddModal(null);
                }}>
                  <span style={{ color: area?.color }}>{area?.icon}</span> {h.action}
                </button>
              );
            })}
            <button className="ghost-btn" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="ical">
        {DAYS.map((d, di) => {
          const dayKey = d.toLowerCase();
          const dayActions = weekSchedule?.[dayKey] || [];
          return (
            <div key={d} className="ical-day">
              <div className="ical-day-header">
                <span className="ical-d-name">{DAY_FULL[di]}</span>
                <span className="ical-d-count">{dayActions.length} action{dayActions.length !== 1 ? "s" : ""}</span>
              </div>
              {timeSlots.map(slot => {
                const slotActions = dayActions.filter(a => a.timeSlot === slot);
                return (
                  <div key={slot} className="ical-slot">
                    <span className="ical-slot-label">{slotLabels[slot]}</span>
                    <div className="ical-slot-actions">
                      {slotActions.map((a, ai) => {
                        const area = LIFE_AREAS.find(la => la.id === a.area);
                        const realIdx = dayActions.indexOf(a);
                        return (
                          <div key={ai} className="ical-action" style={{ borderLeftColor: area?.color || "#999" }}>
                            <span className="ical-a-text">{a.action}</span>
                            <button className="ical-a-remove" onClick={() => removeFromSchedule(dayKey, realIdx)}>×</button>
                          </div>
                        );
                      })}
                      <button className="ical-add-btn" onClick={() => setShowAddModal({ day: dayKey, slot })}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="ical-footer">
        <p className="ical-total">{totalActions} actions across the week</p>
        <button className={`btn-primary${totalActions === 0 ? " btn-off" : ""}`}
          onClick={confirmSchedule} disabled={totalActions === 0}>
          Confirm
        </button>
      </div>
    </div>
  );
}

function OB_Ready() {
  const { weekPlan, extractedData, enterApp, selectedAreas } = useApp();
  const areas = selectedAreas.map(id => LIFE_AREAS.find(a => a.id === id)).filter(Boolean);
  return (
    <div className="ob-screen fade-in">
      <div className="ready-top">
        <div className="ready-ring pulse-ring"><span className="ready-check">✓</span></div>
        <h2 className="ready-h">Ready.</h2>
        <p className="ready-sub">{areas.length} areas. One plan. Let's go.</p>
      </div>
      <div className="ready-areas">
        {areas.map(a => (
          <span key={a.id} className="ra-pill" style={{ background: a.color + "18", color: a.color, borderColor: a.color + "40" }}>
            {a.icon} {a.label}
          </span>
        ))}
      </div>
      {extractedData?.identities?.[0]?.identity && <p className="id-line" style={{ textAlign: "center", marginBottom: 12 }}>🪞 Becoming: <strong>{extractedData.identities[0].identity}</strong></p>}
      <div className="ready-plan-name">
        <p className="rpn">{weekPlan?.name}</p>
        <p className="rpp">{weekPlan?.philosophy}</p>
      </div>
      <button className="btn-glow mt12" onClick={enterApp}>Start</button>
    </div>
  );
}
