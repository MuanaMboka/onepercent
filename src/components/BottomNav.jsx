import { memo } from "react";
import { useApp } from "../App.jsx";

export default memo(function BottomNav() {
  const { screen, setScreen } = useApp();
  const tabs = [
    { id: "today", icon: "◎", label: "Today" },
    { id: "edit-schedule", icon: "📅", label: "Schedule" },
    { id: "reflection", icon: "◐", label: "Check-in" },
    { id: "progress", icon: "↗", label: "Progress" },
  ];
  return (
    <nav className="bnav">
      {tabs.map(t => (
        <button key={t.id} className={`nbtn${screen === t.id ? " nbtn-on" : ""}`} onClick={() => setScreen(t.id)}>
          <span className="nico">{t.icon}</span><span className="nlbl">{t.label}</span>
        </button>
      ))}
    </nav>
  );
});
