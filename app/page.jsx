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
    loadStations();
  }, []);

  async function loadStations() {
    const { data, error } = await supabase
      .from("stations")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setStations(data || []);
  }

  const filteredStations = stations.filter((station) =>
    station.name?.toLowerCase().includes(search.toLowerCase())
  );

  const topStation = filteredStations[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#0B1020,#111827)",
        color: "white",
        padding: "30px",
        fontFamily: "-apple-system"
      }}
    >
      <h1
        style={{
          fontSize: "52px",
          fontWeight: "800",
          marginBottom: "25px"
        }}
      >
        🚇 MTA Station Index
      </h1>

      <input
        placeholder="Search station..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        style={{
          width:"100%",
          padding:"18px",
          borderRadius:"18px",
          border:"none",
          fontSize:"16px",
          marginBottom:"30px"
        }}
      />

      {topStation && (

        <div
          style={{
            padding:"35px",
            borderRadius:"30px",
            marginBottom:"35px",
            background:
            "linear-gradient(135deg,#2563EB,#4F46E5)"
          }}
        >
          <h3>🏆 Top Ranked Station</h3>

          <h1
          style={{
            fontSize:"42px"
          }}
          >
            {topStation.name}
          </h1>

          <h2>
            ⭐ {topStation.score}/100
          </h2>

        </div>
      )}

      <h3>
        {filteredStations.length} stations found
      </h3>

      {filteredStations.map((station,index)=>(

        <div
        key={station.id}
        style={{
          background:"#1F2937",
          padding:"25px",
          borderRadius:"25px",
          marginTop:"20px"
        }}
        >

        <h2>
          #{index+1} {station.name}
        </h2>

        <p>⭐ Score: {station.score}</p>

        <p>
        🧠 Reliability:
        {station.reliability_score || 5}/10
        </p>

        <p>
        🧼 Cleanliness:
        {station.cleanliness || 5}/10
        </p>

        <p>
        ♿ Accessibility:
        {station.accessibility || 5}/10
        </p>

        <p>
        🚨 Delay:
        {station.delay_score || 5}/10
        </p>

        </div>

      ))}

    </main>
  );
}
