import { useState, useEffect, useRef, useCallback } from "react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#05050e",
  card: "#0d0d22",
  accent: "#00e5ff",
  green: "#00f5a0",
  danger: "#ff3a4e",
  warn: "#ffb300",
  blue: "#1e7fff",
  text: "#eeeeff",
  muted: "#6666aa",
};

// ─── Round config: R1=5 germs/8s, R2=6 germs/8s, R3=9 germs/7s ──────────────
const ROUND_CONFIG = [
  { round: 1, label: "ROUND 1", sublabel: "MEDIUM",   color: C.warn,    germCount: 5, secs: 5 },
  { round: 2, label: "ROUND 2", sublabel: "HARD",     color: C.danger,  germCount: 6, secs: 5 },
  { round: 3, label: "ROUND 3", sublabel: "CRITICAL", color: "#ff0033", germCount: 9, secs: 3 },
];

// Max possible score = 5 + 6 + 9 = 20
const MAX_SCORE = ROUND_CONFIG.reduce((s, r) => s + r.germCount, 0);

// ─── Random germ positions — no overlap, stays within arena ──────────────────
function randomGermPositions(count) {
  const positions = [];
  const W = 340, H = 360, SIZE = 64, PAD = 10;
  let attempts = 0;
  while (positions.length < count && attempts < 500) {
    attempts++;
    const x = PAD + Math.random() * (W - SIZE - PAD * 2);
    const y = PAD + Math.random() * (H - SIZE - PAD * 2);
    const overlap = positions.some(p => Math.hypot(p.x - x, p.y - y) < SIZE + 8);
    if (!overlap) positions.push({ x: Math.round(x), y: Math.round(y) });
  }
  return positions;
}

// ─── Global leaderboard ───────────────────────────────────────────────────────
let BOARD = [];

// ════════════════════════════════════════════════════════════════════════════
//  1. WELCOME
// ════════════════════════════════════════════════════════════════════════════
function WelcomeScreen({ onStart }) {
  const [name, setName] = useState("");

  return (
    <Scr bg="radial-gradient(ellipse at 40% 25%, #0a1a3a 0%, #05050e 65%)">
      {/* Powered by — top badge */}
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <span style={{ background: `${C.accent}14`, border: `1px solid ${C.accent}33`, borderRadius: 20, padding: "4px 14px", color: C.accent, fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.68rem", letterSpacing: 2, fontWeight: 600 }}>
          POWERED BY AMR
        </span>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
          fontSize: "2.6rem",
          fontWeight: 800,
          color: C.accent,
          letterSpacing: -0.5,
          lineHeight: 1,
          textShadow: "0 0 40px #00e5ff44",
          textAlign: "center",
        }}>
          AMR QUEST
        </div>
        <div style={{ width: 48, height: 2, background: `linear-gradient(to right, transparent, ${C.accent}, transparent)`, margin: "12px auto 0" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 300, marginBottom: 20 }}>
        <p style={{ color: C.text, fontSize: "0.88rem", marginBottom: 8, textAlign: "center", opacity: 0.75, fontFamily: "'Space Grotesk','DM Sans',sans-serif" }}>
          Enter your name to compete
        </p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onStart(name.trim())}
          placeholder="Your name..."
          maxLength={16}
          autoComplete="off"
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 12,
            border: `2px solid ${name.trim() ? C.accent : "#1e1e3a"}`,
            background: "#0d0d22", color: C.text, fontSize: "1rem",
            fontFamily: "'Space Grotesk','DM Sans',sans-serif",
            outline: "none", textAlign: "center", transition: "border 0.2s",
          }}
        />
      </div>

      <Btn
        disabled={!name.trim()}
        onClick={() => name.trim() && onStart(name.trim())}
        style={{ opacity: name.trim() ? 1 : 0.3, minWidth: 210 }}
      >
        START →
      </Btn>
      <p style={{ color: C.muted, fontSize: "0.65rem", marginTop: 14, fontFamily: "monospace", letterSpacing: 1 }}>
        ~2 MIN · 3 ROUNDS
      </p>
    </Scr>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  2. HOW TO PLAY (replaces slides)
