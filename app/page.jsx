"use client";

export default function Home() {
  return (
    <main
      style={{
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <h1>🚇 MTA Station Index FIXED</h1>

      <p>496 stations found</p>

      <div
        style={{
          borderBottom: "1px solid #444",
          padding: "20px 0"
        }}
      >
        <h2>#1 Times Sq-42 St</h2>

        <p>🚇 Lines: N Q R W 1 2 3 7 S</p>
        <p>📍 Borough: Manhattan</p>
        <p>🏢 Division: IRT</p>

        <h3>⭐ Score: 92/100</h3>

        <p>🧼 Cleanliness: 8/10</p>
        <p>⏱ Reliability: 9/10</p>
        <p>👥 Busyness: 4/10</p>
        <p>♿ Accessibility: 10/10</p>
        <p>🔄 Transfers: 9/10</p>
      </div>
    </main>
  );
}
