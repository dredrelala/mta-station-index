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
        .order("name");

      if (error) {
        console.error(error);
        return;
      }

      setStations(data || []);
    }

    fetchStations();
  }, []);

  return (
    <main
      style={{
        background:"#111",
        color:"white",
        minHeight:"100vh",
        padding:"30px"
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations.length} stations found</p>

      <pre
        style={{
          background:"#222",
          padding:"20px",
          whiteSpace:"pre-wrap"
        }}
      >
        {JSON.stringify(stations[0], null, 2)}
      </pre>
    </main>
  );
}