// ════════════════════════════════════════════════════════════════════════════
function HowToPlayScreen({ onDone }) {
  return (
    <Scr bg="radial-gradient(ellipse at 50% 20%, #0a1a0a 0%, #05050e 65%)">
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: "2.8rem", marginBottom: 8 }}>💊</div>
        <h2 style={{ fontFamily: "'Space Grotesk','DM Sans',sans-serif", fontWeight: 700, fontSize: "1.4rem", color: C.accent, marginBottom: 4 }}>
          How to Play
        </h2>
        <p style={{ color: C.muted, fontSize: "0.75rem", fontFamily: "monospace", letterSpacing: 1 }}>
          YOU ARE AN ANTIBIOTIC
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, padding: "0 22px" }}>
        <HTPRow num="1" color={C.accent}   text="You are an antibiotic. Tap the bacteria to destroy them before time runs out." />
        <HTPRow num="2" color={C.warn}     text="Destroy ALL bacteria in a round to complete your antibiotic course." />
        <HTPRow num="3" color={C.danger}   text="Miss even one — it survives, mutates, and becomes a drug-resistant superbug." />
        <HTPRow num="4" color="#ff0033"    text="3 rounds. Each gets harder. Your score = total bacteria destroyed." />
      </div>

      <div style={{ background: "#04101a", borderRadius: 12, padding: "12px 18px", maxWidth: 340, width: "calc(100% - 44px)", marginBottom: 22, border: `1px solid ${C.blue}33` }}>
        <p style={{ color: C.blue, fontSize: "0.78rem", lineHeight: 1.6, margin: 0, textAlign: "center" }}>
          🧬 This is exactly what happens in real life — stopping antibiotics early lets the strongest bacteria survive and become <b>Antimicrobial Resistant (AMR)</b> superbugs.
        </p>
      </div>

      <Btn onClick={onDone} style={{ minWidth: 210, background: C.accent, color: "#000" }}>
        I'M READY →
      </Btn>
    </Scr>
  );
}

function HTPRow({ num, color, text }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.card, borderRadius: 12, padding: "12px 14px", border: `1px solid ${color}22` }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color, fontSize: "0.75rem", fontWeight: 700 }}>
        {num}
      </div>
      <p style={{ color: C.text, fontSize: "0.87rem", lineHeight: 1.55, margin: 0 }}>{text}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  3. GAME
