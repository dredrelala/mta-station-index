"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getStations() {
      try {
        const res = await fetch("/api/stations");
        const data = await res.json();

        if (data.success) {
          setStations(data.stations);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getStations();
  }, []);

  const filteredStations = stations.filter((station) =>
    station.name?.toLowerCase().includes(search.toLowerCase())
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
      <h1 style={{ marginBottom: "20px" }}>
        🚇 MTA Station Index V8
      </h1>

      <input
        type="text"
        placeholder="Search station..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          marginBottom: "25px",
          fontSize: "16px"
        }}
      />

      <p>{filteredStations.length} stations found</p>

      {filteredStations.map((station, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #333",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "25px",
            background: "#1a1f2e"
          }}
        >
          <h2>{index + 1}. {station.name}</h2>

          <p>🚉 {station.line}</p>
          <p>📍 {station.borough}</p>

          <h3>⭐ {station.score}/100</h3>

          <p>🧠 Reliability: {station.reliability}/10</p>
          <p>👥 Crowding: {station.crowding}/10</p>
          <p>♿ Accessibility: {station.accessibility}/10</p>
          <p>🔁 Transfers: {station.transfers}/10</p>
          <p>🚨 Delay Score: {station.delay_score}/10</p>

          <p>
            🛗 Elevator:{" "}
            {station.elevator ? "Yes" : "No"}
          </p>

          <p>
            🕒 Updated:{" "}
            {station.updated || "N/A"}
          </p>
        </div>
      ))}
    </main>
  );
}
