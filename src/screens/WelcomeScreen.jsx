import { C } from "../styles/theme";

export default function WelcomeScreen({ onStart }) {
  return (
    <section style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", display: "grid", placeItems: "center", padding: 24, background: "radial-gradient(circle at 50% 42%, #08263a 0%, #070713 48%, #05050e 78%)" }}>
      {[
        ["🦠", "12%", "22%", "0s"],
        ["🦠", "82%", "25%", ".5s"],
        ["🦠", "18%", "74%", "1s"],
        ["🦠", "78%", "78%", "1.5s"],
      ].map(([icon, left, top, delay], index) => (
        <div key={index} style={{ position: "absolute", left, top, fontSize: "2.2rem", opacity: .38, animation: `float 3s ease-in-out ${delay} infinite` }}>{icon}</div>
      ))}

      <div style={{ width: "min(720px, 100%)", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", border: `1px solid ${C.danger}55`, background: "#ff3a4e12", borderRadius: 99, color: C.danger, fontFamily: "monospace", fontSize: ".68rem", letterSpacing: 1.5, marginBottom: 20 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.danger, boxShadow: `0 0 10px ${C.danger}` }} />
          INFECTION DETECTED
        </div>
        <div style={{ fontSize: "clamp(4rem, 10vw, 7rem)", lineHeight: 1, animation: "float 3s ease-in-out infinite", filter: `drop-shadow(0 0 28px ${C.green}55)` }}>🦠</div>
        <h1 style={{ color: C.text, fontSize: "clamp(2.4rem, 7vw, 5.4rem)", lineHeight: .98, fontWeight: 800, letterSpacing: -2, marginTop: 14 }}>
          CAN YOU STOP A <span style={{ color: C.accent }}>SUPERBUG?</span>
        </h1>
        <p style={{ color: C.text, opacity: .75, fontSize: "clamp(.95rem, 2vw, 1.15rem)", lineHeight: 1.5, maxWidth: 510, margin: "18px auto 26px" }}>
          You have the medicine. Treat the infection before surviving bacteria learn to resist it.
        </p>
        <button onClick={onStart} style={{ border: "none", borderRadius: 14, padding: "16px 30px", background: `linear-gradient(135deg, ${C.accent}, ${C.green})`, color: "#031015", fontWeight: 800, fontSize: "1rem", cursor: "pointer", boxShadow: `0 0 28px ${C.accent}55` }}>
          BEGIN TREATMENT →
        </button>
        <p style={{ color: C.muted, fontFamily: "monospace", fontSize: ".62rem", letterSpacing: 1.3, marginTop: 14 }}>A 20-SECOND INTERACTIVE EXPERIENCE</p>
      </div>
    </section>
  );
}
