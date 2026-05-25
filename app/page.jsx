"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // miles

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return (
    R *
    (2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      ))
  );
}

export default function Home() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const [homeStation, setHomeStation] = useState("");
  const [workStation, setWorkStation] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    loadStations();

    try {
      const savedHome = localStorage.getItem("homeStation");
      const savedWork = localStorage.getItem("workStation");

      if (savedHome && savedWork) {
        setHomeStation(savedHome);
        setWorkStation(savedWork);
        setSetupComplete(true);
      }
    } catch (err) {
      console.log(err);
    }

    let watchId;

    if (typeof window !== "undefined" && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });

          setLocationError("");
        },
        (error) => {
          console.log(error);

          setLocationError(
            "Location unavailable"
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError(
        "Geolocation not supported"
      );
    }

    return () => {
      if (
        watchId &&
        navigator.geolocation
      ) {
        navigator.geolocation.clearWatch(
          watchId
        );
      }
    };
  }, []);

  async function loadStations() {
    try {
      const { data, error } =
        await supabase
          .from("stations")
          .select("*");

      if (error) {
        console.log(error);
        return;
      }

      setStations(data || []);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }

  function saveSetup() {
    if (
      !homeStation.trim() ||
      !workStation.trim()
    ) {
      alert(
        "Please choose both stations"
      );
      return;
    }

    localStorage.setItem(
      "homeStation",
      homeStation
    );

    localStorage.setItem(
      "workStation",
      workStation
    );

    setSetupComplete(true);
  }

  const nearby = useMemo(() => {
    if (
      !userLocation ||
      stations.length === 0
    ) {
      return [];
    }

    return stations
      .filter((station) => {
        const lat = parseFloat(
          station.latitude
        );

        const lon = parseFloat(
          station.longitude
        );

        return (
          !isNaN(lat) &&
          !isNaN(lon)
        );
      })

      .map((station) => {
        const miles =
          getDistance(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(
              station.latitude
            ),
            parseFloat(
              station.longitude
            )
          );

        return {
          ...station,
          miles,
          walkingMinutes:
            Math.max(
              1,
              Math.round(
                miles * 20
              )
            )
        };
      })

      .sort(
        (a, b) =>
          a.miles - b.miles
      )

      .slice(0, 5);
  }, [
    stations,
    userLocation
  ]);

  if (loading) {
    return (
      <main
        style={{
          background: "#050505",
          color: "white",
          minHeight: "100vh",
          padding: "30px"
        }}
      >
        Loading...
      </main>
    );
  }

  if (!setupComplete) {
    return (
      <main
        style={{
          background: "#050505",
          color: "white",
          minHeight: "100vh",
          padding: "30px",
          fontFamily:
            "-apple-system"
        }}
      >
        <h1
          style={{
            fontSize: 38
          }}
        >
          🚇 Bloomberg for Transit
        </h1>

        <p
          style={{
            opacity: 0.7,
            marginBottom: 30
          }}
        >
          Build your commute profile
        </p>

        <div
          style={{
            background: "#111",
            borderRadius: 30,
            padding: 25
          }}
        >
          <h2>
            🏠 Home Station
          </h2>

          <select
            value={homeStation}
            onChange={(e) =>
              setHomeStation(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 16,
              marginBottom: 20,
              borderRadius: 15
            }}
          >
            <option value="">
              Select station
            </option>

            {stations.map(
              (station) => (
                <option
                  key={
                    station.id
                  }
                  value={
                    station.name
                  }
                >
                  {station.name}
                </option>
              )
            )}
          </select>

          <h2>
            🏢 Work Station
          </h2>

          <select
            value={workStation}
            onChange={(e) =>
              setWorkStation(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 16,
              marginBottom: 20,
              borderRadius: 15
            }}
          >
            <option value="">
              Select station
            </option>

            {stations.map(
              (station) => (
                <option
                  key={
                    station.id
                  }
                  value={
                    station.name
                  }
                >
                  {station.name}
                </option>
              )
            )}
          </select>

          <button
            onClick={saveSetup}
            style={{
              width: "100%",
              padding: 16,
              border: "none",
              borderRadius: 20,
              background:
                "#2563EB",
              color: "white",
              fontWeight: 700
            }}
          >
            Continue →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        background: "#050505",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
        fontFamily:
          "-apple-system"
      }}
    >
      <h1>
        Good morning 👋
      </h1>

      <div
        style={{
          padding: 30,
          borderRadius: 35,
          marginBottom: 30,
          background:
            "linear-gradient(135deg,#2563EB,#1E1B4B)"
        }}
      >
        <p>
          Your commute
        </p>

        <h2>
          🏠 {homeStation}
        </h2>

        <div
          style={{
            margin: "15px 0"
          }}
        >
          ↓
        </div>

        <h2>
          🏢 {workStation}
        </h2>
      </div>

      {locationError && (
        <p>
          {locationError}
        </p>
      )}

      <h2>
        📍 Nearby Stations
      </h2>

      {nearby.length === 0 ? (
        <p>
          Finding nearby
          stations...
        </p>
      ) : (
        nearby.map(
          (station) => (
            <div
              key={
                station.id
              }
              style={{
                background:
                  "#111",
                padding: 22,
                borderRadius: 25,
                marginBottom: 15
              }}
            >
              <h3>
                {station.name}
              </h3>

              <p>
                📍{" "}
                {
                  station.walkingMinutes
                }{" "}
                min walk
              </p>

              <p>
                ⭐{" "}
                {station.score ??
                  50}
              </p>
            </div>
          )
        )
      )}
    </main>
  );
}
