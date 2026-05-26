"use client";

import { useEffect, useMemo, useState } from "react";
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

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

export default function Home() {
  const [stations, setStations] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStations();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    }
  }, []);

  async function loadStations() {
    const { data, error } = await supabase
      .from("stations")
      .select(`
        id,
        name,
        line,
        borough,
        latitude,
        longitude,
        station_index,
        score,
        cleanliness_score,
        transfer_score,
        delay_score,
        ridership
      `)
      .order("station_index", {
        ascending: false
      });

    if (error) {
      console.log(error);
      return;
    }

    const uniqueStations = [
      ...new Map(
        (data || []).map(station => [
          station.name,
          station
        ])
      ).values()
    ];

    setStations(uniqueStations);
    setLoading(false);
  }

  const nearby = useMemo(() => {
    if (!location || stations.length === 0) {
      return [];
    }

    return stations
      .filter(
        station =>
          station.latitude &&
          station.longitude
      )
      .map(station => ({
        ...station,
        distance: getDistance(
          location.latitude,
          location.longitude,
          Number(station.latitude),
          Number(station.longitude)
        )
      }))
      .sort(
        (a,b)=>
          a.distance-b.distance
      )
      .slice(0,8);

  }, [stations,location]);

  return (
    <main
      style={{
        background:"#050505",
        minHeight:"100vh",
        color:"white",
        padding:"25px",
        fontFamily:"-apple-system"
      }}
    >

      <h1
        style={{
          fontSize:"38px",
          marginBottom:"30px"
        }}
      >
        🚇 Bloomberg for Transit
      </h1>

      <div
        style={{
          background:
          "linear-gradient(135deg,#2563EB,#1E1B4B)",
          padding:"30px",
          borderRadius:"35px",
          marginBottom:"35px"
        }}
      >

        <p style={{opacity:.7}}>
          📍 Your Area
        </p>

        <h1>
          {nearby[0]?.name || "Finding station..."}
        </h1>

        <p>
          {nearby[0]
            ? `${nearby[0].distance.toFixed(1)} miles away`
            : "Getting location..."
          }
        </p>

      </div>

      <h2>
        Nearby Stations
      </h2>

      <br/>

      {loading && (
        <p>
          Loading...
        </p>
      )}

      {nearby.map(
        (station,index)=>(

        <div
          key={station.id}
          style={{
            background:"#111",
            padding:"22px",
            borderRadius:"25px",
            marginBottom:"15px"
          }}
        >

          <h2>
            #{index+1} {station.name}
          </h2>

          <p>
            🚉 {station.line}
          </p>

          <p>
            🏙️ {station.borough}
          </p>

          <p>
            📍 {station.distance.toFixed(2)} miles
          </p>

          <p>
            📊 Station Index: {station.station_index}
          </p>

        </div>

      ))}
    </main>
  );
}
