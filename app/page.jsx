"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth radius in miles

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function Home() {
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStations();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(
          "Your location:",
          position.coords.latitude,
          position.coords.longitude
        );

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location error:", error);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  async function loadStations() {
    const { data, error } = await supabase
      .from("stations")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setStations(data || []);
  }

  let processedStations = stations.map((station) => {
    let miles = null;
    let walkingMinutes = null;

    if (
      userLocation &&
      station.latitude != null &&
      station.longitude != null
    ) {
      miles = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(station.latitude),
        parseFloat(station.longitude)
      );

      walkingMinutes = Math.round(miles * 20);
    }

    return {
      ...station,
      miles,
      walkingMinutes
    };
  });

  if (search.trim()) {
    processedStations = processedStations.filter((station) =>
      station.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  // nearest first
  processedStations.sort((a, b) => {
    if (a.miles == null) return 1;
    if (b.miles == null) return -1;

    return a.miles - b.miles;
  });

  const topStation = processedStations[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "30px",
      }}
    >
      <h1>🚇 Bloomberg for Transit V27</h1>

      <br />

      <input
        placeholder="Search station..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          marginBottom: "20px"
        }}
      />

      {topStation && (
        <div
          style={{
            padding: "20px",
            borderRadius: "20px",
            background: "#1b2d72",
            marginBottom: "30px"
          }}
        >
          <h2>🏆 Nearest Station</h2>
          <h1>{topStation.name}</h1>
          <h2>
            📍 {topStation.walkingMinutes || "?"} mins away
          </h2>
        </div>
      )}

      <p>{processedStations.length} stations found</p>

      <br />

      {processedStations.map((station, index) => (
        <div
          key={station.id}
          style={{
            padding: "20px",
            marginBottom: "20px",
            borderBottom: "1px solid #333"
          }}
        >
          <h2>
            #{index + 1} • {station.name}
          </h2>

          <p>⭐ {station.score || 50}/100</p>

          <p>🟢 Good Service</p>

          <p>
            📍 {station.walkingMinutes != null
              ? `${station.walkingMinutes} mins away`
              : "Finding location..."}
          </p>

          <p>🧼 Cleanliness: {station.cleanliness || 9}/10</p>

          <p>🧠 Reliability: {station.reliability || 7}/10</p>

          <p>👥 Crowding: {station.crowding || 5}/10</p>

          <p>♿ Accessibility: {station.accessibility || 8}/10</p>

          <p>🔁 Transfers: {station.transfers || 4}/10</p>

          <p>🚨 Delay Score: {station.delay || 3}/10</p>
        </div>
      ))}
    </main>
  );
}
