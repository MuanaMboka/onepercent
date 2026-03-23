export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Satoshi:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{margin:0;padding:0;width:100%;height:100%;background:var(--bg,#FAFAF8);overscroll-behavior:none;-webkit-user-select:none;user-select:none;touch-action:manipulation;}#root{width:100%;min-height:100vh;min-height:100dvh;}
:root{
  --bg:#FAFAF8;--ink:#151515;--muted:#999;--border:#ECEAE6;
  --warm:#F3F2EF;--accent:#C2632A;--green:#1A6B44;--green-bg:#EDF8F2;
  --font-display:'Instrument Serif',serif;
  --font-body:'Satoshi',sans-serif;
}
.app-root{width:100%;max-width:100%;margin:0 auto;min-height:100vh;min-height:100dvh;background:var(--bg);display:flex;flex-direction:column;font-family:var(--font-body);position:relative;}
.screen-area{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-top:env(safe-area-inset-top);}.screen-area::-webkit-scrollbar{display:none;}
.screen{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;}.pad{padding:20px 22px;}

/* Animations */
.fade-in{animation:fadeIn 0.4s ease both;}@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.stagger-1{animation:fadeIn 0.4s ease 0.1s both;}.stagger-2{animation:fadeIn 0.4s ease 0.2s both;}.stagger-3{animation:fadeIn 0.4s ease 0.3s both;}.stagger-4{animation:fadeIn 0.4s ease 0.4s both;}
.pulse-ring{animation:pulse 2s ease infinite;}@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(21,21,21,0.2);}50%{box-shadow:0 0 0 12px rgba(21,21,21,0);}}

