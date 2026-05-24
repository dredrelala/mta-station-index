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
        console.log(error);
        return;
      }

      const ranked = (data || []).map((station) => {

        const cleanliness =
          station.cleanliness ?? 7;

        const reliability =
          station.reliability ?? 7;

        const busyness =
          station.busyness ?? 5;

        const accessibility =
          station.accessibility ??
          (station.division === "IRT" ? 9 : 7);

        const transfers =
          station.line
            ? station.line.split("-").length + 3
            : 3;

        const score = Math.round(
          (
            cleanliness * 0.30 +
            reliability * 0.25 +
            (10 - busyness) * 0.20 +
            accessibility * 0.15 +
            transfers * 0.10
          ) * 10
        );

        return {
          ...station,
          score,
          cleanliness,
          reliability,
          busyness,
          accessibility,
          transfers
        };
      });

      ranked.sort((a, b) => b.score - a.score);

      setStations(ranked);
    }

    loadStations();
  }, []);

  return (
    <main
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <h1>🚇 MTA Station Index V3</h1>

      <p>{stations.length} stations found</p>

      {stations.map((station, index) => (
        <div
          key={station.id || index}
          style={{
            padding: "30px",
            marginBottom: "20px",
            border: "1px solid #333",
            borderRadius: "20px",
            background: "#1b1b1b"
          }}
        >
          <h2>
            #{index + 1} {station.name}
          </h2>

          <p>🚇 {station.line}</p>

          <p>
            📍 {station.borough || "NYC"}
          </p>

          <h2>
            ⭐ {station.score}/100
          </h2>

          <p>🧼 {station.cleanliness}/10</p>
          <p>⏱ {station.reliability}/10</p>
          <p>👥 {station.busyness}/10</p>
          <p>♿ {station.accessibility}/10</p>
          <p>🔄 {station.transfers}/10</p>

          <p
            style={{
              color: "#888",
              fontSize: "12px",
              marginTop: "20px"
            }}
          >
            Updated:{" "}
            {station.updated_at
              ? new Date(
                  station.updated_at
                ).toLocaleString()
              : new Date()
                  .toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  );
}
