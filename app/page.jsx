import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Home() {
  const { data: stations, error } = await supabase
    .from("stations")
    .select("*")
    .limit(50);

  return (
    <main
      style={{
        padding: "30px",
        background: "#111",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations?.length || 0} stations found</p>

      {error && (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      )}

      {stations?.map((station) => (
        <div
          key={station.id}
          style={{
            border: "1px solid #444",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "10px",
          }}
        >
          <h3>
            {station["Stop Name"] || "Unknown Station"}
          </h3>

          <p>Line: {station.Line}</p>
          <p>Borough: {station.Borough}</p>
          <p>Division: {station.Division}</p>
        </div>
      ))}
    </main>
  );
}