/* USP Carousel */
.usp-screen{position:relative;padding:0;display:flex;flex-direction:column;overflow:hidden;transition:background 0.5s ease;min-height:100vh;min-height:100dvh;}
.usp-grain{position:absolute;inset:0;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");pointer-events:none;z-index:1;}
.usp-accent-glow{position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(100px);opacity:0.12;top:30%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:0;}
.usp-top-bar{display:flex;justify-content:space-between;align-items:center;padding:18px 24px 0;position:relative;z-index:2;}
.usp-logo{font-family:var(--font-display);font-size:28px;color:#FAFAF8;}.usp-logo-dark{color:#151515;}
.usp-skip{font-size:13px;font-weight:600;color:rgba(250,250,248,0.4);background:none;border:none;cursor:pointer;}.usp-skip-dark{color:rgba(21,21,21,0.35);}
.usp-main{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 32px;}
.usp-num{font-family:var(--font-display);font-size:72px;line-height:1;margin-bottom:8px;opacity:0.6;}
.usp-headline{font-family:var(--font-display);font-size:34px;color:#FAFAF8;line-height:1.1;margin-bottom:6px;}.usp-hl-dark{color:#151515;}
.usp-sub{font-size:15px;font-weight:700;margin-bottom:18px;}
.usp-body{font-size:14px;color:rgba(250,250,248,0.55);line-height:1.7;max-width:300px;}.usp-body-dark{color:rgba(21,21,21,0.5);}
.usp-bottom{position:relative;z-index:2;padding:0 32px 36px;display:flex;flex-direction:column;align-items:center;gap:16px;}
.usp-dots{display:flex;gap:8px;}
.usp-dot{width:8px;height:8px;border-radius:50%;cursor:pointer;transition:0.3s;}.usp-dot-on{width:28px;border-radius:4px;}
.usp-cta{width:100%;padding:17px;border:none;border-radius:16px;font-size:15px;font-weight:700;cursor:pointer;transition:0.15s;letter-spacing:0.3px;}.usp-cta:hover{transform:translateY(-2px);}

/* Onboarding shared */
.ob-screen{padding:20px 22px 24px;display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;overflow-y:auto;}
.ob-prog{display:flex;gap:4px;margin-bottom:20px;}.op-seg{flex:1;height:3px;border-radius:2px;background:var(--border);transition:0.3s;}.op-done{background:var(--ink);}.op-act{background:#888;}
.ob-eye{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:8px;}
.ob-h{font-family:var(--font-display);font-size:30px;color:var(--ink);line-height:1.15;margin-bottom:10px;}
.ob-h2{font-family:var(--font-display);font-size:20px;color:var(--ink);margin-bottom:8px;}
.ob-p{font-size:13px;color:var(--muted);line-height:1.65;margin-bottom:12px;}
.ob-input{width:100%;background:var(--warm);border:2px solid transparent;border-radius:16px;padding:14px 16px;font-family:var(--font-body);font-size:15px;color:var(--ink);resize:none;outline:none;transition:0.2s;display:block;}.ob-input:focus{border-color:var(--ink);}

/* Preview */
.preview-habits{display:flex;flex-direction:column;gap:12px;margin-bottom:16px;}
.preview-habit-card{display:flex;gap:12px;background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:14px;align-items:flex-start;}
.ph-left{flex-shrink:0;}.ph-circle{width:44px;height:44px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:20px;}
.ph-right{display:flex;flex-direction:column;gap:2px;flex:1;}
.ph-area{font-size:10px;font-weight:700;letter-spacing:0.5px;}
.ph-action{font-size:14px;font-weight:600;color:var(--ink);line-height:1.3;}
.ph-identity{font-size:12px;color:var(--green);font-weight:600;font-style:italic;}
.ph-fallback{font-size:11px;color:var(--muted);margin-top:2px;}
.preview-note{font-size:13px;color:var(--muted);text-align:center;line-height:1.6;margin-bottom:4px;}

/* Area selection */
.area-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
.area-btn{background:#fff;border:2px solid var(--border);border-radius:18px;padding:16px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;font-family:var(--font-body);transition:0.2s;position:relative;}
.area-btn:hover{border-color:#CCC;}.area-on{border-width:2px;}.area-dis{opacity:0.35;cursor:not-allowed;}
.area-icon{font-size:22px;}.area-label{font-size:12px;font-weight:700;color:var(--ink);flex:1;line-height:1.3;}
.area-check{position:absolute;top:8px;right:10px;font-size:14px;font-weight:800;}
.area-count{font-size:12px;color:var(--muted);text-align:center;margin-bottom:4px;}

/* Chat */
.chat-screen{display:flex;flex-direction:column;height:100%;}
.chat-header{display:flex;gap:12px;padding:0 0 14px;border-bottom:1px solid var(--border);align-items:center;margin-bottom:10px;}
.coach-avatar{width:40px;height:40px;background:var(--ink);color:var(--bg);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:14px;font-weight:700;flex-shrink:0;}
.coach-name{font-size:14px;font-weight:700;color:var(--ink);}.coach-sub{font-size:11px;color:var(--muted);}
.chat-body{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding-bottom:12px;scrollbar-width:none;}.chat-body::-webkit-scrollbar{display:none;}
.chat-bubble{max-width:82%;padding:12px 16px;border-radius:20px;font-size:14px;line-height:1.55;word-wrap:break-word;}
.cb-coach{background:var(--warm);color:var(--ink);align-self:flex-start;border-bottom-left-radius:6px;}
.cb-user{background:var(--ink);color:var(--bg);align-self:flex-end;border-bottom-right-radius:6px;}
.typing{color:var(--muted);animation:blink 1.2s infinite;}
.chat-ready{background:var(--warm);border-radius:18px;padding:16px;text-align:center;margin-top:auto;}
.chat-ready p{font-size:13px;color:var(--muted);margin-bottom:10px;}
.chat-input-row{display:flex;gap:8px;margin-top:auto;padding-top:10px;border-top:1px solid var(--border);}
.chat-input{flex:1;background:var(--warm);border:none;border-radius:20px;padding:12px 16px;font-family:var(--font-body);font-size:14px;color:var(--ink);resize:none;outline:none;-webkit-user-select:text;user-select:text;}
textarea,input{-webkit-user-select:text;user-select:text;}
.chat-send{width:40px;height:40px;border-radius:50%;background:var(--ink);color:var(--bg);border:none;font-size:18px;font-weight:700;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:0.15s;}
.send-off{opacity:0.25;cursor:not-allowed;}

/* Config */
.insight-card{display:flex;gap:10px;background:#FFF8F0;border:1px solid #FDE8D0;border-radius:16px;padding:14px;margin-bottom:12px;align-items:flex-start;}
.ic-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C2632A;font-weight:600;margin-bottom:3px;}.ic-text{font-size:13px;color:#7C4A1E;line-height:1.5;font-weight:600;}
.goals-summary{background:var(--warm);border-radius:18px;padding:14px;margin-bottom:12px;display:flex;flex-direction:column;gap:10px;}
.gs-row{display:flex;gap:10px;align-items:flex-start;}.gs-icon{font-size:20px;flex-shrink:0;margin-top:2px;}
.gs-area{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;margin-bottom:2px;}.gs-goal{font-size:13px;color:var(--ink);font-weight:600;line-height:1.4;}
.id-line{font-size:13px;color:var(--muted);margin-bottom:8px;}.id-line strong{color:var(--ink);}

.load-grid{display:flex;flex-direction:column;gap:8px;margin-bottom:4px;}
.load-btn{background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:14px;cursor:pointer;text-align:left;transition:0.2s;font-family:var(--font-body);}.load-on{background:var(--ink);border-color:var(--ink);}
.load-top{display:flex;align-items:center;gap:8px;margin-bottom:4px;}.load-icon{font-size:18px;}.load-name{font-size:14px;font-weight:700;color:var(--ink);flex:1;}.load-on .load-name{color:var(--bg);}.load-n{font-size:12px;font-weight:700;color:var(--muted);}.load-on .load-n{color:rgba(250,250,248,0.5);}
.load-desc{font-size:11px;color:#888;line-height:1.5;}.load-on .load-desc{color:rgba(250,250,248,0.6);}
.diff-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;}
.diff-btn{background:var(--warm);border:2px solid transparent;border-radius:14px;padding:10px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:0.2s;font-family:var(--font-body);}.diff-on{background:var(--ink);border-color:var(--ink);}
.diff-lbl{font-size:12px;font-weight:700;color:var(--ink);}.diff-on .diff-lbl{color:var(--bg);}.diff-t{font-size:10px;color:var(--muted);}.diff-on .diff-t{color:rgba(250,250,248,0.5);}

/* Plan gen */
.gen-anim{display:flex;flex-direction:column;align-items:center;text-align:center;padding:20px;}
.gen-orbit{position:relative;width:120px;height:120px;margin-bottom:28px;}
.gen-core{position:absolute;width:16px;height:16px;background:#C2632A;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 0 30px rgba(194,99,42,0.5);}
.gen-ring-1,.gen-ring-2,.gen-ring-3{position:absolute;inset:0;border-radius:50%;border:1.5px solid rgba(250,250,248,0.08);}
.gen-ring-1{inset:15px;border-color:rgba(250,250,248,0.12);animation:orbitSpin 3s linear infinite;}
.gen-ring-2{inset:5px;border-color:rgba(250,250,248,0.06);animation:orbitSpin 5s linear infinite reverse;}
.gen-ring-3{inset:-2px;border-color:rgba(250,250,248,0.04);animation:orbitSpin 8s linear infinite;}
.gen-ring-1::after,.gen-ring-2::after,.gen-ring-3::after{content:"";position:absolute;width:6px;height:6px;border-radius:50%;top:-3px;left:50%;transform:translateX(-50%);}
.gen-ring-1::after{background:#2D9A6F;box-shadow:0 0 10px rgba(45,154,111,0.6);}
.gen-ring-2::after{background:#7C5CBF;box-shadow:0 0 10px rgba(124,92,191,0.6);}
.gen-ring-3::after{background:#2563EB;box-shadow:0 0 10px rgba(37,99,235,0.6);}
@keyframes orbitSpin{to{transform:rotate(360deg);}}
.gen-title{font-family:var(--font-display);font-size:24px;color:var(--ink);margin-bottom:6px;}
.gen-sub{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:24px;}
.gen-steps{display:flex;flex-direction:column;gap:10px;text-align:left;}
.gen-step{font-size:13px;color:rgba(250,250,248,0.3);line-height:1.5;transition:all 0.5s ease;padding-left:16px;position:relative;}
.gen-step::before{content:"";position:absolute;left:0;top:7px;width:6px;height:6px;border-radius:50%;background:rgba(250,250,248,0.15);}
.gs-1{animation:stepGlow 6s ease 0.5s both;}.gs-2{animation:stepGlow 6s ease 2s both;}.gs-3{animation:stepGlow 6s ease 3.5s both;}.gs-4{animation:stepGlow 6s ease 5s both;}
@keyframes stepGlow{0%{color:rgba(250,250,248,0.3);}15%{color:rgba(250,250,248,0.9);}50%,100%{color:rgba(250,250,248,0.45);}}

/* Plan cards */
.plan-cards{display:flex;flex-direction:column;gap:10px;margin-bottom:8px;}
.plan-card{background:#fff;border:1.5px solid var(--border);border-radius:18px;overflow:hidden;transition:0.2s;}.plan-sel{border-color:var(--ink);box-shadow:0 2px 12px rgba(21,21,21,0.1);}
.plan-card-top{display:flex;gap:12px;padding:14px 16px;cursor:pointer;align-items:flex-start;}
.plan-badge{width:32px;height:32px;background:var(--ink);color:var(--bg);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:15px;flex-shrink:0;}
.plan-info{flex:1;}.plan-name{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:2px;}.plan-phil{font-size:11px;color:var(--muted);line-height:1.4;}
.plan-actions{display:flex;gap:8px;padding:0 16px 14px;}
.plan-view-btn{flex:1;padding:8px;background:var(--warm);border:none;border-radius:10px;font-size:12px;font-weight:700;color:var(--ink);cursor:pointer;}
.plan-choose-btn{flex:1;padding:8px;background:var(--ink);border:none;border-radius:10px;font-size:12px;font-weight:700;color:var(--bg);cursor:pointer;}.chosen{background:var(--green-bg);color:var(--green);border:1px solid #BBF7D0;}

/* Week detail */
.week-detail{display:flex;flex-direction:column;gap:8px;margin-bottom:8px;}
.wd-day{background:var(--warm);border-radius:14px;padding:12px 14px;}.wd-label{font-size:12px;font-weight:700;color:var(--ink);display:block;margin-bottom:6px;}
.wd-action{display:flex;gap:8px;margin-bottom:6px;align-items:flex-start;}
.wd-area-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.wd-action-name{font-size:13px;font-weight:600;color:var(--ink);}.wd-trigger{font-size:11px;color:var(--accent);font-weight:600;}.wd-mini{font-size:10px;color:#4A9D6F;font-style:italic;}

/* Ready */
.ready-top{text-align:center;padding:8px 0 16px;}
.ready-ring{width:72px;height:72px;background:var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}.ready-check{font-size:28px;color:var(--bg);}
.ready-h{font-family:var(--font-display);font-size:30px;color:var(--ink);line-height:1.2;margin-bottom:8px;}.ready-sub{font-size:13px;color:var(--muted);}
.ready-areas{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:14px;}
.ra-pill{font-size:12px;font-weight:700;padding:6px 14px;border-radius:20px;border:1.5px solid;}
.ready-plan-name{background:var(--warm);border-radius:18px;padding:16px;text-align:center;margin-bottom:14px;}
.rpn{font-family:var(--font-display);font-size:20px;color:var(--ink);margin-bottom:4px;}.rpp{font-size:12px;color:#666;line-height:1.5;}

/* Today */
.eyebrow{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:6px;}
.today-top{margin-bottom:14px;}.today-plan{font-size:11px;color:var(--muted);}
.today-eyebrow-row{display:flex;justify-content:space-between;align-items:baseline;}
.daily-greeting{font-size:13px;color:var(--ink);font-weight:600;font-family:var(--font-display);}
.today-header-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:8px;}
.today-header-left{display:flex;align-items:center;gap:10px;}
.today-header-stats{display:flex;flex-direction:column;}
.today-done-count{font-family:var(--font-display);font-size:32px;color:var(--ink);line-height:1;}.today-done-total{font-size:18px;color:#CCC;}
.today-partial-tag{font-size:10px;color:var(--accent);font-weight:600;margin-top:2px;}
.today-consistency-pill{background:var(--warm);border:1.5px solid var(--border);border-radius:12px;padding:6px 12px;}
.tcp-value{font-size:12px;font-weight:700;color:var(--ink);}

/* Identity toast */
.identity-toast{display:flex;align-items:center;gap:8px;background:var(--green-bg);border:1px solid #BBF7D0;border-radius:12px;padding:10px 14px;margin-bottom:12px;}
.it-check{color:var(--green);font-weight:800;font-size:14px;}.it-text{font-size:13px;color:var(--green);font-weight:600;font-style:italic;}
@keyframes toastIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}
.identity-toast{animation:toastIn 0.3s ease both;}

/* Week toggle */
.week-toggle{width:100%;padding:8px;background:transparent;border:1.5px solid var(--border);border-radius:10px;font-size:11px;font-weight:700;color:var(--muted);cursor:pointer;text-align:center;margin-bottom:12px;transition:0.15s;}.week-toggle:hover{border-color:var(--ink);color:var(--ink);}
.wt-arrow{font-size:9px;margin-left:4px;}

/* Completion animation */
@keyframes completePop{0%{transform:scale(1);}40%{transform:scale(1.15);}100%{transform:scale(1);}}
.acircle-done{background:var(--bg);border-color:var(--bg);animation:completePop 0.3s ease;}

/* Check-in nudge */
.checkin-nudge{margin-bottom:12px;}
.nudge-text{font-size:13px;color:var(--muted);text-align:center;margin-bottom:8px;font-weight:500;}

/* Legacy pstrip (kept for reflection screen) */
.pstrip{display:flex;align-items:center;gap:14px;background:var(--warm);border-radius:20px;padding:14px 18px;margin-bottom:12px;}
.pstrip-mid{display:flex;flex-direction:column;}.pbig{font-family:var(--font-display);font-size:42px;color:var(--ink);line-height:1;}.ptot{font-size:22px;color:#CCC;}.plbl{font-size:11px;color:var(--muted);margin-top:2px;}.plbl-p{font-size:10px;color:var(--accent);font-weight:600;}
.pct-badge{margin-left:auto;background:var(--ink);color:var(--bg);font-family:var(--font-display);font-size:18px;padding:8px 12px;border-radius:12px;}

/* Action cards */
.action-list{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
.acard{background:#fff;border:1.5px solid var(--border);border-radius:18px;overflow:hidden;transition:0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.03);}
.ac-done{background:var(--ink);border-color:var(--ink);}.ac-partial{background:#FFFBEB;border-color:#FDE68A;}
.acard-inner{display:flex;align-items:center;gap:12px;padding:14px;}
.acircle{width:44px;height:44px;border-radius:50%;border:2px solid #DDD;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;background:transparent;font-size:16px;font-weight:700;color:var(--ink);transition:0.2s;}
.acircle-done{background:var(--bg);border-color:var(--bg);}.acircle-partial{background:#FDE68A;border-color:#F59E0B;}
.ac-tap{font-size:9px;color:#CCC;letter-spacing:1px;text-transform:uppercase;font-weight:600;}
.acard-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.acard-area{font-size:10px;font-weight:700;letter-spacing:0.5px;}
.acard-name{font-size:14px;font-weight:600;color:var(--ink);line-height:1.3;}.ac-done .acard-name{color:var(--bg);text-decoration:line-through;opacity:0.7;}.ac-partial .acard-name{color:#92400E;}
.acard-trigger{font-size:11px;color:var(--accent);font-weight:500;}.ac-done .acard-trigger{color:rgba(250,250,248,0.35);}
.half-btn{background:var(--warm);border:1.5px solid #DDD;border-radius:10px;padding:6px 10px;font-size:12px;font-weight:700;color:var(--muted);cursor:pointer;flex-shrink:0;transition:0.15s;}.half-on{background:#FDE68A;border-color:#F59E0B;color:#92400E;}
.acard-detail{padding:0 14px 14px;border-top:1px solid var(--border);}.ac-done .acard-detail{border-color:rgba(250,250,248,0.1);}
.ad-row{display:flex;gap:8px;padding:8px 0;border-bottom:1px solid #F5F4F2;}.ad-row:last-child{border:none;}
.ad-l{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#BBB;font-weight:600;width:70px;flex-shrink:0;}.ad-v{font-size:12px;color:#666;line-height:1.5;flex:1;}.ac-done .ad-v{color:rgba(250,250,248,0.5);}

.all-done{background:var(--warm);border-radius:20px;padding:22px;text-align:center;margin-bottom:12px;}.done-msg{font-family:var(--font-display);font-size:18px;color:var(--ink);margin-top:10px;}
.tomorrow-peek{background:var(--warm);border-radius:14px;padding:12px 14px;margin-bottom:12px;opacity:0.7;}.tp-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:6px;}.tp-action{font-size:12px;color:var(--muted);margin-bottom:3px;}.tp-dot{margin-right:4px;}
.plan-refresh-btn{width:100%;padding:10px;background:var(--warm);border:1.5px solid var(--border);border-radius:12px;font-size:12px;font-weight:700;color:var(--ink);cursor:pointer;text-align:center;margin-bottom:12px;transition:0.15s;}.plan-refresh-btn:hover{border-color:var(--ink);}

/* Banners */
.comeback{display:flex;gap:12px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:16px;padding:16px;margin-bottom:14px;}
.comeback-body{flex:1;}.cb-t{font-size:15px;font-weight:700;color:#92400E;margin-bottom:4px;}.cb-s{font-size:12px;color:#92400E;opacity:0.85;line-height:1.5;margin-bottom:4px;}.cb-hint{font-size:11px;color:#B45309;opacity:0.7;line-height:1.4;margin-bottom:10px;}
.cb-keep{background:var(--ink);color:var(--bg);border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;}
.return-banner{display:flex;gap:12px;background:var(--green-bg);border:1px solid #BBF7D0;border-radius:16px;padding:14px 16px;margin-bottom:14px;align-items:center;}
.ret-t{font-size:14px;font-weight:700;color:var(--green);}.ret-s{font-size:11px;color:var(--green);opacity:0.8;margin-top:2px;}.ret-x{background:none;border:none;color:var(--green);font-size:18px;cursor:pointer;margin-left:auto;}

/* Milestone overlay */
.milestone-overlay{position:fixed;inset:0;background:rgba(21,21,21,0.6);display:flex;align-items:center;justify-content:center;z-index:100;padding:30px;}
.milestone-card{background:var(--bg);border-radius:28px;padding:32px 28px;text-align:center;max-width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
.ms-icon{font-size:48px;display:block;margin-bottom:14px;}.ms-title{font-family:var(--font-display);font-size:26px;color:var(--ink);margin-bottom:8px;}.ms-msg{font-size:13px;color:#666;line-height:1.65;}

/* Proto */
.proto{margin-top:16px;padding:12px;background:#F0EFED;border-radius:14px;border:1px dashed #CCC;}.proto-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#AAA;font-weight:600;margin-bottom:8px;}.proto-row{display:flex;gap:6px;}
.proto-btn{background:#fff;border:1px solid #DDD;border-radius:8px;padding:7px 12px;font-size:11px;color:#666;cursor:pointer;transition:0.15s;}.proto-btn:hover{background:var(--ink);color:var(--bg);}

/* Nudges */
.nudge-card{background:var(--ink);border-radius:24px;padding:26px 22px;margin-bottom:16px;}.nudge-icon{font-size:30px;display:block;margin-bottom:12px;}.nudge-msg{font-family:var(--font-display);font-size:20px;color:var(--bg);line-height:1.45;}
.nudge-status{background:var(--warm);border-radius:20px;padding:16px;margin-bottom:16px;}.ns-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:10px;}.mpill{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:8px;margin-bottom:7px;}.mpill-done{color:var(--ink);font-weight:600;}.ns-count{font-size:15px;font-weight:700;color:var(--ink);margin-top:8px;}

/* Reflection */
.checkin-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.checkin-btn{background:#fff;border:1.5px solid var(--border);border-radius:18px;padding:20px 14px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;transition:0.15s;}.checkin-btn:hover{border-color:var(--ink);}
.ci-icon{font-size:28px;}.ci-label{font-size:13px;font-weight:700;color:var(--ink);}
.done-pct{width:96px;height:96px;border-radius:50%;background:var(--ink);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:26px;color:var(--bg);margin-bottom:18px;}
.done-h{font-family:var(--font-display);font-size:30px;color:var(--ink);margin-bottom:6px;text-align:center;}.done-resp{font-size:13px;color:#555;text-align:center;line-height:1.65;margin-bottom:18px;max-width:300px;font-style:italic;}.done-foot{font-size:13px;color:var(--muted);text-align:center;margin-top:12px;}
.done-day{font-size:13px;color:#555;text-align:center;line-height:1.65;margin-bottom:8px;font-style:italic;}
.done-partial{font-size:12px;color:var(--muted);text-align:center;margin-bottom:12px;}
.refl-done-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.refl-ring-wrap{position:relative;width:120px;height:120px;margin-bottom:18px;}
.refl-pct-over{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:32px;color:var(--ink);font-weight:700;}
@keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.slide-up{animation:slideUp 0.6s ease-out both;}.slide-up:nth-child(2){animation-delay:0.1s;}.slide-up:nth-child(3){animation-delay:0.2s;}.slide-up:nth-child(4){animation-delay:0.3s;}.slide-up:nth-child(5){animation-delay:0.4s;}.slide-up:nth-child(6){animation-delay:0.5s;}
.confetti-container{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;}
.confetti-piece{position:absolute;top:-10px;width:8px;height:8px;border-radius:2px;animation:confettiFall linear forwards;}
@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(720deg);opacity:0;}}
.write-box{width:100%;margin-bottom:14px;}.wb-label{font-size:11px;color:#AAA;margin-bottom:6px;}

/* Progress - redesigned */
.prog-screen{gap:0;}
.prog-hero{display:flex;flex-direction:column;align-items:center;padding:8px 0 20px;gap:16px;}
.prog-ring-wrap{position:relative;width:130px;height:130px;}
.prog-ring-inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.prog-hero-num{font-family:var(--font-display);font-size:38px;color:var(--ink);line-height:1;}
.prog-hero-lbl{font-size:11px;color:var(--muted);font-weight:600;margin-top:2px;}
.prog-hero-stats{display:flex;gap:0;align-items:center;background:var(--warm);border-radius:16px;padding:12px 20px;}
.prog-stat{display:flex;flex-direction:column;align-items:center;min-width:54px;}
.prog-stat-val{font-family:var(--font-display);font-size:24px;color:var(--ink);line-height:1;}
.prog-stat-lbl{font-size:10px;color:var(--muted);font-weight:600;margin-top:2px;}
.prog-stat-divider{width:1px;height:28px;background:var(--border);margin:0 12px;}

.prog-insight{display:flex;gap:10px;align-items:center;background:var(--ink);border-radius:16px;padding:14px 16px;margin-bottom:14px;}
.pi-icon{font-size:20px;flex-shrink:0;}
.pi-text{font-size:13px;color:var(--bg);line-height:1.5;font-weight:500;}

.prog-card{background:var(--warm);border-radius:18px;padding:16px;margin-bottom:12px;}
.sec-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#BBB;font-weight:600;margin-bottom:6px;}

.prog-bars{display:flex;gap:8px;justify-content:center;align-items:flex-end;height:80px;padding:8px 0 0;}
.prog-bar-col{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;max-width:60px;}
.prog-bar-track{width:100%;height:60px;background:var(--border);border-radius:8px;display:flex;align-items:flex-end;overflow:hidden;}
.prog-bar-fill{width:100%;background:var(--ink);border-radius:8px;transition:height 0.6s ease;min-height:4px;}
.prog-bar-val{font-size:11px;font-weight:700;color:var(--ink);}
.prog-bar-lbl{font-size:9px;color:var(--muted);font-weight:600;}

.prog-identities{display:flex;flex-direction:column;gap:8px;}
.prog-id-chip{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border-radius:14px;border-left:3px solid;}
.prog-id-icon{font-size:18px;flex-shrink:0;}
.prog-id-txt{font-size:13px;color:var(--ink);font-weight:600;line-height:1.4;}

.prog-areas{display:flex;flex-direction:column;gap:6px;}
.prog-area-row{display:flex;align-items:center;gap:10px;padding:6px 0;}
.prog-area-icon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.prog-area-name{font-size:13px;font-weight:600;color:var(--ink);flex:1;}
.prog-area-freq{font-size:12px;color:var(--muted);font-weight:600;}

.prog-heatmap{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin:8px 0;}
.prog-heat-cell{aspect-ratio:1;border-radius:4px;min-width:0;}
.prog-heat-0{background:#EDECEA;}
.prog-heat-1{background:#E5E3E0;}
.prog-heat-2{background:#B8D4C8;}
.prog-heat-3{background:#5AAA8A;}
.prog-heat-4{background:#1A6B44;}
.prog-heat-legend{display:flex;align-items:center;gap:4px;justify-content:flex-end;margin-top:6px;}
.prog-heat-legend .prog-heat-cell{width:12px;height:12px;flex-shrink:0;}
.phl-text{font-size:9px;color:var(--muted);font-weight:600;}

.prog-milestones{display:flex;flex-direction:column;}
.prog-ms-item{display:flex;gap:12px;min-height:48px;}
.prog-ms-line-wrap{display:flex;flex-direction:column;align-items:center;width:32px;flex-shrink:0;}
.prog-ms-dot{width:32px;height:32px;border-radius:50%;background:#fff;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.prog-ms-dot-latest{border-color:var(--ink);box-shadow:0 0 0 3px rgba(21,21,21,0.08);}
.prog-ms-line{width:2px;flex:1;background:var(--border);min-height:12px;}
.prog-ms-content{display:flex;flex-direction:column;padding:6px 0 16px;}
.prog-ms-title{font-size:13px;font-weight:700;color:var(--ink);}
.prog-ms-msg{font-size:11px;color:var(--muted);line-height:1.5;margin-top:1px;}

.mood-timeline{display:flex;gap:4px;overflow-x:auto;padding:8px 0;}
.mood-entry{display:flex;flex-direction:column;align-items:center;min-width:36px;}
.mood-icon{font-size:18px;}.mood-day{font-size:9px;color:var(--muted);margin-top:2px;}
.mood-legend{display:flex;gap:12px;font-size:10px;color:var(--muted);margin-top:8px;flex-wrap:wrap;}

/* Buttons */
.btn-glow{width:100%;padding:16px;background:var(--ink);color:var(--bg);border:none;border-radius:16px;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.15s;box-shadow:0 4px 20px rgba(21,21,21,0.3);}.btn-glow:hover{transform:translateY(-2px);}
.btn-primary{width:100%;padding:16px;background:var(--ink);color:var(--bg);border:none;border-radius:16px;font-size:15px;font-weight:700;cursor:pointer;transition:0.15s;}.btn-primary:hover{background:#2D2D2D;}
.btn-off{opacity:0.25;cursor:not-allowed;}.btn-secondary{width:100%;padding:14px;background:transparent;color:var(--ink);border:2px solid var(--ink);border-radius:16px;font-size:14px;font-weight:700;cursor:pointer;margin-top:12px;transition:0.15s;}.btn-secondary:hover{background:var(--ink);color:var(--bg);}
.ghost-btn{background:none;border:none;color:#BBB;font-size:13px;cursor:pointer;padding:10px 0;display:block;width:100%;text-align:center;margin-top:4px;}
.mt12{margin-top:12px;}.mt16{margin-top:16px;}
.dots-wrap{font-size:13px;color:#888;}.dot-anim{display:inline-block;margin:0 2px;animation:blink 1.2s infinite;}.dot-anim:nth-child(2){animation-delay:0.2s;}.dot-anim:nth-child(3){animation-delay:0.4s;}@keyframes blink{0%,100%{opacity:0.2;}50%{opacity:1;}}

/* Struggles */
.struggle-grid{display:flex;flex-direction:column;gap:8px;margin-bottom:8px;}
.struggle-btn{display:flex;gap:12px;align-items:center;background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:14px;cursor:pointer;font-family:var(--font-body);transition:0.2s;text-align:left;position:relative;}
.struggle-on{border-color:var(--ink);background:var(--ink);}.str-icon{font-size:22px;flex-shrink:0;}
.str-text{display:flex;flex-direction:column;gap:2px;flex:1;}.str-label{font-size:13px;font-weight:700;color:var(--ink);}.struggle-on .str-label{color:var(--bg);}
.str-desc{font-size:11px;color:var(--muted);}.struggle-on .str-desc{color:rgba(250,250,248,0.5);}
.str-check{position:absolute;top:12px;right:14px;color:var(--bg);font-weight:800;font-size:14px;}
.struggle-solutions{background:var(--warm);border-radius:16px;padding:14px;margin-top:14px;}
.ss-header{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;}
.ss-item{display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;}.ss-item:last-child{margin-bottom:0;}
.ss-icon{font-size:18px;flex-shrink:0;margin-top:1px;}
.ss-text{font-size:12px;color:var(--ink);line-height:1.5;}

/* Habit builder */
.habit-list{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.habit-card{display:flex;gap:10px;align-items:center;background:#fff;border:1.5px solid var(--border);border-radius:16px;padding:12px;transition:0.2s;}
.habit-sel{border-color:var(--green);background:var(--green-bg);}
.habit-toggle{width:32px;height:32px;border-radius:50%;border:2px solid #DDD;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:0.2s;}
.ht-on{color:var(--green);font-weight:800;font-size:16px;}.ht-off{width:10px;height:10px;border-radius:50%;background:#EEE;}
.habit-sel .habit-toggle{border-color:var(--green);background:var(--green-bg);}
.habit-info{flex:1;cursor:pointer;display:flex;flex-direction:column;gap:2px;}
.habit-area-tag{font-size:10px;font-weight:700;}.habit-action{font-size:13px;font-weight:600;color:var(--ink);line-height:1.35;}
.habit-twomin{font-size:10px;color:var(--muted);font-style:italic;}
.habit-remove{background:none;border:none;font-size:18px;color:#CCC;cursor:pointer;padding:4px 8px;flex-shrink:0;}.habit-remove:hover{color:#F00;}

.add-habit-box{background:var(--warm);border-radius:18px;padding:14px;margin-bottom:14px;}
.ah-label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
.ah-areas{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;}
.ah-area-btn{font-size:10px;font-weight:700;padding:5px 10px;border-radius:12px;border:1.5px solid var(--border);background:#fff;cursor:pointer;font-family:var(--font-body);transition:0.15s;}
.ah-area-on{border-width:2px;}
.habit-footer{padding:8px 0;}.hf-count{font-size:12px;color:var(--muted);text-align:center;margin-bottom:8px;}

/* Interactive Calendar */
.ical{display:flex;flex-direction:column;gap:12px;margin-bottom:14px;}
.ical-day{background:var(--warm);border-radius:16px;padding:12px 14px;}
.ical-day-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.ical-d-name{font-size:14px;font-weight:700;color:var(--ink);}.ical-d-count{font-size:11px;color:var(--muted);}
.ical-slot{display:flex;gap:10px;margin-bottom:6px;align-items:flex-start;min-height:28px;}
.ical-slot-label{font-size:10px;color:var(--muted);font-weight:600;width:80px;flex-shrink:0;padding-top:4px;}
.ical-slot-actions{flex:1;display:flex;flex-direction:column;gap:4px;}
.ical-action{display:flex;align-items:center;gap:6px;background:#fff;border-radius:10px;padding:6px 10px;border-left:3px solid #999;font-size:12px;}
.ical-a-text{flex:1;font-weight:600;color:var(--ink);}.ical-a-remove{background:none;border:none;font-size:16px;color:#CCC;cursor:pointer;padding:2px;}.ical-a-remove:hover{color:#F00;}
.ical-add-btn{width:28px;height:28px;border-radius:8px;border:1.5px dashed #CCC;background:none;color:#AAA;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:0.15s;}.ical-add-btn:hover{border-color:var(--ink);color:var(--ink);}
.ical-footer{text-align:center;}.ical-total{font-size:12px;color:var(--muted);margin-bottom:8px;}

/* Add modal */
.add-modal-bg{position:fixed;inset:0;background:rgba(21,21,21,0.5);z-index:100;display:flex;align-items:flex-end;justify-content:center;padding:20px;}
.add-modal{background:var(--bg);border-radius:24px 24px 0 0;padding:20px;width:100%;max-width:390px;max-height:60vh;overflow-y:auto;}
.am-title{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:12px;}
.am-habit{display:flex;gap:8px;align-items:center;width:100%;background:var(--warm);border:none;border-radius:12px;padding:12px;font-size:13px;font-weight:600;color:var(--ink);cursor:pointer;margin-bottom:6px;font-family:var(--font-body);text-align:left;transition:0.15s;}.am-habit:hover{background:#E8E6E2;}

/* Week Calendar */
.wcal{background:var(--warm);border-radius:18px;padding:14px;margin-bottom:12px;overflow-x:auto;}
.wcal-grid{min-width:100%;}
.wcal-header{display:grid;grid-template-columns:36px repeat(7,1fr);gap:2px;margin-bottom:4px;}
.wcal-time-col{display:flex;align-items:center;justify-content:center;}
.wcal-day-col{text-align:center;padding:4px 0;border-radius:8px;}.wcal-today{background:var(--ink);border-radius:8px;}
.wcal-d{font-size:10px;font-weight:700;color:var(--muted);}.wcal-today .wcal-d{color:var(--bg);}
.wcal-row{display:grid;grid-template-columns:36px repeat(7,1fr);gap:2px;margin-bottom:2px;min-height:32px;}
.wcal-time{font-size:9px;color:#BBB;font-weight:600;}
.wcal-cell{padding:2px;border-radius:6px;min-height:28px;}.wcal-cell-today{background:rgba(21,21,21,0.04);}
.wcal-block{border-radius:5px;padding:3px 5px;margin-bottom:2px;}
.wcal-block-text{font-size:8px;font-weight:600;color:var(--ink);line-height:1.3;display:block;}

/* Trigger selection */
.ad-triggers{padding:8px 0;}.ad-trigger-opts{display:flex;flex-direction:column;gap:4px;margin-top:4px;}
.ad-trig-btn{background:var(--warm);border:1.5px solid var(--border);border-radius:10px;padding:8px 10px;font-size:11px;color:var(--ink);cursor:pointer;text-align:left;font-family:var(--font-body);transition:0.15s;font-weight:500;}
.ad-trig-btn:hover{border-color:#999;}.ad-trig-on{border-color:var(--accent);background:rgba(194,99,42,0.08);color:var(--accent);font-weight:600;}

/* Action card meta */
.acard-meta{display:flex;gap:8px;align-items:center;margin-bottom:2px;}
.acard-time{font-size:9px;color:var(--muted);font-weight:600;}

/* Chat ready hint */
.chat-ready-hint{font-size:11px;color:var(--muted);margin-top:6px;}

/* Nav */
.bnav{display:flex;background:var(--bg);border-top:1px solid var(--border);padding:10px 0 calc(10px + env(safe-area-inset-bottom));flex-shrink:0;position:sticky;bottom:0;}
.nbtn{flex:1;background:none;border:none;cursor:pointer;padding:6px 0;display:flex;flex-direction:column;align-items:center;gap:4px;opacity:0.26;transition:0.15s;}.nbtn-on{opacity:1;}
.nico{font-size:18px;color:var(--ink);}.nlbl{font-size:9px;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink);font-weight:600;}

/* Edit Schedule */
.es-day{margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:16px;}
.es-day-label{font-family:var(--font-display);font-size:18px;color:var(--ink);margin-bottom:8px;}
.es-slot{display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;min-height:32px;}
.es-slot-label{font-size:11px;font-weight:600;color:var(--muted);min-width:90px;padding-top:6px;}
.es-slot-actions{flex:1;display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.es-action{display:flex;align-items:center;gap:6px;background:var(--warm);border-radius:10px;padding:6px 10px;font-size:13px;color:var(--ink);}
.es-action-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.es-action-name{font-weight:500;}
.es-remove{background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;padding:0 2px;font-weight:700;}
.es-remove:hover{color:var(--ink);}
.es-add-btn{width:28px;height:28px;border-radius:50%;border:1.5px dashed var(--border);background:none;color:var(--muted);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.es-add-btn:hover{border-color:var(--ink);color:var(--ink);}
.es-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:100;display:flex;align-items:flex-end;justify-content:center;}
.es-modal{background:var(--bg);border-radius:20px 20px 0 0;padding:20px 22px calc(20px + env(safe-area-inset-bottom));width:100%;max-width:480px;max-height:60vh;overflow-y:auto;}
.es-modal-title{font-family:var(--font-display);font-size:18px;color:var(--ink);margin-bottom:12px;}
.es-modal-item{display:flex;align-items:center;gap:10px;width:100%;background:var(--warm);border:none;border-radius:12px;padding:12px 14px;font-size:14px;font-weight:500;color:var(--ink);cursor:pointer;margin-bottom:6px;font-family:var(--font-body);text-align:left;}
.es-modal-item:hover{background:var(--border);}
`;
