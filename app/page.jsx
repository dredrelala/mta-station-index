"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [stations, setStations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadStations() {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .limit(20);

      if (error) {
        console.log(error);
        setErrorMessage(JSON.stringify(error));
        return;
      }

      setStations(data || []);
    }

    loadStations();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations.length} stations found</p>

      {errorMessage && (
        <div
          style={{
            padding: "15px",
            border: "1px solid red",
            marginBottom: "20px"
          }}
        >
          Error: {errorMessage}
        </div>
      )}

      {stations.map((station, index) => (
        <div
          key={index}
          style={{
            padding: "15px",
            borderBottom: "1px solid #333"
          }}
        >
          <h3>
            #{index + 1} {station["Stop Name"]}
          </h3>

          <p>Line: {station["Line"]}</p>
          <p>Borough: {station["Borough"]}</p>
          <p>Division: {station["Division"]}</p>
        </div>
      ))}
    </main>
  );
}
