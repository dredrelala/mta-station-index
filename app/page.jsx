import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Home() {
  const { data } = await supabase
    .from("stations")
    .select("*");

  const stations = data || [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations.length} NYC subway stations</p>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #333",
          borderRadius: "20px"
        }}
      >
        <h2>All Stations</h2>

        {stations.map((station, index) => (
          <div
            key={index}
            style={{
              padding: "15px",
              borderBottom: "1px solid #333"
            }}
          >
         <h3>
  #{index + 1} {station.name}
</h3>

<p>Line: {station.line}</p>

<p>Borough: {station.borough}</p>

<p>Division: {station.division}</p>
            
            <p>Division: {station["Division"]}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
