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
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setStations(data || []);
    }

    loadStations();
  }, []);

  return (
    <main
      style={{
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations.length} stations found</p>

      {stations.map((station, index) => (
        <div
          key={station.id || index}
          style={{
            borderBottom: "1px solid #444",
            padding: "20px 0"
          }}
        >
          <h2>
            #{index + 1}{" "}
            {station["Stop Name"] || "Unknown Station"}
          </h2>

          <p>
            <strong>Line:</strong>{" "}
            {station["Line"] || "N/A"}
          </p>

          <p>
            <strong>Borough:</strong>{" "}
            {station["Borough"] || "N/A"}
          </p>

          <p>
            <strong>Division:</strong>{" "}
            {station["Division"] || "N/A"}
          </p>

          <p>
            <strong>GTFS Stop ID:</strong>{" "}
            {station["GTFS Stop ID"] || "N/A"}
          </p>
        </div>
      ))}
    </main>
  );
}
