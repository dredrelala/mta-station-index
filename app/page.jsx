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
      <div>
        Error loading stations: {error.message}
      </div>
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
            #{index + 1} {station.name}
          </h2>

          <p>Line: {station.line}</p>
          <p>Borough: {station.borough}</p>
          <p>Division: {station.Division}</p>
          <p>Score: {station.score}</p>
        </div>
      ))}
    </main>
  );
}
