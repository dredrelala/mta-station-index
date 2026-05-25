"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadStations() {
      const res = await fetch("/api/stations");
      const data = await res.json();

      if (data.success) {
        setStations(data.stations);
      }
    }

    loadStations();
  }, []);

  const filtered = stations.filter((station) =>
    station.name?.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  return (
    <main
      style={{
        background:"#0b0f19",
        minHeight:"100vh",
        color:"white",
        padding:"40px"
      }}
    >

      <h1>
        🚇 MTA Station Index V8
      </h1>

      <input
        type="text"
        placeholder="Search station..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        style={{
          width:"300px",
          padding:"12px",
          borderRadius:"10px",
          marginTop:"20px",
          marginBottom:"20px"
        }}
      />

      <p>{filtered.length} stations found</p>

      {filtered.map((station,index)=>(

        <div
          key={index}
          style={{
            padding:"20px",
            marginBottom:"20px",
            border:"1px solid gray",
            borderRadius:"20px"
          }}
        >

          <h2>
            #{index+1} {station.name}
          </h2>

          <p>🚉 {station.line}</p>

          <p>📍 {station.borough}</p>

          <p>⭐ {station.score || 50}/100</p>

        </div>

      ))}

    </main>
  );
}
