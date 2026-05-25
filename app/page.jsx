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
        padding: "30px",
        background: "#111",
        minHeight: "100vh",
        color: "white"
      }}
    >
      <h1>🚇 MTA Station Index V8</h1>

      <input
        type="text"
        placeholder="Search station..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          marginBottom: "30px",
          borderRadius: "10px",
          border: "none",
          fontSize: "16px"
        }}
      />

      <p>{filteredStations.length} stations found</p>

      {filteredStations.map((station, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #333",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
            background: "#1e1e1e"
          }}
        >
          <h2>{station.name}</h2>

          <p>⭐ Score: {station.score}/100</p>

          <p>📍 Borough: {station.borough}</p>

          <p>🚉 Line: {station.line}</p>
        </div>
      ))}
    </main>
  );
}
