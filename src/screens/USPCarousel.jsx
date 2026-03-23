import { useRef, memo } from "react";
import { USP_SLIDES } from "../constants.js";
import { useApp } from "../App.jsx";

export default memo(function USPCarousel() {
  const { uspSlide, setUspSlide, setScreen } = useApp();
  const slide = USP_SLIDES[uspSlide];
  const isLast = uspSlide === USP_SLIDES.length - 1;
  const light = slide.light;
  const touchRef = useRef({ startX: 0, startY: 0 });

  function onTouchStart(e) {
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
  }
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = e.changedTouches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) {
      if (isLast) setScreen("onboarding"); else setUspSlide(uspSlide + 1);
    } else if (uspSlide > 0) {
      setUspSlide(uspSlide - 1);
    }
  }

  return (
    <div className="screen usp-screen" style={{ background: slide.bg }} key={uspSlide}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="usp-grain" />
      <div className="usp-accent-glow" style={{ background: slide.accent }} />

      <div className="usp-top-bar">
        <span className={`usp-logo ${light ? "usp-logo-dark" : ""}`}>1%</span>
        {!isLast && <button className={`usp-skip ${light ? "usp-skip-dark" : ""}`}
          onClick={() => setScreen("onboarding")}>Skip</button>}
      </div>

      <div className="usp-main fade-in">
        <span className="usp-num" style={{ color: slide.accent }}>{slide.num}</span>
        <h1 className={`usp-headline ${light ? "usp-hl-dark" : ""}`}>{slide.headline}</h1>
        <p className="usp-sub" style={{ color: slide.accent }}>{slide.sub}</p>
        <p className={`usp-body ${light ? "usp-body-dark" : ""}`}>{slide.body}</p>
      </div>

      <div className="usp-bottom">
        <div className="usp-dots">
          {USP_SLIDES.map((_, i) => (
            <div key={i}
              className={`usp-dot${i === uspSlide ? " usp-dot-on" : ""}`}
              style={i === uspSlide ? { background: slide.accent } : { background: light ? "#CCC" : "#444" }}
              onClick={() => setUspSlide(i)} />
          ))}
        </div>
        <button className="usp-cta"
          style={{ background: slide.accent, color: slide.light ? "#fff" : "#fff" }}
          onClick={() => isLast ? setScreen("onboarding") : setUspSlide(uspSlide + 1)}>
          {isLast ? "Build my system" : "Next"}
        </button>
      </div>
    </div>
  );
});
