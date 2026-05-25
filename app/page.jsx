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
const [favorites,setFavorites]=useState([]);
const [sortBy,setSortBy]=useState("score");
const [borough,setBorough]=useState("All");

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
?9:7;

const transfers=
station.line?.split("-").length+2 || 3;

const delayScore=
Math.floor(Math.random()*10)+1;

const distance=
Math.floor(Math.random()*20)+1;

const elevator=
Math.random()>.35;

const commuteQuality=
Math.floor(Math.random()*4)+6;

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
elevator,
commuteQuality,
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

function status(score){

if(score>=80){
return "🟢 Excellent";

}else if(score>=60){

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
minHeight:"100vh",
color:"white"
}}
>

<h1>
🚇 MTA Station Index V16
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

</div>

{topStation && (

<div
style={{
padding:"25px",
background:"#1a2038",
borderRadius:"20px",
marginBottom:"25px"
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
{status(
topStation.score
)}
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
padding:"25px",
marginBottom:"20px",
background:"#161d2d",
borderRadius:"20px"
}}
>

<h2>
#{index+1}
{" "}
{station.name}
</h2>

<p>
🚉 Line:
{station.line}
</p>

<p>
📍 Borough:
{station.borough}
</p>

<p>
⭐ Score:
{station.score}/100
</p>

<p>
{status(
station.score
)}
</p>

<p>
📈 Trend:
{trend(
station
)}
</p>

<hr/>

<p>
🧼 Cleanliness:
{station.cleanliness}/10
</p>

<p>
🧠 Reliability:
{station.reliability}/10
</p>

<p>
👥 Crowding:
{station.crowding}/10
</p>

<p>
♿ Accessibility:
{station.accessibility}/10
</p>

<p>
🔁 Transfers:
{station.transfers}/10
</p>

<p>
🚨 Delay:
{station.delayScore}/10
</p>

<p>
🛗 Elevator:
{station.elevator
?"Available"
:"Unavailable"}
</p>

<p>
🧭 Commute Quality:
{station.commuteQuality}/10
</p>

<p>
📍 Distance:
{station.distance}
mins away
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
