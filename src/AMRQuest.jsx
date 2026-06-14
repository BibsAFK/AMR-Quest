import { useState } from "react";
import { C } from "./styles/theme";
import WelcomeScreen from "./screens/WelcomeScreen";
import HowToPlayScreen from "./screens/HowToPlayScreen";
import GameScreen from "./screens/GameScreen";
import ResultScreen from "./screens/ResultScreen";

const STEPS = ["welcome", "howto", "game", "result"];

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [summary, setSummary] = useState({ total: 18, killed: 0, survived: 18 });
  const currentStep = STEPS.indexOf(screen);
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const restart = () => {
    setSummary({ total: 18, killed: 0, survived: 18 });
    setScreen("welcome");
  };

  return (
    <div style={{ width: "100vw", height: "100dvh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700;800&family=Orbitron:wght@700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Space Grotesk', sans-serif; background: #05050e; }
        @keyframes popIn { from { opacity:0; transform:scale(.82) translateY(18px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes wriggle { from { transform:rotate(-10deg) scale(1); } to { transform:rotate(10deg) scale(1.13); } }
        @keyframes float { 0%,100% { transform:translateY(0) rotate(-4deg); } 50% { transform:translateY(-14px) rotate(4deg); } }
        @keyframes pulseDanger { 0%,100% { transform:scale(1); filter:drop-shadow(0 0 14px #ff3a4e88); } 50% { transform:scale(1.12); filter:drop-shadow(0 0 34px #ff3a4ecc); } }
        @keyframes scan { from { transform:translateX(-120%); } to { transform:translateX(320%); } }
        @keyframes shake { 0%,100% { transform:translateX(0); } 25% { transform:translateX(-5px); } 75% { transform:translateX(5px); } }
        button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        button:active { opacity:.78 !important; transform:scale(.97) !important; }
        ::-webkit-scrollbar { width:3px; } ::-webkit-scrollbar-thumb { background:#1e1e3a; border-radius:4px; }
      `}</style>

      <header style={{ padding: "10px 16px 8px", background: "#060612", borderBottom: "1px solid #101028", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ color: C.accent, fontWeight: 800, fontSize: "0.78rem", letterSpacing: 2 }}>AMR QUEST</span>
            <span style={{ color: C.muted, opacity: .65, fontFamily: "monospace", fontSize: "0.48rem", letterSpacing: 1 }}>
              Powered by: AMR-X
            </span>
          </div>
          <span style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: 1.5 }}>
            {screen === "welcome" ? "THE CHALLENGE" : screen === "howto" ? "YOUR MISSION" : screen === "game" ? "TREATMENT" : "WHAT HAPPENED"}
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 10, background: "#17172d", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${C.accent}, ${C.green})`, boxShadow: `0 0 12px ${C.accent}`, transition: "width .5s ease" }} />
        </div>
      </header>

      <main style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("howto")} />}
        {screen === "howto" && <HowToPlayScreen onDone={() => setScreen("game")} />}
        {screen === "game" && <GameScreen onDone={(result) => { setSummary(result); setScreen("result"); }} />}
        {screen === "result" && <ResultScreen summary={summary} onRestart={restart} />}
      </main>
    </div>
  );
}
