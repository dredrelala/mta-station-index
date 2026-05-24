"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations,setStations]=useState([]);

  useEffect(()=>{

    async function loadStations(){

      const res=await fetch("/api/stations");
      const data=await res.json();

      setStations(data.stations || []);

    }

    loadStations();

  },[]);

  return (
    <main style={{
      background:"#111",
      minHeight:"100vh",
      color:"white",
      padding:"30px"
    }}>

      <h1>🚇 MTA Station Index V8</h1>
      <p>{stations.length} stations found</p>

      {stations.map((station,index)=>(

      <div
      key={index}
      style={{
        border:"1px solid #333",
        borderRadius:"20px",
        padding:"20px",
        marginBottom:"20px",
        background:"#1b1b1b"
      }}
      >

      <h2>
      #{index+1} {station.name}
      </h2>

      <p>🚉 {station.line}</p>
      <p>📍 {station.borough}</p>

      <h2>⭐ {station.score}/100</h2>

      <p>🧼 {station.cleanliness}/10</p>
      <p>⏱ Reliability: {station.reliability}/10</p>
      <p>👥 Crowding: {station.crowding}/10</p>
      <p>♿ Accessibility: {station.accessibility}/10</p>
      <p>🔁 Transfers: {station.transfers}/10</p>
      <p>🚨 Delay Score: {station.delayScore}/10</p>
      <p>🏢 Elevator: {station.elevator}</p>
      <p>🕒 Updated: {station.updated}</p>

      </div>

      ))}

    </main>
  );
}
