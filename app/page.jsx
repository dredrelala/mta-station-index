app/page.jsx
export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <h1>MTA Station Index 🚇</h1>

      <p>
        Live NYC subway rankings coming soon.
      </p>

      <div style={{
        marginTop:"20px",
        padding:"20px",
        border:"1px solid #333",
        borderRadius:"20px"
      }}>
        <h2>Top Station</h2>
        <p>Union Square</p>
        <p>Score: 94</p>
      </div>
    </main>
  );
} 
