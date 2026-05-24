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

      const stationResponse = await supabase
        .from("stations")
        .select("*");

      const feedResponse = await fetch("/api/stations");
      const feedData = await feedResponse.json();

      const liveFeedCount =
        feedData.feeds.filter(
          feed => feed.status === 200
        ).length;

      const ranked = (stationResponse.data || []).map((station)=>{

        const cleanliness =
          station.cleanliness ?? 7;

        const reliability =
          Math.min(
            10,
            Math.round((liveFeedCount/8)*10)
          );

        const ridership =
          station.ridership ?? 50000;

        const busyness =
          Math.min(
            10,
            Math.max(
              1,
              Math.round(ridership/50000)
            )
          );

        const accessibility =
          station.accessible ? 10 : 6;

        const transfers =
          station.line
            ? station.line.split("-").length + 3
            : 3;

        const score = Math.round(
          (
            cleanliness * .15 +
            reliability * .25 +
            (10-busyness) * .25 +
            accessibility * .20 +
            transfers * .15
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

      ranked.sort((a,b)=>{

        if (b.score !== a.score) {
          return b.score-a.score;
        }

        return a.busyness-b.busyness;
      });

      setStations(ranked);

    }

    loadStations();

  },[]);

  return (

    <main
      style={{
        background:"#111",
        minHeight:"100vh",
        color:"white",
        padding:"40px",
        fontFamily:"Arial"
      }}
    >

      <h1>🚇 MTA Station Index V7</h1>

      <p>{stations.length} stations found</p>

      {stations.map((station,index)=>(

        <div
          key={index}
          style={{
            padding:"30px",
            marginBottom:"20px",
            border:"1px solid #333",
            borderRadius:"20px",
            background:"#1b1b1b"
          }}
        >

          <h2>#{index+1} {station.name}</h2>

          <p>🚇 {station.line}</p>
          <p>📍 {station.borough}</p>

          <h2>⭐ {station.score}/100</h2>

          <p>🧼 {station.cleanliness}/10</p>
          <p>⏱ {station.reliability}/10</p>
          <p>👥 {station.busyness}/10</p>
          <p>♿ {station.accessibility}/10</p>
          <p>🔄 {station.transfers}/10</p>

        </div>

      ))}

    </main>

  );

}
