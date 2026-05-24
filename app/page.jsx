import { createClient } from "@supabase/supabase-js";

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let stations = [];

  try {
    const { data, error } = await supabase
      .from("stations")
      .select("*")
      .limit(20);

    if (!error && data) {
      stations = data;
    }
  } catch (e) {
    console.log(e);
  }

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

      <p>{stations.length} NYC subway stations found</p>

      {stations.map((station, index) => (
        <div
          key={index}
          style={{
            padding: "15px",
            borderBottom: "1px solid #333"
          }}
        >
          <h3>#{index + 1}</h3>

          <p>Name: {station["Stop Name"] || "Unknown"}</p>
          <p>Line: {station["Line"] || "Unknown"}</p>
          <p>Borough: {station["Borough"] || "Unknown"}</p>
          <p>Division: {station["Division"] || "Unknown"}</p>
        </div>
      ))}
    </main>
  );
}
