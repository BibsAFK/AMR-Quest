// src/screens/MutationScreen.jsx
import { C } from "../styles/theme";

function Scr({ children, bg }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bg || C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 0 24px",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.accent,
        color: "#000",
        fontWeight: 700,
        fontSize: "0.93rem",
        fontFamily: "'Space Grotesk',sans-serif",
        border: "none",
        borderRadius: 12,
        padding: "13px 24px",
        cursor: "pointer",
        letterSpacing: 0.5,
        transition: "opacity 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default function MutationScreen({ survived, onContinue }) {
  let msg;
  if (survived === 1) {
    msg = "One bacterium survived treatment and adapted.";
  } else if (survived <= 3) {
    msg = "Several bacteria survived and began developing resistance.";
  } else {
    msg = "Many bacteria survived treatment. Resistance is spreading rapidly.";
  }

  return (
    <Scr bg="radial-gradient(circle at center, #240204 0%, #05050e 70%)">
      <div style={{ fontSize: "5rem", marginBottom: 20 }}>☣️</div>
      <h2 style={{ color: C.danger, marginBottom: 16, textAlign: "center" }}>MUTATION DETECTED</h2>
      <p
        style={{
          maxWidth: 420,
          textAlign: "center",
          color: C.text,
          lineHeight: 1.7,
          marginBottom: 16,
        }}
      >
        {msg}
      </p>
      <p
        style={{
          maxWidth: 420,
          textAlign: "center",
          color: C.warn,
          fontSize: "0.9rem",
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        Future rounds may contain resistant bacteria that are harder to eliminate.
      </p>
      <Btn onClick={onContinue} style={{ background: C.danger, color: "#fff" }}>
        Continue →
      </Btn>
    </Scr>
  );
}