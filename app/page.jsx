"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStations() {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .limit(20);

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (!error && data) {
        setStations(data);
      }

      setLoading(false);
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>{stations.length} stations found</p>

          {stations.map((station, index) => (
            <div
              key={index}
              style={{
                border: "1px solid gray",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "10px"
              }}
            >
              <h2>
                {station["Stop Name"] ||
                  station.name ||
                  "Unknown Station"}
              </h2>

              <p>
                Line:{" "}
                {station["Line"] ||
                  station.line ||
                  "N/A"}
              </p>

              <p>
                Borough:{" "}
                {station["Borough"] ||
                  station.borough ||
                  "N/A"}
              </p>

              <p>
                Coordinates:{" "}
                {(station["GTFS Latitude"] ||
                  station.latitude ||
                  "N/A")}
                {" , "}
                {(station["GTFS Longitude"] ||
                  station.longitude ||
                  "N/A")}
              </p>
            </div>
          ))}
        </>
      )}
    </main>
  );
}
