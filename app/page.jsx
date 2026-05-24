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
        .select("*")
        .limit(20);

      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setStations(data || []);
      }
    }

    loadStations();
  }, []);

  return (
    <main
      style={{
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "30px"
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations.length} stations found</p>

      {stations.map((station) => (
        <div
          key={station["Station ID"]}
          style={{
            border:"1px solid gray",
            padding:"15px",
            marginBottom:"10px",
            borderRadius:"8px"
          }}
        >
          <h2>{station["Stop Name"]}</h2>

          <p>Line: {station["Line"]}</p>

          <p>Borough: {station["Borough"]}</p>

          <p>
            Coordinates:
            {station["GTFS Latitude"]},
            {station["GTFS Longitude"]}
          </p>
        </div>
      ))}
    </main>
  );
}
