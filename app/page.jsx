"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");
  const [borough, setBorough] = useState("All");

  useEffect(() => {
    async function loadStations() {
      try {
        const res = await fetch("/api/stations");
        const data = await res.json();

        const cleanedStations = (data.stations || []).map((station) => ({
          ...station,

          reliability: station.reliability ?? 0,
          crowding: station.crowding ?? 0,
          accessibility: station.accessibility ?? 0,
          transfers: station.transfers ?? 0,
          delay_score: station.delay_score ?? 0,
          elevator: station.elevator ?? "Unknown",
          updated: station.updated ?? "No update",

          score:
            (station.reliability ?? 0) * 4 +
            (station.accessibility ?? 0) * 2 +
            (10 - (station.crowding ?? 0)) * 2 +
            (10 - (station.delay_score ?? 0)) * 2,
        }));

        cleanedStations.sort((a, b) => b.score - a.score);

        setStations(cleanedStations);
      } catch (err) {
        console.log(err);
      }
    }

    loadStations();
  }, []);

  const filteredStations = stations.filter((station) => {
    const matchesSearch = station.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesBorough =
      borough === "All" || station.borough === borough;

    return matchesSearch && matchesBorough;
  });

  return (
    <main
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "white",
        padding: "30px",
      }}
    >
      <h1>🚇 MTA Station Index V8</h1>

      <p>{filteredStations.length} stations found</p>

      <input
        placeholder="Search station..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "10px",
          color: "black",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {[
          "All",
          "Manhattan",
          "Brooklyn",
          "Queens",
          "Bronx",
          "Staten Island",
        ].map((b) => (
          <button
            key={b}
            onClick={() => setBorough(b)}
            style={{
              padding: "8px 15px",
              borderRadius: "10px",
              background:
                borough === b ? "#2563eb" : "#222",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {b}
          </button>
        ))}
      </div>

      {filteredStations.map((station, index) => (
        <div
          key={station.id}
          style={{
            padding: "20px",
            border: "1px solid #333",
            borderRadius: "20px",
            marginBottom: "20px",
            background: "#111",
          }}
        >
          <h2>
            #{index + 1} {station.name}
          </h2>

          <p>🚉 {station.line}</p>
          <p>📍 {station.borough}</p>

          <h3>⭐ {station.score}/100</h3>

          <div>⏱ Reliability: {station.reliability}/10</div>
          <div>👥 Crowding: {station.crowding}/10</div>
          <div>♿ Accessibility: {station.accessibility}/10</div>
          <div>🔄 Transfers: {station.transfers}/10</div>
          <div>🚨 Delay Score: {station.delay_score}/10</div>
          <div>🛗 Elevator: {station.elevator}</div>
          <div>🕒 Updated: {station.updated}</div>

          {(station.crowding >= 8 && (
            <div>⬆ Crowding rising</div>
          )) ||
            (station.delay_score >= 8 && (
              <div>⚠ Delays increasing</div>
            )) ||
            (station.accessibility <= 3 && (
              <div>⚠ Accessibility issue</div>
            ))}
        </div>
      ))}
    </main>
  );
}
