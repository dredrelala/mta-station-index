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
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      const cleanedStations = data.map((station) => ({
        id: station.id,
        name: station.name || station.Name || "",
        line: station.line || station.Line || "",
        borough: station.borough || station.Borough || "",
        division: station.division || station.Division || "",
        score: station.score || station.Score || ""
      }));

      setStations(cleanedStations);
    }

    loadStations();
  }, []);

  return (
    <main
      style={{
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations.length} stations found</p>

      {stations.map((station, index) => (
        <div
          key={station.id}
          style={{
            padding: "20px 0",
            borderBottom: "1px solid #444",
          }}
        >
          <h2>
            #{index + 1} {station.name}
          </h2>

          <p><strong>Line:</strong> {station.line}</p>
          <p><strong>Borough:</strong> {station.borough}</p>
          <p><strong>Division:</strong> {station.division}</p>
          <p><strong>Score:</strong> {station.score}</p>
        </div>
      ))}
    </main>
  );
}
