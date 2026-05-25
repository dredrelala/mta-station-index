"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home(){

const [stations,setStations]=useState([]);
const [search,setSearch]=useState("");
const [sortBy,setSortBy]=useState("score");

useEffect(()=>{

async function loadStations(){

const {data}=await supabase
.from("stations")
.select("*");

const ranked=(data||[]).map((station)=>{

const cleanliness=Math.floor(Math.random()*4)+6;
const reliability=Math.floor(Math.random()*4)+6;
const busyness=Math.floor(Math.random()*10)+1;

const accessibility=
station.line?.includes("-")
? 9
: 7;

const transfers=
station.line?.split("-").length+2 || 3;

const score=Math.round(

(
cleanliness*2+
reliability*3+
(11-busyness)*2+
accessibility+
transfers
)/8*10

);

return{
...station,
score,
cleanliness,
reliability,
busyness,
accessibility,
transfers
};

});

setStations(ranked);

}

loadStations();

},[]);

const filtered=[...stations]
.filter(station=>

station.name
?.toLowerCase()
.includes(search.toLowerCase())

)

.sort((a,b)=>{

if(sortBy==="score"){
return b.score-a.score;
}

if(sortBy==="reliability"){
return b.reliability-a.reliability;
}

if(sortBy==="crowding"){
return a.busyness-b.busyness;
}

return 0;

});

const topStation=filtered[0];

function badge(score){

if(score>=80){
return "🟢 Excellent";
}

if(score>=60){
return "🟡 Good";
}

return "🔴 Needs Improvement";

}

return(

<main
style={{
background:"#0b0f19",
minHeight:"100vh",
padding:"40px",
color:"white"
}}
>

<h1>🚇 MTA Station Index V9</h1>

<input
placeholder="Search station..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
width:"100%",
padding:"15px",
borderRadius:"15px",
marginBottom:"20px"
}}
/>

<select
value={sortBy}
onChange={(e)=>setSortBy(e.target.value)}
style={{
padding:"15px",
borderRadius:"15px",
marginBottom:"30px"
}}
>

<option value="score">
Best Score
</option>

<option value="reliability">
Most Reliable
</option>

<option value="crowding">
Least Crowded
</option>

</select>

{topStation && (

<div
style={{
background:"#1a2038",
padding:"20px",
borderRadius:"20px",
marginBottom:"30px"
}}
>

<h2>🏆 Top Ranked Station</h2>

<h1>{topStation.name}</h1>

<h3>{badge(topStation.score)}</h3>

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
background:"#1b1b1b"
}}
>

<h2>
#{index+1} {station.name}
</h2>

<p>⭐ {station.score}/100</p>

<p>{badge(station.score)}</p>

<p>🧼 Cleanliness: {station.cleanliness}/10</p>
<p>🧠 Reliability: {station.reliability}/10</p>
<p>👥 Crowding: {station.busyness}/10</p>
<p>♿ Accessibility: {station.accessibility}/10</p>
<p>🔁 Transfers: {station.transfers}/10</p>

</div>

))}

</main>

)

}
