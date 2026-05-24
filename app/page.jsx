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
    async function fetchStations() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("stations")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          return;
        }

        setStations(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStations();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "30px",
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ fontSize: "42px" }}>
        🚇 MTA Station Index
      </h1>

      {loading ? (
        <p>Loading stations...</p>
      ) : (
        <>
          <h2>{stations.length} stations found</h2>

          {stations.map((station, index) => (
            <div
              key={station.id || index}
              style={{
                borderBottom: "1px solid #444",
                padding: "20px 0"
              }}
            >
              <h2>
                #{index + 1} {station.name}
              </h2>

              <p>
                <strong>Line:</strong>{" "}
                {station.line || "N/A"}
              </p>

              <p>
                <strong>Borough:</strong>{" "}
                {station.borough || "N/A"}
              </p>

              <p>
                <strong>Division:</strong>{" "}
                {station.division || "N/A"}
              </p>
            </div>
          ))}
        </>
      )}
    </main>
  );
}
