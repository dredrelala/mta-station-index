"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3959;

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
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
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
    let distanceMiles = null;

    if (
      userLocation &&
      station.latitude != null &&
      station.longitude != null
    ) {
      distanceMiles = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(station.latitude),
        parseFloat(station.longitude)
      );
    }

    return {
      ...station,
      distanceMiles,
      walkingMinutes:
        distanceMiles != null
          ? Math.max(1, Math.round(distanceMiles * 20))
          : null
    };
  });

  if (search.trim()) {
    processedStations = processedStations.filter((station) =>
      station.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  processedStations.sort((a, b) => {
    if (a.distanceMiles == null) return 1;
    if (b.distanceMiles == null) return -1;

    return a.distanceMiles - b.distanceMiles;
  });

  const nearestStation = processedStations[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "30px"
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

      {nearestStation && (
        <div
          style={{
            padding: "20px",
            borderRadius: "20px",
            background: "#1b2d72",
            marginBottom: "30px"
          }}
        >
          <h2>📍 Nearest Station</h2>

          <h1>{nearestStation.name}</h1>

          <h2>
            {nearestStation.walkingMinutes} mins away
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

          <p>🧠 Reliability: {station.reliability || 9}/10</p>

          <p>♿ Accessibility: {station.accessibility || 8}/10</p>

          <p>🔁 Transfers: {station.transfers || 4}/10</p>

          <p>🚨 Delay: {station.delay || 3}/10</p>
        </div>
      ))}
    </main>
  );
}