// ════════════════════════════════════════════════════════════════════════════
function GameScreen({ onDone }) {
  const [phase, setPhase] = useState("intro");
  const [roundIdx, setRoundIdx] = useState(0);
  const [roundKills, setRoundKills] = useState([]); // bacteria killed per round
  const [germs, setGerms] = useState([]);
  const [killed, setKilled] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastWin, setLastWin] = useState(null);
  const [lastKilled, setLastKilled] = useState(0);
  const timerRef = useRef(null);
  const doneRef = useRef(false);
  const killedRef = useRef(0);

  const cfg = ROUND_CONFIG[roundIdx];

  const startRound = useCallback((idx) => {
    const c = ROUND_CONFIG[idx];
    doneRef.current = false;
    killedRef.current = 0;
    const positions = randomGermPositions(c.germCount);
    setGerms(positions.map((p, i) => ({ ...p, id: i, alive: true })));
    setKilled(0);
    setTimeLeft(c.secs);
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!doneRef.current) endRound(killedRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function tapGerm(id) {
    if (phase !== "playing" || doneRef.current) return;
    setGerms(g => {
      const target = g.find(x => x.id === id);
      if (!target || !target.alive) return g;
      const updated = g.map(gm => gm.id === id ? { ...gm, alive: false } : gm);
      killedRef.current += 1;
      setKilled(killedRef.current);
      if (killedRef.current >= ROUND_CONFIG[roundIdx].germCount) {
        clearInterval(timerRef.current);
        if (!doneRef.current) endRound(killedRef.current);
      }
      return updated;
    });
  }

  function endRound(k) {
    if (doneRef.current) return;
    doneRef.current = true;
    clearInterval(timerRef.current);
    const c = ROUND_CONFIG[roundIdx];
    const win = k >= c.germCount;
    setLastWin(win);
    setLastKilled(k);
    setRoundKills(prev => [...prev, k]);
    setPhase("roundEnd");
  }

  function nextRound() {
    const next = roundIdx + 1;
    if (next >= ROUND_CONFIG.length) {
      // total = sum of all bacteria killed
      const total = [...roundKills, lastKilled].reduce((a, b) => a + b, 0);
      // But we already pushed lastKilled in setRoundKills above — use roundKills + lastKilled carefully
      // Actually roundKills state update is async, so compute directly:
      onDone([...roundKills].reduce((a, b) => a + b, 0));
      return;
    }
    setRoundIdx(next);
    startRound(next);
  }

  const tc = timeLeft <= 2 ? "#ff0033" : timeLeft <= 4 ? C.warn : C.accent;
  const c = ROUND_CONFIG[roundIdx];

  // ── Intro ──
  if (phase === "intro") return (
    <Scr bg="radial-gradient(ellipse at 50% 60%, #081a08 0%, #05050e 65%)">
      <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>🦠</div>
      <h2 style={{ fontFamily: "'Space Grotesk','DM Sans',sans-serif", fontWeight: 700, fontSize: "1.3rem", color: C.accent, letterSpacing: 1, marginBottom: 6 }}>
        GERM ERADICATION
      </h2>
      <p style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.68rem", letterSpacing: 2, marginBottom: 20 }}>
        3 ROUNDS · TAP TO KILL
      </p>

      <div style={{ width: "100%", maxWidth: 340, background: C.card, borderRadius: 14, padding: "16px 18px", marginBottom: 16, border: "1px solid #1a1a3a", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>🦠</span>
          <p style={{ color: C.text, fontSize: "0.88rem", lineHeight: 1.55, margin: 0 }}>Bacteria will appear on screen across <b style={{ color: C.accent }}>3 rounds</b>. Tap every single one to destroy it.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>⏱️</span>
          <p style={{ color: C.text, fontSize: "0.88rem", lineHeight: 1.55, margin: 0 }}>Each round has a timer. Kill them all before it hits zero.</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>💀</span>
          <p style={{ color: C.text, fontSize: "0.88rem", lineHeight: 1.55, margin: 0 }}>Miss even one and it survives — becoming a <b style={{ color: C.danger }}>resistant superbug</b>.</p>
        </div>
      </div>

      <div style={{ background: "#0d0212", borderRadius: 12, padding: "11px 18px", maxWidth: 340, width: "calc(100% - 44px)", marginBottom: 22, border: `1px solid #ff003322` }}>
        <p style={{ color: C.muted, fontSize: "0.82rem", margin: 0, lineHeight: 1.55, textAlign: "center" }}>
          💊 <b style={{ color: C.text }}>You are the antibiotic.</b> Your score = total bacteria destroyed.
        </p>
      </div>

      <Btn onClick={() => startRound(0)} style={{ minWidth: 210, background: C.danger, color: "#fff" }}>
        START →
      </Btn>
    </Scr>
  );

  // ── Playing ──
  if (phase === "playing") return (
    <div style={{ width: "100%", height: "100%", background: `radial-gradient(ellipse at 50% 90%, ${c.color}08 0%, #05050e 70%)`, display: "flex", flexDirection: "column" }}>
      {/* HUD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 18px", background: "#080816", borderBottom: `1px solid ${c.color}28`, flexShrink: 0 }}>
        <div>
          <div style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.62rem" }}>ROUND {c.round} / 3</div>
        </div>
        <div style={{ background: `${tc}14`, border: `2px solid ${tc}`, borderRadius: 8, padding: "2px 18px", minWidth: 64, textAlign: "center" }}>
          <span style={{ color: tc, fontFamily: "'Orbitron',monospace", fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{timeLeft}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.accent, fontFamily: "monospace", fontSize: "0.78rem" }}>{killed}/{c.germCount} 💀</div>
          <div style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.58rem" }}>DESTROYED</div>
        </div>
      </div>

      {/* Progress pills */}
      <div style={{ display: "flex", gap: 4, padding: "6px 16px", flexShrink: 0 }}>
        {Array.from({ length: c.germCount }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < killed ? C.green : "#1a1a3a", transition: "background 0.15s", boxShadow: i < killed ? `0 0 5px ${C.green}` : "none" }} />
        ))}
      </div>

      {/* YOU ARE THE ANTIBIOTIC banner */}
      <div style={{ padding: "4px 16px", flexShrink: 0, textAlign: "center" }}>
        <span style={{ color: `${C.accent}99`, fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: 2 }}>💊 YOU ARE THE ANTIBIOTIC — TAP TO DESTROY</span>
      </div>

      {/* Arena */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {germs.map(g => (
          <div
            key={g.id}
            onPointerDown={e => { e.preventDefault(); if (g.alive) tapGerm(g.id); }}
            style={{
              position: "absolute",
              left: g.x, top: g.y,
              width: 64, height: 64,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: g.alive ? "2.2rem" : "1.8rem",
              background: g.alive ? `${c.color}12` : "transparent",
              border: g.alive ? `1.5px solid ${c.color}44` : "none",
              cursor: g.alive ? "pointer" : "default",
              userSelect: "none", WebkitUserSelect: "none", touchAction: "none",
              animation: g.alive ? `wriggle ${0.7 + (g.id % 4) * 0.13}s ease-in-out infinite alternate` : "none",
            }}
          >
            {g.alive ? "🦠" : "💥"}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Round End ──
  if (phase === "roundEnd") {
    const survived = c.germCount - lastKilled;
    const isLastRound = roundIdx + 1 >= ROUND_CONFIG.length;
    return (
      <Scr bg={lastWin
        ? "radial-gradient(ellipse at 50% 20%, #042a12 0%, #05050e 65%)"
        : "radial-gradient(ellipse at 50% 20%, #2a0406 0%, #05050e 65%)"}>
        <div style={{ fontSize: "3.8rem", marginBottom: 6, animation: "popIn 0.4s both" }}>
          {lastWin ? "✅" : "☠️"}
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk','DM Sans',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: lastWin ? C.green : C.danger, letterSpacing: 1, marginBottom: 4 }}>
          {lastWin ? "ERADICATED" : "BREACH DETECTED"}
        </h2>
        <span style={{ background: `${c.color}22`, color: c.color, fontFamily: "monospace", fontSize: "0.6rem", letterSpacing: 2, padding: "3px 10px", borderRadius: 4, border: `1px solid ${c.color}44`, marginBottom: 16 }}>
          ROUND {c.round} / 3
        </span>

        {/* Score for this round */}
        <div style={{ background: C.card, borderRadius: 12, padding: "10px 20px", marginBottom: 14, display: "flex", gap: 24, border: `1px solid ${lastWin ? C.green : C.danger}33` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.green, fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "1.6rem" }}>{lastKilled}</div>
            <div style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: 1 }}>KILLED</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: survived > 0 ? C.danger : C.muted, fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "1.6rem" }}>{survived}</div>
            <div style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.58rem", letterSpacing: 1 }}>SURVIVED</div>
          </div>
        </div>

        <div style={{ background: C.card, borderRadius: 12, padding: "12px 16px", marginBottom: 16, borderLeft: `3px solid ${lastWin ? C.green : C.danger}`, maxWidth: 320, width: "calc(100% - 44px)" }}>
          <p style={{ color: C.text, fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
            {lastWin
              ? "All bacteria destroyed. Complete antibiotic course = zero resistance."
              : `${survived} bacteria survived and will mutate into resistant strains. This is AMR in action.`}
          </p>
        </div>

        {/* Round tracker */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {ROUND_CONFIG.map((r, i) => {
            const done = i < roundKills.length;
            const bc = done ? (roundKills[i] >= r.germCount ? C.green : C.danger) : "#2a2a4a";
            return (
              <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", background: done ? (roundKills[i] >= r.germCount ? "#042a12" : "#2a0406") : "#0d0d22", border: `2px solid ${bc}`, color: bc, fontWeight: 700 }}>
                {done ? (roundKills[i] >= r.germCount ? "✓" : "✗") : "·"}
              </div>
            );
          })}
        </div>

        <Btn
          onClick={nextRound}
          style={{ background: lastWin ? C.green : C.warn, color: "#000", minWidth: 200 }}
        >
          {isLastRound ? "See Results →" : `Round ${roundIdx + 2} →`}
        </Btn>
      </Scr>
    );
  }

  return null;
}

// ════════════════════════════════════════════════════════════════════════════
//  4. RESULT
// ════════════════════════════════════════════════════════════════════════════
function ResultScreen({ name, totalKilled, onRestart }) {
  const pct = Math.round((totalKilled / MAX_SCORE) * 100);

  const added = useRef(false);
  if (!added.current) {
    // Add with timestamp so latest always beats older equal scores
    BOARD = [...BOARD, { name, score: totalKilled, ts: Date.now() }]
      .sort((a, b) => b.score !== a.score ? b.score - a.score : b.ts - a.ts)
      .slice(0, 8);
    added.current = true;
  }

  const rank = BOARD.findIndex(e => e.name === name && e.score === totalKilled) + 1;

  let badge, tier, color;
  if (pct >= 90)      { badge = "🏆"; tier = "MASTER";   color = "#ffd700"; }
  else if (pct >= 65) { badge = "🥈"; tier = "EXPERT";   color = C.accent;  }
  else if (pct >= 40) { badge = "🥉"; tier = "LEARNER";  color = C.warn;    }
  else                { badge = "📚"; tier = "NOVICE";   color = C.muted;   }

  return (
    <div style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at 50% 5%, #041a22 0%, #05050e 60%)", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 20px 32px" }}>

      {/* Badge + tier */}
      <div style={{ fontSize: "3.5rem", filter: `drop-shadow(0 0 20px ${color})`, animation: "popIn 0.5s both", marginBottom: 4 }}>{badge}</div>
      <div style={{ fontFamily: "'Space Grotesk','DM Sans',sans-serif", fontWeight: 800, fontSize: "1.6rem", color, letterSpacing: 2, marginBottom: 2 }}>{tier}</div>
      <p style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.72rem", marginBottom: 20, letterSpacing: 1 }}>{name}</p>

      {/* Big score */}
      <div style={{ width: "100%", background: C.card, borderRadius: 18, padding: "20px", marginBottom: 16, border: `2px solid ${color}55`, textAlign: "center" }}>
        <p style={{ color: C.muted, fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: 3, marginBottom: 8 }}>BACTERIA DESTROYED</p>
        <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, lineHeight: 1, letterSpacing: 2 }}>
          <span style={{ fontSize: "4.5rem", color, textShadow: `0 0 30px ${color}88` }}>{totalKilled}</span>
          <span style={{ fontSize: "1.6rem", color: C.muted, fontWeight: 400 }}> / {MAX_SCORE}</span>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1e1e3a" }}>
          {rank > 0 && (
            <span style={{ color: rank === 1 ? "#ffd700" : C.muted, fontFamily: "monospace", fontSize: "0.75rem" }}>
              {rank === 1 ? "🏆 #1 ON THE LEADERBOARD" : `📊 Ranked #${rank}`}
            </span>
          )}
        </div>
      </div>

      {/* Leaderboard top 5 */}
      {BOARD.length > 0 && (
        <div style={{ width: "100%", marginBottom: 16 }}>
          <p style={{ color: C.text, fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: 2, marginBottom: 8 }}>🏅 TOP SCORES</p>
          <div style={{ background: C.card, borderRadius: 14, overflow: "hidden", border: "1px solid #1a1a3a" }}>
            {BOARD.slice(0, 5).map((entry, i) => {
              const isMe = entry.name === name && entry.score === totalKilled;
              const rc = i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : C.muted;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: i < Math.min(BOARD.length, 5) - 1 ? "1px solid #131326" : "none", background: isMe ? "#04200e" : "transparent" }}>
                  <span style={{ color: rc, fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "0.75rem", minWidth: 22 }}>{i + 1}</span>
                  <span style={{ color: isMe ? C.green : C.text, flex: 1, fontSize: "0.88rem", marginLeft: 8, fontWeight: isMe ? 700 : 400 }}>{entry.name}{isMe ? " ←" : ""}</span>
                  <span style={{ color: rc, fontFamily: "monospace", fontWeight: 700, fontSize: "0.82rem" }}>{entry.score}/{MAX_SCORE}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key message */}
      <div style={{ width: "100%", background: "#04101a", borderRadius: 12, padding: "12px 16px", border: `1px solid ${C.blue}33`, marginBottom: 20 }}>
        <p style={{ color: C.blue, fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: 1, marginBottom: 5 }}>KEY TAKEAWAY</p>
        <p style={{ color: C.text, fontSize: "0.83rem", lineHeight: 1.65, margin: 0 }}>
          In real life, <b style={{ color: C.accent }}>you are the antibiotic</b>. Take every dose, complete the full course — leave no bacteria alive to develop resistance.
        </p>
      </div>

      <Btn onClick={onRestart} style={{ background: C.accent, color: "#000", minWidth: 180 }}>🔄 Play Again</Btn>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  APP ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [player, setPlayer] = useState("");
  const [totalKilled, setTotalKilled] = useState(0);

  const STEPS = ["welcome", "howto", "game", "result"];

  return (
    <div style={{ width: "100vw", height: "100dvh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700;800&family=Orbitron:wght@700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Space Grotesk', sans-serif; background: #05050e; }
        @keyframes popIn { from { opacity:0; transform:scale(.9) translateY(14px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes wriggle { from { transform:rotate(-10deg) scale(1); } to { transform:rotate(10deg) scale(1.13); } }
        button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        button:active { opacity:.72 !important; transform:scale(.95) !important; }
        input::placeholder { color:#333366; }
        ::-webkit-scrollbar { width:3px; } ::-webkit-scrollbar-thumb { background:#1e1e3a; border-radius:4px; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 410, height: "100%", maxHeight: 800, background: C.bg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 16px", background: "#060612", borderBottom: "1px solid #101028", flexShrink: 0 }}>
          <span style={{ color: C.accent, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "0.78rem", letterSpacing: 2 }}>AMR QUEST</span>
          <div style={{ display: "flex", gap: 5 }}>
            {STEPS.map((s, i) => {
              const cur = STEPS.indexOf(screen);
              return <div key={s} style={{ width: 6, height: 6, borderRadius: "50%", background: cur >= i ? C.accent : "#1e1e3a", boxShadow: cur === i ? `0 0 6px ${C.accent}` : "none", transition: "all 0.3s" }} />;
            })}
          </div>
          <span style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {screen === "welcome" && (
            <WelcomeScreen onStart={n => { setPlayer(n); setScreen("howto"); }} />
          )}
          {screen === "howto" && (
            <HowToPlayScreen onDone={() => setScreen("game")} />
          )}
          {screen === "game" && (
            <GameScreen onDone={killed => { setTotalKilled(killed); setScreen("result"); }} />
          )}
          {screen === "result" && (
            <ResultScreen
              name={player}
              totalKilled={totalKilled}
              onRestart={() => { setScreen("welcome"); setTotalKilled(0); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  SHARED PRIMITIVES
// ════════════════════════════════════════════════════════════════════════════
function Scr({ children, bg }) {
  return (
    <div style={{ width: "100%", height: "100%", background: bg || C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0 24px", overflowY: "auto", position: "relative" }}>
      {children}
    </div>
  );
}
function Btn({ children, onClick, style, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: C.accent, color: "#000", fontWeight: 700, fontSize: "0.93rem", fontFamily: "'Space Grotesk',sans-serif", border: "none", borderRadius: 12, padding: "13px 24px", cursor: disabled ? "not-allowed" : "pointer", letterSpacing: 0.5, transition: "opacity 0.15s", ...style }}>
      {children}
    </button>
  );
}
function OBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", color: C.muted, fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Space Grotesk',sans-serif", border: "1px solid #1e1e3a", borderRadius: 12, padding: "11px 18px", cursor: "pointer" }}>
      {children}
    </button>
  );
}
function PBar({ val, color }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#0d0d22" }}>
      <div style={{ height: "100%", width: `${val * 100}%`, background: color, transition: "width 0.4s ease", borderRadius: "0 3px 3px 0", boxShadow: `0 0 8px ${color}` }} />
    </div>
  );
}