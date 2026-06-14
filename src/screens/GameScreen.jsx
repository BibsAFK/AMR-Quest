import { useState, useEffect, useRef, useCallback } from "react";
import { C } from "../styles/theme";
import { generateSpreadPositions } from "../utils/germUtils";

const TOTAL_GERMS = 18;
const TIMER_SECONDS = 8;
const GERM_SIZE = 52;
const SHIELD_CHANCE = 0.28;
const ESCAPE_CHANCE = 0.18;

function PrimaryButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ border: "none", borderRadius: 14, padding: "14px 25px", background: C.danger, color: "#fff", fontWeight: 800, fontSize: ".92rem", cursor: "pointer", boxShadow: `0 0 24px ${C.danger}44` }}>
      {children}
    </button>
  );
}

export default function GameScreen({ onDone }) {
  const [phase, setPhase] = useState("briefing");
  const [germs, setGerms] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [arenaSize, setArenaSize] = useState({ width: 0, height: 0 });

  const arenaRef = useRef(null);
  const timerRef = useRef(null);
  const spawnedRef = useRef(false);
  const doneRef = useRef(false);
  const germsRef = useRef([]);

  const killed = germs.filter((germ) => !germ.alive).length;
  const alive = TOTAL_GERMS - killed;

  useEffect(() => {
    germsRef.current = germs;
  }, [germs]);

  useEffect(() => {
    if (phase !== "infection" || !arenaRef.current) return;
    const measure = () => {
      if (!arenaRef.current) return;
      const next = { width: arenaRef.current.clientWidth, height: arenaRef.current.clientHeight };
      setArenaSize((current) => current.width === next.width && current.height === next.height ? current : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(arenaRef.current);
    return () => observer.disconnect();
  }, [phase]);

  const finishTreatment = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    clearInterval(timerRef.current);

    const current = germsRef.current;
    const survived = current.filter((germ) => germ.alive).length;
    const summary = { total: TOTAL_GERMS, killed: TOTAL_GERMS - survived, survived };

    if (survived === 0) {
      onDone(summary);
      return;
    }

    setPhase("merging");
    window.setTimeout(() => setPhase("resistant"), 1700);
  }, [onDone]);

  const startTreatment = useCallback(() => {
    doneRef.current = false;
    spawnedRef.current = false;
    germsRef.current = [];
    setGerms([]);
    setArenaSize({ width: 0, height: 0 });
    setTimeLeft(TIMER_SECONDS);
    setPhase("infection");
  }, []);

  useEffect(() => {
    if (phase !== "infection" || spawnedRef.current || arenaSize.width <= 0 || arenaSize.height <= 0) return;

    const positions = generateSpreadPositions(TOTAL_GERMS, arenaSize.width, arenaSize.height, GERM_SIZE);
    const generated = positions.map((position, index) => {
      const roll = Math.random();
      const type = roll < ESCAPE_CHANCE ? "escape" : roll < ESCAPE_CHANCE + SHIELD_CHANCE ? "shield" : "normal";
      return {
        id: `${Date.now()}-${index}`,
        ...position,
        alive: true,
        type,
        hp: type === "shield" ? 2 : 1,
        escaped: false,
        warning: false,
      };
    });

    spawnedRef.current = true;
    germsRef.current = generated;
    const frame = requestAnimationFrame(() => setGerms(generated));
    return () => cancelAnimationFrame(frame);
  }, [phase, arenaSize]);

  useEffect(() => {
    if (phase !== "infection" || germs.length === 0) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timerRef.current);
          window.setTimeout(finishTreatment, 0);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, germs.length, finishTreatment]);

  useEffect(() => {
    if (phase === "infection" && germs.length === TOTAL_GERMS && germs.every((germ) => !germ.alive)) {
      const finishFrame = requestAnimationFrame(finishTreatment);
      return () => cancelAnimationFrame(finishFrame);
    }
  }, [germs, phase, finishTreatment]);

  const findEscapePosition = useCallback((currentGerms, targetId) => {
    const padding = 44;
    for (let attempt = 0; attempt < 120; attempt++) {
      const x = padding + Math.random() * Math.max(1, arenaSize.width - GERM_SIZE - padding * 2);
      const y = padding + Math.random() * Math.max(1, arenaSize.height - GERM_SIZE - padding * 2);
      const free = currentGerms.every((germ) => !germ.alive || germ.id === targetId || Math.hypot(germ.x - x, germ.y - y) > 105);
      if (free) return { x, y };
    }
    return { x: arenaSize.width - GERM_SIZE - padding, y: arenaSize.height / 2 };
  }, [arenaSize]);

  const tapGerm = useCallback((id) => {
    if (phase !== "infection" || doneRef.current) return;

    setGerms((current) => {
      const updated = current.map((germ) => {
        if (germ.id !== id || !germ.alive) return germ;

        if (germ.type === "escape" && !germ.escaped) {
          const position = findEscapePosition(current, id);
          return { ...germ, ...position, escaped: true, warning: true };
        }

        const hp = germ.hp - 1;
        return { ...germ, hp, alive: hp > 0, warning: hp > 0 };
      });
      germsRef.current = updated;
      return updated;
    });

    window.setTimeout(() => {
      setGerms((current) => {
        const updated = current.map((germ) => germ.id === id ? { ...germ, warning: false } : germ);
        germsRef.current = updated;
        return updated;
      });
    }, 360);
  }, [phase, findEscapePosition]);

  if (phase === "briefing") {
    return (
      <section style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 24, background: "radial-gradient(circle at 50% 55%, #251006 0%, #05050e 65%)" }}>
        <div style={{ width: "min(520px, 100%)", textAlign: "center", animation: "popIn .45s both" }}>
          <div style={{ fontSize: "4.5rem", marginBottom: 10 }}>⏱️</div>
          <p style={{ color: C.warn, fontFamily: "monospace", fontSize: ".7rem", letterSpacing: 2 }}>TREATMENT WINDOW IS SHORT</p>
          <h2 style={{ color: C.text, fontSize: "clamp(2rem, 5vw, 3.6rem)", margin: "8px 0 12px" }}>Act before they adapt.</h2>
          <p style={{ color: C.text, opacity: .72, lineHeight: 1.5, marginBottom: 24 }}>Tap fast. Protected bacteria need another dose. Escape bacteria will run.</p>
          <PrimaryButton onClick={startTreatment}>USE THE MEDICINE →</PrimaryButton>
        </div>
      </section>
    );
  }

  const centerX = arenaSize.width / 2 - GERM_SIZE / 2;
  const centerY = arenaSize.height / 2 - GERM_SIZE / 2;
  const timerColor = timeLeft <= 2 ? C.danger : timeLeft <= 4 ? C.warn : C.accent;

  return (
    <section style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 90%, #ff3a4e0a 0%, #05050e 72%)" }}>
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", filter: phase === "resistant" ? "blur(8px) brightness(.48)" : "none", transition: "filter .45s ease" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "9px 16px", background: "#080816", borderBottom: `1px solid ${C.danger}33` }}>
          <div>
            <p style={{ color: C.muted, fontFamily: "monospace", fontSize: ".58rem", letterSpacing: 1.4 }}>TREATMENT EFFECT</p>
            <p style={{ color: C.accent, fontWeight: 800, fontSize: ".82rem" }}>{killed} ELIMINATED</p>
          </div>
          <div style={{ color: timerColor, border: `2px solid ${timerColor}`, background: `${timerColor}10`, borderRadius: 10, minWidth: 70, padding: "3px 12px", textAlign: "center", fontFamily: "'Orbitron',monospace", fontSize: "1.8rem", fontWeight: 900, boxShadow: `0 0 14px ${timerColor}22` }}>{timeLeft}</div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: C.muted, fontFamily: "monospace", fontSize: ".58rem", letterSpacing: 1.4 }}>INFECTION LEFT</p>
            <p style={{ color: alive > 0 ? C.danger : C.green, fontWeight: 800, fontSize: ".82rem" }}>{alive} ACTIVE</p>
          </div>
        </div>

        <div style={{ height: 6, background: "#17172d", overflow: "hidden" }}>
          <div style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%`, height: "100%", background: timerColor, boxShadow: `0 0 12px ${timerColor}`, transition: "width 1s linear, background .3s" }} />
        </div>

        <div style={{ padding: "7px 16px 2px", textAlign: "center", color: phase === "merging" ? C.danger : C.accent, fontFamily: "monospace", fontSize: ".62rem", letterSpacing: 1.8, fontWeight: 700 }}>
          {phase === "merging" ? "WARNING: SURVIVORS ARE MERGING" : "TAP THE BACTERIA BEFORE TIME RUNS OUT"}
        </div>

        <div ref={arenaRef} style={{ flex: 1, position: "relative", overflow: "hidden", margin: 12, borderRadius: 20, border: `1px solid ${C.danger}33`, background: "radial-gradient(circle at center, #08121f 0%, #05050e 100%)" }}>
          {germs.map((germ) => {
            if (!germ.alive && phase !== "infection") return null;
            const isMerging = phase === "merging" && germ.alive;
            const icon = !germ.alive ? "💥" : germ.warning ? "⚠️" : germ.type === "shield" && germ.hp === 2 ? "🛡️" : "🦠";
            return (
              <button
                key={germ.id}
                aria-label={germ.alive ? `${germ.type} bacteria` : "destroyed bacteria"}
                onClick={() => germ.alive && tapGerm(germ.id)}
                style={{
                  position: "absolute",
                  left: isMerging ? centerX : germ.x,
                  top: isMerging ? centerY : germ.y,
                  width: GERM_SIZE,
                  height: GERM_SIZE,
                  padding: 0,
                  borderRadius: "50%",
                  border: germ.alive ? `1.5px solid ${germ.warning ? C.warn : C.danger}66` : "none",
                  background: germ.alive ? `${germ.warning ? C.warn : C.danger}12` : "transparent",
                  display: "grid",
                  placeItems: "center",
                  fontSize: germ.alive ? "1.9rem" : "1.5rem",
                  cursor: germ.alive && phase === "infection" ? "pointer" : "default",
                  transition: isMerging ? "left 1.35s cubic-bezier(.7,0,.3,1), top 1.35s cubic-bezier(.7,0,.3,1), transform 1.35s" : "left .18s ease, top .18s ease",
                  transform: isMerging ? "scale(.35)" : "scale(1)",
                  animation: germ.alive && !isMerging ? "wriggle .65s ease-in-out infinite alternate" : "none",
                  filter: germ.warning ? `drop-shadow(0 0 12px ${C.warn})` : "none",
                  zIndex: germ.warning ? 4 : 2,
                }}
              >
                {icon}
              </button>
            );
          })}

          {phase === "merging" && (
            <div style={{ position: "absolute", left: centerX - 36, top: centerY - 36, width: GERM_SIZE + 72, height: GERM_SIZE + 72, display: "grid", placeItems: "center", borderRadius: "50%", color: C.danger, fontSize: "4.8rem", animation: "pulseDanger .65s ease-in-out infinite", zIndex: 5 }}>☣️</div>
          )}
        </div>
      </div>

      {phase === "resistant" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "grid", placeItems: "center", padding: 20, background: "#02020788", backdropFilter: "blur(6px)", animation: "popIn .4s both" }}>
          <article style={{ width: "min(520px, 100%)", borderRadius: 22, padding: "26px 22px", textAlign: "center", background: "linear-gradient(160deg, #22080d, #0b0b1b)", border: `1px solid ${C.danger}88`, boxShadow: `0 0 70px ${C.danger}33` }}>
            <div style={{ fontSize: "5rem", lineHeight: 1, animation: "pulseDanger 1s infinite" }}>☣️</div>
            <p style={{ color: C.danger, fontFamily: "monospace", fontSize: ".68rem", letterSpacing: 2, marginTop: 14 }}>SUPERBUG CREATED</p>
            <h2 style={{ color: C.text, fontSize: "clamp(1.7rem, 5vw, 2.7rem)", margin: "7px 0 12px" }}>The survivors learned to resist.</h2>
            <p style={{ color: C.text, opacity: .82, lineHeight: 1.5, maxWidth: 430, margin: "0 auto 10px" }}>
              The remaining bacteria survived this medicine. They are now harder for the same treatment to kill.
            </p>
            <p style={{ color: C.warn, fontWeight: 700, fontSize: ".86rem", lineHeight: 1.4, marginBottom: 22 }}>
              Use antibiotics exactly as prescribed. Never skip doses or stop on your own.
            </p>
            <PrimaryButton onClick={() => onDone({ total: TOTAL_GERMS, killed, survived: alive })}>SEE WHAT HAPPENED →</PrimaryButton>
          </article>
        </div>
      )}
    </section>
  );
}
