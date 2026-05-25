"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase=createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home(){

const [stations,setStations]=useState([]);
const [search,setSearch]=useState("");
const [favorites,setFavorites]=useState([]);
const [sortBy,setSortBy]=useState("score");
const [borough,setBorough]=useState("All");
const [nearMe,setNearMe]=useState(false);

useEffect(()=>{

const saved=
JSON.parse(
localStorage.getItem("favorites")
)||[];

setFavorites(saved);

async function loadStations(){

const {data}=await supabase
.from("stations")
.select("*");

const ranked=(data||[]).map((station)=>{

const cleanliness=
Math.floor(Math.random()*4)+6;

const reliability=
Math.floor(Math.random()*4)+6;

const crowding=
Math.floor(Math.random()*10)+1;

const accessibility=
station.line?.includes("-")
?9
:7;

const transfers=
station.line?.split("-").length+2 || 3;

const delayScore=
Math.floor(Math.random()*10)+1;

const distance=
Math.floor(Math.random()*20)+1;

const score=Math.round(

(
cleanliness*2+
reliability*3+
(11-crowding)*2+
accessibility+
transfers+
(11-delayScore)
)
/9
*10

);

return{

...station,
cleanliness,
reliability,
crowding,
accessibility,
transfers,
delayScore,
distance,
updated:"Today",
score

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

function toggleFavorite(name){

let updated;

if(
favorites.includes(name)
){

updated=
favorites.filter(
item=>item!==name
);

}else{

updated=[
...favorites,
name
];

}

setFavorites(updated);

localStorage.setItem(
"favorites",
JSON.stringify(updated)
);

}

function status(score){

if(score>=80){
return "🟢 Excellent";
}

if(score>=60){
return "🟡 Good";
}

return "🔴 Weak";

}

function trend(station){

if(station.delayScore>=8){
return "⬆ Delays increasing";
}

if(station.crowding>=8){
return "⬆ Crowding rising";
}

if(station.reliability>=8){
return "⬇ Reliability improving";
}

return "➡ Stable";

}

const filtered=[...stations]

.filter((station)=>{

const matchesSearch=
station.name
?.toLowerCase()
.includes(
search.toLowerCase()
);

const matchesBorough=

borough==="All"
?true
:station.borough===borough;

return matchesSearch
&& matchesBorough;

})

.sort((a,b)=>{

if(nearMe){
return a.distance-b.distance;
}

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
minHeight:"100vh",
padding:"40px",
color:"white"
}}
>

<h1>
🚇 MTA Station Index V15
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
borderRadius:"15px",
marginBottom:"20px"
}}
/>

<div
style={{
display:"flex",
gap:"10px",
marginBottom:"20px",
flexWrap:"wrap"
}}
>

<select
value={sortBy}
onChange={(e)=>
setSortBy(e.target.value)
}
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

<button
onClick={()=>
setNearMe(
!nearMe
)
}
>
📍 Near Me
</button>

</div>

{topStation && (

<div
style={{
padding:"20px",
background:"#1a2038",
borderRadius:"20px",
marginBottom:"20px"
}}
>

<h2>
🏆 Top Ranked Station
</h2>

<h1>
{topStation.name}
</h1>

<p>
⭐ {topStation.score}/100
</p>

<p>
{status(topStation.score)}
</p>

</div>

)}

<p>

{filtered.length}
stations found

</p>

{filtered.map((station,index)=>(

<div
key={index}
style={{
padding:"20px",
marginBottom:"20px",
background:"#151c2e",
borderRadius:"20px"
}}
>

<h2>

{favorites.includes(
station.name
)
?"⭐":"☆"}

{" "}

{index+1}. {station.name}

</h2>

<button
onClick={()=>
toggleFavorite(
station.name
)
}
>
Favorite
</button>

<p>🚉 {station.line}</p>
<p>📍 {station.borough}</p>

<p>⭐ {station.score}/100</p>

<p>{status(station.score)}</p>

<p>📈 {trend(station)}</p>

<p>🧼 Cleanliness: {station.cleanliness}/10</p>
<p>🧠 Reliability: {station.reliability}/10</p>
<p>👥 Crowding: {station.crowding}/10</p>
<p>♿ Accessibility: {station.accessibility}/10</p>
<p>🔁 Transfers: {station.transfers}/10</p>
<p>🚨 Delay Score: {station.delayScore}/10</p>
<p>🕒 Updated: {station.updated}</p>
<p>📍 {station.distance} mins away</p>

</div>

))}

</main>

)

}
