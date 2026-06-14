import { C } from "../styles/theme";

const cards = [
  { icon: "💊", title: "YOU HAVE THE MEDICINE", text: "Tap bacteria to apply each dose.", color: C.accent },
  { icon: "🛡️", title: "SOME FIGHT BACK", text: "Protected bacteria need another dose.", color: C.warn },
  { icon: "☣️", title: "SURVIVORS ARE DANGEROUS", text: "Leftovers can adapt and resist treatment.", color: C.danger },
];

export default function HowToPlayScreen({ onDone }) {
  return (
    <section style={{ width: "100%", height: "100%", padding: 24, display: "grid", placeItems: "center", overflowY: "auto", background: "radial-gradient(ellipse at 50% 20%, #09221e 0%, #05050e 68%)" }}>
      <div style={{ width: "min(880px, 100%)", textAlign: "center" }}>
        <p style={{ color: C.green, fontFamily: "monospace", fontSize: ".68rem", letterSpacing: 2, marginBottom: 8 }}>YOUR MISSION</p>
        <h2 style={{ color: C.text, fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: 22 }}>Leave no survivors.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 26 }}>
          {cards.map((card, index) => (
            <article key={card.title} style={{ background: `${card.color}0d`, border: `1px solid ${card.color}44`, borderRadius: 18, padding: "20px 16px", animation: `popIn .45s ${index * .12}s both` }}>
              <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>{card.icon}</div>
              <h3 style={{ color: card.color, fontSize: ".78rem", letterSpacing: 1.2, marginBottom: 8 }}>{card.title}</h3>
              <p style={{ color: C.text, opacity: .8, fontSize: ".88rem", lineHeight: 1.45 }}>{card.text}</p>
            </article>
          ))}
        </div>
        <button onClick={onDone} style={{ border: "none", borderRadius: 14, padding: "15px 28px", background: C.danger, color: "#fff", fontWeight: 800, fontSize: ".95rem", cursor: "pointer", boxShadow: `0 0 24px ${C.danger}44` }}>
          START THE CLOCK →
        </button>
      </div>
    </section>
  );
}
