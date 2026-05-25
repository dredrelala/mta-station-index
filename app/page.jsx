"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {

const [stations,setStations] = useState([]);
const [search,setSearch] = useState("");

useEffect(() => {

async function loadStations(){

const { data } = await supabase
.from("stations")
.select("*");

const ranked = (data || []).map((station)=>{

const cleanliness = Math.floor(Math.random()*4)+6;
const reliability = Math.floor(Math.random()*4)+6;
const busyness = Math.floor(Math.random()*10)+1;

const accessibility =
station.line?.includes("-")
? 9
: Math.floor(Math.random()*10)+1;

const transfers =
station.line?.split("-").length+2 || 3;

const delayScore =
11 - reliability;

const score = Math.round(

(
cleanliness*1.5 +
reliability*2 +
(11-busyness) +
accessibility +
transfers +
delayScore
)
/7
*10

);

return {

...station,

cleanliness,
reliability,
busyness,
accessibility,
transfers,
score

};

});

ranked.sort((a,b)=>b.score-a.score);

setStations(ranked);

}

loadStations();

},[]);

const filtered = stations.filter((station)=>
station.name
?.toLowerCase()
.includes(search.toLowerCase())
);

const topStation = filtered[0];

return(

<main
style={{
background:"#0b0f19",
minHeight:"100vh",
color:"white",
padding:"40px",
fontFamily:"Georgia"
}}
>

<h1
style={{
fontSize:"60px",
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
padding:"18px",
borderRadius:"15px",
fontSize:"18px",
marginBottom:"25px"
}}
/>

{topStation && (

<div
style={{
padding:"25px",
border:"1px solid #333",
borderRadius:"20px",
marginBottom:"30px",
background:"#1b2340"
}}
>

<h2>🏆 Top Ranked Station</h2>

<h1>{topStation.name}</h1>

<h3>
⭐ Score:
<span style={{color:"#59ff90"}}>
{topStation.score}/100
</span>
</h3>

</div>

)}

<p>{filtered.length} stations found</p>

{filtered.map((station,index)=>(

<div
key={index}
style={{
padding:"30px",
marginBottom:"20px",
border:"1px solid #333",
borderRadius:"20px",
background:"#1b1b1b"
}}
>

<h2>
{index+1}. {station.name}
</h2>

<p>🚉 {station.line}</p>

<p>📍 {station.borough}</p>

<h2>
⭐ {station.score}/100
</h2>

<p>🧼 Cleanliness: {station.cleanliness}/10</p>

<p>🧠 Reliability: {station.reliability}/10</p>

<p>👥 Crowding: {station.busyness}/10</p>

<p>♿ Accessibility: {station.accessibility}/10</p>

<p>🔁 Transfers: {station.transfers}/10</p>

</div>

))}

</main>

);

}
