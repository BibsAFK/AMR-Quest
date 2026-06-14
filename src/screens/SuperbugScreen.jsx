// src/screens/SuperbugScreen.jsx
import { C } from "../styles/theme";

function Btn({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.danger,
        color: "#fff",
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

export default function SuperbugScreen({ survivors, onContinue }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(circle at center, #2a0406 0%, #05050e 80%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: C.text,
      }}
    >
      <div
        style={{
          fontSize: "7rem",
          marginBottom: 20,
          animation: "pulse 1.2s infinite",
        }}
      >
        ☣️
      </div>

      <h1
        style={{
          color: C.danger,
          marginBottom: 10,
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: "2rem",
          textAlign: "center",
        }}
      >
        SUPERBUG CREATED
      </h1>

      <p
        style={{
          maxWidth: 500,
          textAlign: "center",
          lineHeight: 1.7,
          marginBottom: 20,
          fontSize: "1rem",
        }}
      >
        {survivors === 1
          ? "One bacterium survived treatment. It adapted and became a resistant superbug."
          : `${survivors} bacteria survived treatment. They evolved into a resistant superbug infection.`}
      </p>

      <Btn onClick={onContinue}>Continue →</Btn>
    </div>
  );
}