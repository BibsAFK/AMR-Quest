import { C } from "../styles/theme";

export default function ResultScreen({ summary, onRestart }) {
  const { total, killed, survived } = summary;
  const killedPercent = total > 0 ? Math.round((killed / total) * 100) : 0;

  return (
    <section style={{ width: "100%", height: "100%", overflowY: "auto", padding: "24px 18px 34px", background: "radial-gradient(ellipse at 50% 5%, #071e2a 0%, #05050e 65%)" }}>
      <div style={{ width: "min(880px, 100%)", margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: survived > 0 ? C.warn : C.green, fontFamily: "monospace", fontSize: ".68rem", letterSpacing: 2 }}>WHAT HAPPENED?</p>
        <h1 style={{ color: C.text, fontSize: "clamp(2rem, 5vw, 3.5rem)", margin: "7px 0 20px" }}>
          {survived > 0 ? "Most died. The survivors matter." : "The infection was eliminated."}
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 18 }}>
          <article style={{ background: `${C.green}0d`, border: `1px solid ${C.green}44`, borderRadius: 18, padding: 20, animation: "popIn .4s both" }}>
            <div style={{ fontSize: "2.6rem" }}>💥</div>
            <div style={{ color: C.green, fontFamily: "'Orbitron',monospace", fontSize: "2.2rem", fontWeight: 900, margin: "5px 0" }}>{killed}</div>
            <h2 style={{ color: C.text, fontSize: ".82rem", letterSpacing: 1.2 }}>BACTERIA ELIMINATED</h2>
          </article>
          <article style={{ background: `${survived > 0 ? C.danger : C.green}0d`, border: `1px solid ${survived > 0 ? C.danger : C.green}55`, borderRadius: 18, padding: 20, animation: "popIn .4s .1s both" }}>
            <div style={{ fontSize: "2.6rem" }}>{survived > 0 ? "☣️" : "✅"}</div>
            <div style={{ color: survived > 0 ? C.danger : C.green, fontFamily: "'Orbitron',monospace", fontSize: "2.2rem", fontWeight: 900, margin: "5px 0" }}>{survived}</div>
            <h2 style={{ color: C.text, fontSize: ".82rem", letterSpacing: 1.2 }}>BACTERIA SURVIVED</h2>
          </article>
        </div>

        <div style={{ height: 12, background: "#17172d", borderRadius: 99, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ width: `${killedPercent}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.accent})`, boxShadow: `0 0 14px ${C.green}`, transition: "width .7s ease" }} />
        </div>

        <div style={{ display: "grid", gap: 10, textAlign: "left", marginBottom: 24 }}>
          {[
            { icon: "1", title: "SOME BACTERIA SURVIVED", text: survived > 0 ? `${survived} were still alive when treatment stopped.` : "None survived this treatment.", color: survived > 0 ? C.danger : C.green },
            { icon: "2", title: "SURVIVORS CAN ADAPT", text: "They can become harder for the same medicine to kill.", color: C.warn },
            { icon: "3", title: "THIS IS RESISTANCE", text: "Antimicrobial resistance makes infections harder to treat.", color: C.accent },
          ].map((item, index) => (
            <article key={item.title} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 12, alignItems: "center", padding: "13px 15px", borderRadius: 14, background: C.card, border: `1px solid ${item.color}33`, animation: `popIn .4s ${index * .1}s both` }}>
              <div style={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: "50%", background: `${item.color}18`, color: item.color, fontWeight: 900 }}>{item.icon}</div>
              <div>
                <h3 style={{ color: item.color, fontSize: ".72rem", letterSpacing: 1, marginBottom: 3 }}>{item.title}</h3>
                <p style={{ color: C.text, opacity: .8, fontSize: ".84rem", lineHeight: 1.35 }}>{item.text}</p>
              </div>
            </article>
          ))}
        </div>

        <article style={{ padding: "18px 16px", borderRadius: 18, background: "#061a19", border: `1px solid ${C.green}44`, marginBottom: 22 }}>
          <div style={{ fontSize: "2rem", marginBottom: 5 }}>💊</div>
          <h2 style={{ color: C.green, fontSize: ".78rem", letterSpacing: 1.3, marginBottom: 7 }}>REAL-LIFE TAKEAWAY</h2>
          <p style={{ color: C.text, fontSize: ".95rem", lineHeight: 1.5, maxWidth: 600, margin: "0 auto" }}>
            Use antibiotics only when prescribed, take them exactly as directed, and ask a healthcare professional before changing or stopping treatment.
          </p>
        </article>

        <button onClick={onRestart} style={{ border: "none", borderRadius: 14, padding: "15px 28px", background: C.accent, color: "#031015", fontWeight: 800, fontSize: ".94rem", cursor: "pointer", boxShadow: `0 0 24px ${C.accent}44` }}>
          EXPERIENCE IT AGAIN ↻
        </button>
      </div>
    </section>
  );
}
