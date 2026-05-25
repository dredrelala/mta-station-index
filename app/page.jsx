"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadStations() {
      const res = await fetch("/api/stations");
      const data = await res.json();

      if (data.success) {
        setStations(data.stations);
      }
    }

    loadStations();
  }, []);

  const filtered = stations
    .filter((station) =>
      station.name.toLowerCase().includes(
        search.toLowerCase()
      )
    )
    .sort((a,b)=> b.score-a.score);

  const topStation=filtered[0];

  function scoreColor(score){

    if(score>=80) return "#3ccf4e";
    if(score>=60) return "#ffd43b";
    return "#ff4d4d";
  }

  return (

<main
style={{
background:"#0b0f19",
minHeight:"100vh",
color:"white",
padding:"40px"
}}
>

<h1
style={{
fontSize:"48px",
marginBottom:"20px"
}}
>
🚇 MTA Station Index V8
</h1>

<input
placeholder="Search station..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
width:"100%",
padding:"15px",
fontSize:"18px",
borderRadius:"12px",
marginBottom:"30px"
}}
/>

{topStation && (

<div
style={{
padding:"20px",
marginBottom:"30px",
borderRadius:"20px",
background:"#1a2033"
}}
>

<h2>🏆 Top Ranked Station</h2>

<h1>{topStation.name}</h1>

<p>

⭐ Score:
<span
style={{
color:scoreColor(topStation.score)
}}
>

{topStation.score}/100

</span>

</p>

</div>

)}

<p>{filtered.length} stations found</p>

{filtered.map((station,index)=>(

<div
key={index}
style={{
padding:"20px",
marginBottom:"20px",
borderRadius:"20px",
background:"#151c2e"
}}
>

<h2>

{index+1}. {station.name}

</h2>

<p>🚉 {station.line}</p>

<p>📍 {station.borough}</p>

<p>

⭐ Score:

<span
style={{
color:scoreColor(station.score)
}}
>

{station.score}/100

</span>

</p>

<p>🧠 Reliability: {station.reliability}/10</p>

<p>👥 Crowding: {station.crowding}/10</p>

<p>♿ Accessibility: {station.accessibility}/10</p>

<p>🔁 Transfers: {station.transfers}/10</p>

<p>🚨 Delay Score: {station.delay_score}/10</p>

<p>
🏢 Elevator:
{station.elevator ? " Yes":" No"}
</p>

<p>
🕒 Updated:
{station.updated}
</p>

</div>

))}

</main>

)

}
