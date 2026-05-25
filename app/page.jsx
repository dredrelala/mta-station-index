"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // miles

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function Home() {
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStations();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        console.log("Location permission denied");
      }
    );
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
    setLoading(false);
  }

  const stationsWithDistance = stations.map((station) => {
    let distance = null;

    if (
      userLocation &&
      station.latitude &&
      station.longitude
    ) {
      distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        Number(station.latitude),
        Number(station.longitude)
      );
    }

    return {
      ...station,
      distance,
    };
  });

  stationsWithDistance.sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });

  const topStation = stations[0];

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        Loading stations...
      </div>
    );
  }

  return (
    <main
      style={{
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <h1>🚇 Bloomberg for Transit V27</h1>

      <br />

      {topStation && (
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "#1f2f6f",
            marginBottom: "30px",
          }}
        >
          <h2>🏆 Top Ranked Station</h2>

          <h1>{topStation.name}</h1>

          <h2>⭐ {topStation.score}/100</h2>
        </div>
      )}

      <p>{stations.length} stations found</p>

      <br />

      {stationsWithDistance.map((station, index) => (
        <div
          key={station.id}
          style={{
            padding: "20px",
            marginBottom: "20px",
            borderBottom: "1px solid #444",
          }}
        >
          <h2>
            #{index + 1} • {station.name}
          </h2>

          <p>⭐ {station.score}/100</p>

          <p>🟢 Good Service</p>

          <p>
            📍{" "}
            {station.distance
              ? `${station.distance.toFixed(1)} miles away`
              : "Calculating distance..."}
          </p>

          <p>⏱ Wait: 5 min</p>

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
