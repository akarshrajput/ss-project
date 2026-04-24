"use client";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#030712",
      }}
    >
      {/* Animated Glow Background */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "loader-glow 3s ease-in-out infinite alternate",
        }}
      />

      <div style={{ position: "relative" }}>
        {/* Outer Spinning Ring */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.03)",
            borderTop: "3px solid #6366f1",
            borderRight: "3px solid #2dd4bf",
            animation: "loader-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
          }}
        />

        {/* Inner Pulsing Icon */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.5rem",
            animation: "loader-pulse 1.5s ease-in-out infinite",
          }}
        >
          🎵
        </div>
      </div>

      {/* Loading Text */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "white",
            margin: 0,
            opacity: 0.8,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          Songify
        </p>
        <p
          style={{
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.5)",
            marginTop: "0.5rem",
            animation: "loader-fade 2s ease-in-out infinite",
          }}
        >
          Preparing your musical experience...
        </p>
      </div>
    </div>
  );
}
