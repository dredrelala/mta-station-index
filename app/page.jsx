"use client";

import { useEffect,useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase=createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home(){

const [stations,setStations]=useState([]);
const [search,setSearch]=useState("");
const [sortBy,setSortBy]=useState("score");
const [borough,setBorough]=useState("All");

useEffect(()=>{

async function loadStations(){

const {data}=await supabase
.from("stations")
.select("*");

const ranked=(data||[]).map((station)=>{

const cleanliness=Math.floor(Math.random()*4)+6;
const reliability=Math.floor(Math.random()*4)+6;
const crowding=Math.floor(Math.random()*10)+1;
const delayScore=Math.floor(Math.random()*10)+1;

const accessibility=
station.accessibility ?? 7;

const transfers=
station.transfers ?? 3;

const score=Math.round(
(
cleanliness*2+
reliability*3+
(11-crowding)*2+
accessibility+
transfers+
(11-delayScore)
)/9*10
);

return{
...station,
cleanliness,
reliability,
crowding,
delayScore,
score,
updated:"Today"
};

});

setStations(
ranked.sort(
(a,b)=>b.score-a.score
)
);

}

loadStations();

},[]);

function status(score){

if(score>=80) return "🟢 Excellent";
if(score>=60) return "🟡 Good";

return "🔴 Weak";

}

const filtered=[...stations]

.filter(station=>{

const searchMatch=
station.name
?.toLowerCase()
.includes(
search.toLowerCase()
);

const boroughMatch=

borough==="All"
?true
:station.borough===borough;

return searchMatch
&& boroughMatch;

})

.sort((a,b)=>{

if(sortBy==="score"){
return b.score-a.score;
}

if(sortBy==="reliability"){
return b.reliability-a.reliability;
}

if(sortBy==="crowding"){
return a.crowding-b.crowding;
}

return 0;

});

const topStation=
filtered[0];

return(

<main
style={{
background:"#0b0f19",
padding:"40px",
color:"white",
minHeight:"100vh"
}}
>

<h1>
🚇 MTA Station Index V17
</h1>

<input
placeholder="Search station..."
value={search}
onChange={(e)=>
setSearch(e.target.value)
}
style={{
width:"100%",
padding:"15px",
marginBottom:"20px",
borderRadius:"15px"
}}
/>

<div
style={{
display:"flex",
gap:"10px",
marginBottom:"20px"
}}
>

<select
value={sortBy}
onChange={(e)=>
setSortBy(e.target.value)
}
>
<option value="score">Best Score</option>
<option value="reliability">Most Reliable</option>
<option value="crowding">Least Crowded</option>
</select>

<select
value={borough}
onChange={(e)=>
setBorough(e.target.value)
}
>
<option>All</option>
<option>M</option>
<option>Bk</option>
<option>Q</option>
<option>Bx</option>
</select>

</div>

{topStation && (

<div
style={{
padding:"25px",
background:"#1b2340",
borderRadius:"20px",
marginBottom:"20px"
}}
>

<h2>🏆 Top Ranked Station</h2>

<h1>{topStation.name}</h1>

<p>⭐ {topStation.score}/100</p>

</div>

)}

<p>{filtered.length} stations found</p>

{filtered.map((station,index)=>(

<div
key={index}
style={{
padding:"25px",
marginBottom:"20px",
background:"#161d2d",
borderRadius:"20px"
}}
>

<h2>
#{index+1} {station.name}
</h2>

<p>{status(station.score)}</p>

<hr/>

<p>🚉 Line: {station.line || "Unknown"}</p>
<p>📍 Borough: {station.borough || "Unknown"}</p>
<p>🏢 Division: {station.division || "Unknown"}</p>
<p>🆔 Station ID: {station.id || "Unknown"}</p>

<hr/>

<p>⭐ Score: {station.score}/100</p>
<p>🧼 Cleanliness: {station.cleanliness}/10</p>
<p>🧠 Reliability: {station.reliability}/10</p>
<p>👥 Crowding: {station.crowding}/10</p>
<p>🚨 Delay Score: {station.delayScore}/10</p>
<p>♿ Accessibility: {station.accessibility || "Unknown"}</p>
<p>🔁 Transfers: {station.transfers || "Unknown"}</p>

<hr/>

<p>🕒 Updated: {station.updated}</p>

</div>

))}

</main>

)

}
