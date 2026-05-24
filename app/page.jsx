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
    async function fetchStations() {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setStations(data || []);
    }

    fetchStations();
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
            #{index + 1} {station.name}
          </h2>

          <p><strong>Line:</strong> {station.line}</p>

          <p><strong>Borough:</strong> {station.borough}</p>

          <p><strong>Division:</strong> {station.division}</p>
        </div>
      ))}
    </main>
  );
}
