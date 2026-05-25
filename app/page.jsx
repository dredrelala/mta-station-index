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

  const filtered = stations.filter((station) =>
    station.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <div
      style={{
        background: "#0b0f19",
        minHeight: "100vh",
        padding: "40px",
        color: "white"
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
        placeholder="Search station..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "12px",
          width: "300px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "none"
        }}
      />

      <p>{filtered.length} stations found</p>

      {filtered.map((station, index) => (

        <div
          key={index}
          style={{
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid #333",
            borderRadius: "20px",
            background: "#141b29"
          }}
        >

          <h2>
            #{index + 1} {station.name}
          </h2>

          <p>🚉 {station.line}</p>

          <p>📍 {station.borough}</p>

          <p>
            ⭐ {station.score || 50}/100
          </p>

          <p>
            🟢 Reliability:
            {station.reliability || 5}/10
          </p>

          <p>
            👥 Crowding:
            {station.crowding || 5}/10
          </p>

          <p>
            ♿ Accessibility:
            {station.accessibility || 5}/10
          </p>

        </div>

      ))}

    </div>

  );

}
