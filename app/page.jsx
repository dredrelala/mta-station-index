"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [stations, setStations] = useState([]);
  const [homeStation, setHomeStation] = useState("");
  const [workStation, setWorkStation] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStations();

    const savedHome =
      localStorage.getItem("homeStation");

    const savedWork =
      localStorage.getItem("workStation");

    if (savedHome && savedWork) {
      setHomeStation(savedHome);
      setWorkStation(savedWork);
      setSetupComplete(true);
    }
  }, []);

  async function loadStations() {
    const { data, error } =
      await supabase
        .from("stations")
        .select("*")
        .order("score", {
          ascending: false,
        });

    if (error) {
      console.log(error);
      return;
    }

    setStations(data || []);
  }

  function saveSetup() {
    if (!homeStation || !workStation) {
      alert(
        "Select a home and work station"
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

  const homeData = stations.find(
    (s) => s.name === homeStation
  );

  const nearby = stations
    .filter((station) =>
      station.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .slice(0, 8);

  const commuteScore =
    homeData?.score || 70;

  const scoreColor =
    commuteScore >= 80
      ? "#10B981"
      : commuteScore >= 65
      ? "#F59E0B"
      : "#EF4444";

  if (!setupComplete) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom,#050505,#111827)",
          color: "white",
          padding: "30px",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          🚇 Bloomberg for Transit
        </h1>

        <p
          style={{
            opacity: .7,
            marginBottom: 40,
          }}
        >
          Build your commute profile
        </p>

        <div
          style={{
            background:
              "rgba(255,255,255,.05)",
            backdropFilter:
              "blur(20px)",
            padding: 30,
            borderRadius: 30,
            border:
              "1px solid rgba(255,255,255,.1)"
          }}
        >
          <h3>🏠 Home Station</h3>

          <select
            value={homeStation}
            onChange={(e)=>
              setHomeStation(
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">
              Select Home
            </option>

            {stations.map((station)=>(
              <option
                key={station.id}
                value={station.name}
              >
                {station.name}
              </option>
            ))}
          </select>

          <h3>
            🏢 Work Station
          </h3>

          <select
            value={workStation}
            onChange={(e)=>
              setWorkStation(
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">
              Select Work
            </option>

            {stations.map((station)=>(
              <option
                key={station.id}
                value={station.name}
              >
                {station.name}
              </option>
            ))}
          </select>

          <button
            onClick={saveSetup}
            style={{
              width:"100%",
              padding:18,
              borderRadius:18,
              border:"none",
              background:"#2563EB",
              color:"white",
              fontWeight:700,
              fontSize:18,
              cursor:"pointer",
              marginTop:20
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
        minHeight:"100vh",
        background:
          "linear-gradient(to bottom,#050505,#111827)",
        color:"white",
        padding:"30px",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,sans-serif"
      }}
    >
      <h1
        style={{
          fontSize:38,
          marginBottom:5
        }}
      >
        Good morning 👋
      </h1>

      <p
        style={{
          opacity:.6,
          marginBottom:30
        }}
      >
        Your transit dashboard
      </p>

      <div
        style={{
          padding:30,
          borderRadius:35,
          background:
          "linear-gradient(135deg,#2563EB,#1E1B4B)",
          marginBottom:30
        }}
      >
        <p>Today's commute</p>

        <h2>
          🏠 {homeStation}
        </h2>

        <div
          style={{
            margin:"10px 0"
          }}
        >
          ↓
        </div>

        <h2>
          🏢 {workStation}
        </h2>

        <div
          style={{
            marginTop:30
          }}
        >
          <div
            style={{
              fontSize:65,
              fontWeight:800,
              color:scoreColor
            }}
          >
            {commuteScore}
          </div>

          <div>
            Transit
