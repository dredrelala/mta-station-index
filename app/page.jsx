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

    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });

          console.log(
            "Live location:",
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.log("Location error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
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
    }

    return {
      ...station,
      miles,
      walkingMinutes:
        miles != null
          ? Math.max(1, Math.round(miles * 20))
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
    if (a.miles == null) return 1;
    if (b.miles == null) return -1;

    return a.miles - b.miles;
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
      <h1>🚇 Bloomberg for Transit</h1>

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
            background:"#1b2d72",
            padding:"20px",
            borderRadius:"20px",
            marginBottom:"30px"
          }}
        >
          <h2>📍 Nearest Station</h2>
          <h1>{nearestStation.name}</h1>
          <h3>
            {nearestStation.walkingMinutes ?? "?"}
            {" "}mins away
          </h3>
        </div>
      )}

      <p>{processedStations.length} stations found</p>

      {processedStations.map((station,index)=>(
        <div
          key={station.id}
          style={{
            padding:"20px",
            marginBottom:"20px",
            borderBottom:"1px solid #333"
          }}
        >
          <h2>
            #{index+1} • {station.name}
          </h2>

          <p>⭐ {station.score || 50}/100</p>

          <p>
            📍 {
              station.walkingMinutes != null
              ? `${station.walkingMinutes} mins away`
              : "Finding location..."
            }
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
