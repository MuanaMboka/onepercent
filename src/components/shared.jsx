// ─── SHARED COMPONENTS ──────────────────────────────────────────────────────

export function ProgressRing({ done, total, size }) {
  const r = (size / 2) - 6, sw = 5, c = 2 * Math.PI * r;
  const fill = total > 0 ? (done / total) * c : 0;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDECEA" strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1A1A1A" strokeWidth={sw}
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
    </svg>
  );
}

export function ObProgress({ step, total }) {
  return <div className="ob-prog">{Array.from({ length: total }, (_, i) => <div key={i} className={`op-seg${i < step ? " op-done" : i === step ? " op-act" : ""}`} />)}</div>;
}

export function Dots({ label }) {
  return <span className="dots-wrap">{label}<span className="dot-anim"> ●</span><span className="dot-anim">●</span><span className="dot-anim">●</span></span>;
}
