"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadStations() {
      const { data } = await supabase
        .from("stations")
        .select("*");

      const ranked = (data || [])
        .map((station) => {
          const cleanliness = Math.floor(Math.random() * 4) + 6;
          const reliability = Math.floor(Math.random() * 4) + 6;
          const busyness = Math.floor(Math.random() * 10) + 1;

          const accessibility =
            station.division === "IRT" ? 9 : 7;

          const transfers =
            station.line
              ? station.line.split("-").length + 3
              : 3;

          const score = Math.round(
            cleanliness * 3 +
            reliability * 3 +
            (11 - busyness) * 2 +
            accessibility +
            transfers
          );

          return {
            ...station,
            score: Math.min(score, 100),
            cleanliness,
            reliability,
            busyness,
            accessibility,
            transfers
          };
        })
        .sort((a, b) => b.score - a.score);

      setStations(ranked);
    }

    loadStations();
  }, []);

  const filteredStations = stations.filter(
    (station) =>
      station.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <main
      style={{
        background: "#0b0f19",
        minHeight: "100vh",
        color: "white",
        padding: "40px"
      }}
    >
      <h1
        style={{
          fontSize: "50px",
          marginBottom: "20px"
        }}
      >
        🚇 MTA Station Index V8
      </h1>

      <input
        type="text"
        placeholder="Search station..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "20px",
          fontSize: "16px"
        }}
      />

      <p>{filteredStations.length} stations found</p>

      {filteredStations.map((station, index) => (
        <div
          key={index}
          style={{
            padding: "30px",
            marginBottom: "20px",
            border: "1px solid #333",
            borderRadius: "20px",
            background: "#1b1b1b"
          }}
        >
          <h2>
            {index + 1}. {station.name}
          </h2>

          <p>🚉 {station.line}</p>
          <p>📍 {station.borough}</p>

          <h2>⭐ {station.score}/100</h2>

          <p>🧼 Reliability: {station.cleanliness}/10</p>
          <p>🧠 Reliability: {station.reliability}/10</p>
          <p>👥 Crowding: {station.busyness}/10</p>
          <p>♿ Accessibility: {station.accessibility}/10</p>
          <p>🔁 Transfers: {station.transfers}/10</p>
        </div>
      ))}
    </main>
  );
}
