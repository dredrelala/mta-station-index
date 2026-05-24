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

      const enhancedStations = (data || []).map((station) => {

        const cleanliness =
          Math.floor(Math.random() * 4) + 6;

        const reliability =
          Math.floor(Math.random() * 4) + 6;

        const busyness =
          Math.floor(Math.random() * 10) + 1;

        const accessibility =
          station.division === "IRT" ? 8 : 6;

        const transfers =
          station.line
            ? station.line.split("-").length
            : 1;

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
          cleanliness_score: cleanliness,
          reliability_score: reliability,
          busyness_score: busyness,
          accessibility_score: accessibility,
          transfer_score: transfers,
          score
        };
      });

      enhancedStations.sort(
        (a,b) => b.score - a.score
      );

      setStations(enhancedStations);
    }

    fetchStations();
  }, []);

  return (
    <main
      style={{
        background:"#111",
        color:"white",
        minHeight:"100vh",
        padding:"40px",
        fontFamily:"Arial"
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations.length} stations found</p>

      {stations.map((station,index)=>(

        <div
          key={station.id || index}
          style={{
            borderBottom:"1px solid #444",
            padding:"20px 0"
          }}
        >
          <h2>
            #{index+1} {station.name}
          </h2>

          <p>Line: {station.line}</p>

          <p>Borough: {station.borough}</p>

          <p>Division: {station.division}</p>

          <p>
            ⭐ Score: {station.score}/100
          </p>

          <p>
            🧼 Cleanliness:
            {station.cleanliness_score}/10
          </p>

          <p>
            ⏱ Reliability:
            {station.reliability_score}/10
          </p>

          <p>
            👥 Busyness:
            {station.busyness_score}/10
          </p>

          <p>
            ♿ Accessibility:
            {station.accessibility_score}/10
          </p>

          <p>
            🚇 Transfers:
            {station.transfer_score}/10
          </p>

        </div>

      ))}
    </main>
  );
}
