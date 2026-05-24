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

      <p>NYC Subway Rankings</p>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #333",
          borderRadius: "20px"
        }}
      >
        <h2>Station Rankings</h2>

        {stations.map((station,index) => (
          <div
            key={station.id}
            style={{
              padding: "15px",
              borderBottom: "1px solid #333"
            }}
          >
            <h3>
              #{index + 1} {station["Stop Name"]}
            </h3>

            <p>Line: {station.Line}</p>

            <p>Borough: {station.Borough}</p>

          </div>
        ))}
      </div>
    </main>
  );
}
