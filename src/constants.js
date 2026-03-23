export const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export const DAY_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export const LIFE_AREAS = [
  { id:"health",    icon:"💪", label:"Health & Fitness", color:"#2D9A6F" },
  { id:"career",    icon:"💼", label:"Career & Money",   color:"#D97706" },
  { id:"spiritual", icon:"🕊️", label:"Spiritual",        color:"#7C5CBF" },
  { id:"relations", icon:"❤️", label:"Relationships",    color:"#DC4A68" },
  { id:"growth",    icon:"📚", label:"Learning & Growth",color:"#2563EB" },
  { id:"fun",       icon:"🎨", label:"Fun & Creativity", color:"#0D9488" },
];

export const USP_SLIDES = [
  {
    num:"01",
    headline:"Not the same list every day.",
    sub:"Your plan rotates weekly.",
    body:"Different actions. Same goals. Always moving.",
    accent:"#C2632A",
    bg:"linear-gradient(145deg,#1A1008 0%,#2C1810 50%,#1A1008 100%)",
    light:false,
  },
  {
    num:"02",
    headline:"One app. Your whole life.",
    sub:"Health. Money. Love. Growth.",
    body:"Pick what matters. AI builds one daily plan across all of it.",
    accent:"#2D9A6F",
    bg:"linear-gradient(145deg,#FAFAF8 0%,#EDF8F2 50%,#FAFAF8 100%)",
    light:true,
  },
  {
    num:"03",
    headline:"You came back.",
    sub:"That's all that matters.",
    body:"Half counts. Rest counts. The only loss is never opening it again.",
    accent:"#7C5CBF",
    bg:"linear-gradient(145deg,#0F0A18 0%,#1A1028 50%,#0F0A18 100%)",
    light:false,
  },
];

export const STRUGGLES = [
  { id:"consistency", icon:"🔄", label:"Staying consistent", desc:"I start strong then fade" },
  { id:"motivation",  icon:"🔋", label:"Losing motivation",  desc:"I stop caring after a while" },
  { id:"time",        icon:"⏰", label:"Finding time",        desc:"Life gets busy and I skip" },
  { id:"overwhelm",   icon:"🌊", label:"Feeling overwhelmed", desc:"Too many goals, I freeze" },
  { id:"forgetting",  icon:"🧠", label:"Forgetting to do it", desc:"I just don't remember" },
  { id:"perfectionism",icon:"🎯", label:"All or nothing",     desc:"If I can't do it perfectly, I skip" },
];

export const CHECKIN_OPTIONS = [
  { id:"easy",    icon:"🌊", label:"Felt easy" },
  { id:"hard",    icon:"🏔️", label:"Had to push" },
  { id:"partial", icon:"🌤️", label:"Did what I could" },
  { id:"rest",    icon:"🛋️", label:"Rest day" },
];

export const CHECKIN_RESPONSES = {
  easy:    "Easy means the system is working.",
  hard:    "Hard days forge the habit. You showed up.",
  partial: "Something beats nothing. Always.",
  rest:    "Rest is part of the system.",
};

export const MILESTONES = [
  { day:3,  icon:"🌱", title:"Started",    msg:"Most people never do. You did." },
  { day:7,  icon:"🔥", title:"One week",   msg:"Your brain is noticing the pattern." },
  { day:14, icon:"⚡", title:"Two weeks",  msg:"The neural pathway is forming." },
  { day:21, icon:"🏔️", title:"21 days",    msg:"The myth says this is enough. Science says keep going." },
  { day:30, icon:"💎", title:"One month",  msg:"Most people quit before now. You didn't." },
  { day:66, icon:"👑", title:"Automatic",  msg:"66 days. Research says this is when it sticks." },
];

export const STRUGGLE_SOLUTIONS = {
  consistency: { icon: "🔄", solution: "Rotating weekly plans keep things fresh so you never get bored." },
  motivation: { icon: "🪞", solution: "Identity statements remind you who you're becoming, not just what to do." },
  time: { icon: "⏱️", solution: "Every habit has a 2-minute fallback for busy days." },
  overwhelm: { icon: "📋", solution: "Max 3-5 actions per day, spread across time slots." },
  forgetting: { icon: "🔔", solution: "Triggers tied to things you already do, so habits ride existing routines." },
  perfectionism: { icon: "½", solution: "Partial completions count. Half is always better than zero." },
};
