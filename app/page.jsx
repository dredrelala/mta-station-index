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
const [expanded,setExpanded]=useState(null);

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

const delayScore=
Math.floor(Math.random()*10)+1;

const distance=
Math.floor(Math.random()*20)+1;

const waitTime=
Math.floor(Math.random()*10)+1;

const trending=
Math.floor(Math.random()*15)-5;

let transfers=1;

if(station.line){

transfers=
Math.max(
station.line
.toString()
.replace(/[^A-Za-z0-9]/g," ")
.trim()
.split(/\s+/)
.filter(Boolean)
.length,
1
);

}

let accessibility=6;

if(transfers>=6){
accessibility=10;
}else if(transfers>=4){
accessibility=8;
}

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

let service="🟢 Good Service";

if(delayScore>=8){
service="🔴 Major Delays";
}else if(delayScore>=5){
service="🟡 Delays";
}

return{

...station,
cleanliness,
reliability,
crowding,
delayScore,
distance,
waitTime,
trending,
transfers,
accessibility,
service,
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

if(favorites.includes(name)){

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

if(station.trending>0){
return `🔥 +${station.trending}`;
}

return `📉 ${station.trending}`;

}

function renderLineBadges(line){

if(!line) return null;

return line
.toString()
.replace(/[^A-Za-z0-9]/g," ")
.split(/\s+/)
.filter(Boolean)
.map((item,index)=>(

<span
key={index}
style={{
padding:"6px 10px",
marginRight:"6px",
background:"#273f85",
borderRadius:"999px",
fontSize:"12px"
}}
>
{item}
</span>

));

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

const trendingStations=
[...filtered]
.sort((a,b)=>b.trending-a.trending)
.slice(0,3);

return(

<main
style={{
background:"#0b0f19",
minHeight:"100vh",
padding:"40px",
color:"white"
}}
>

<h1
style={{
fontSize:"48px",
marginBottom:"25px"
}}
>
🚇 MTA Station Index V25
</h1>

<input
placeholder="Search station..."
value={search}
onChange={(e)=>
setSearch(e.target.value)
}
style={{
width:"100%",
padding:"18px",
borderRadius:"16px",
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

<button
onClick={()=>
setNearMe(!nearMe)
}
>
📍 Near Me
</button>

</div>

{topStation && (

<div
style={{
padding:"30px",
background:"linear-gradient(135deg,#273f85,#1c2955)",
borderRadius:"20px",
marginBottom:"25px"
}}
>

<h2>🏆 Top Ranked Station</h2>

<h1>{topStation.name}</h1>

<h2 style={{color:"#8BE28B"}}>
⭐ {topStation.score}/100
</h2>

<p>{topStation.service}</p>

</div>

)}

<div
style={{
padding:"20px",
background:"#151c2e",
borderRadius:"20px",
marginBottom:"30px"
}}
>

<h2>🔥 Trending Stations</h2>

{trendingStations.map((s,index)=>(

<p key={index}>
{index+1}. {s.name} {trend(s)}
</p>

))}

</div>

<p>
{filtered.length} stations found
</p>

{filtered.map((station,index)=>(

<div
key={index}
onClick={()=>
setExpanded(
expanded===index
?null
:index
)
}
style={{
padding:"25px",
marginBottom:"20px",
background:"#151c2e",
borderRadius:"20px",
cursor:"pointer"
}}
>

<h2>

{favorites.includes(
station.name
)
?"⭐":"☆"}

{" "}

#{index+1} • {station.name}

</h2>

<button
onClick={(e)=>{

e.stopPropagation();

toggleFavorite(
station.name
)

}}
>

❤️ Favorite

</button>

<p>
⭐ <span style={{
fontSize:"24px",
color:"#8BE28B"
}}>
{station.score}/100
</span>
</p>

<p>{status(station.score)}</p>

<p>{station.service}</p>

<p>{trend(station)}</p>

<div>
{renderLineBadges(
station.line
)}
</div>

{expanded===index && (

<div>

<hr/>

<p>🧼 Cleanliness: {station.cleanliness}/10</p>
<p>🧠 Reliability: {station.reliability}/10</p>
<p>👥 Crowding: {station.crowding}/10</p>
<p>♿ Accessibility: {station.accessibility}/10</p>
<p>🔁 Transfers: {station.transfers}/10</p>
<p>🚨 Delay Score: {station.delayScore}/10</p>
<p>⏱ Wait Time: {station.waitTime} min</p>
<p>📍 Distance: {station.distance} mins away</p>
<p>🕒 Updated: {station.updated}</p>

</div>

)}

</div>

))}

</main>

);

}
