"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    async function loadStations() {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .limit(20);

      if (error) {
        console.log(error);
        return;
      }

      setStations(data || []);
    }

    loadStations();
  }, []);

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

      <p>{stations.length} stations loaded</p>

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
