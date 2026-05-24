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
      <h1>🚇 MTA Station Index V3</h1>

      <div
        style={{
          padding: "30px",
          border: "1px solid #444",
          borderRadius: "20px",
          marginTop: "20px"
        }}
      >
        <h2>#1 Times Sq–42 St</h2>

        <p>🚇 Lines: N Q R W 1 2 3 7 S</p>
        <p>📍 Borough: Manhattan</p>
        <p>🏢 Division: IRT</p>

        <h2>⭐ Score: 92/100</h2>

        <p>🧼 Cleanliness: 8/10</p>
        <p>⏱ Reliability: 9/10</p>
        <p>👥 Busyness: 4/10</p>
        <p>♿ ADA: 10/10</p>
        <p>🔄 Transfers: 9/10</p>
      </div>
    </main>
  );
}
