import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Home() {
  const { data: stations, error } = await supabase
    .from("stations")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main
        style={{
          background: "#111",
          color: "white",
          minHeight: "100vh",
          padding: "30px"
        }}
      >
        <h1>Error</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "30px"
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations?.length} stations found</p>

      {stations?.map((station, index) => (
        <div
          key={station.id}
          style={{
            borderBottom: "1px solid #444",
            padding: "20px 0"
          }}
        >
          <h2>
            #{index + 1} {station.Name || station.name}
          </h2>

          <p>Line: {station.Line || station.line}</p>
          <p>Borough: {station.Borough || station.borough}</p>
          <p>Division: {station.Division || station.division}</p>
          <p>Score: {station.score || 0}</p>
        </div>
      ))}
    </main>
  );
}
