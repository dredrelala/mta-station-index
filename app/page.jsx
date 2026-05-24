import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Home() {
  const { data } = await supabase
    .from("stations")
    .select("*")
    .order("score", { ascending: false })
    .limit(1);

  const station = data?.[0];

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
      <h1>MTA Station Index 🚇</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #333",
          borderRadius: "20px"
        }}
      >
        <h2>Top Station</h2>
        <p>{station?.name}</p>
        <p>Score: {station?.score}</p>
      </div>
    </main>
  );
}
