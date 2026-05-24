"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    async function getStations() {
      const { data, error } = await supabase
        .from("stations")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      setStations(data || []);
    }

    getStations();
  }, []);

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "white",
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
            borderBottom: "1px solid #333",
            padding: "20px 0"
          }}
        >
          <h2>
            #{index + 1}{" "}
            {station.name || station["Stop Name"]}
          </h2>

          <p>
            <strong>Line:</strong>{" "}
            {station.line || station["Line"]}
          </p>

          <p>
            <strong>Borough:</strong>{" "}
            {station.borough || station["Borough"]}
          </p>

          <p>
            <strong>Division:</strong>{" "}
            {station.Division}
          </p>
        </div>
      ))}
    </div>
  );
}
