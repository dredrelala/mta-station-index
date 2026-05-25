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

return{

...station,

cleanliness,
reliability,
crowding,
delayScore,
distance,
transfers,
accessibility,
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

if(
station.delayScore>=8
){
return "⬆ Delays increasing";
}

if(
station.crowding>=8
){
return "⬆ Crowding rising";
}

if(
station.reliability>=8
){
return "⬇ Reliability improving";
}

return "➡ Stable";

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
🚇 MTA Station Index V24
</h1>

<input
placeholder="Search station..."
value={search}
onChange={(e)=>
setSearch(
e.target.value
)
}
style={{
width:"100%",
padding:"18px",
borderRadius:"16px",
fontSize:"16px",
marginBottom:"20px"
}}
/>

<div
style={{
display:"flex",
gap:"10px",
flexWrap:"wrap",
marginBottom:"25px"
}}
>

<select
value={sortBy}
onChange={(e)=>
setSortBy(
e.target.value
)
}
style={{
padding:"10px",
borderRadius:"10px"
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

<select
value={borough}
onChange={(e)=>
setBorough(
e.target.value
)
}
style={{
padding:"10px",
borderRadius:"10px"
}}
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
style={{
padding:"10px",
borderRadius:"10px"
}}
>
📍 Near Me
</button>

</div>

{topStation && (

<div
style={{
padding:"35px",
background:
"linear-gradient(135deg,#273f85,#1c2955)",
borderRadius:"25px",
marginBottom:"35px"
}}
>

<h2>
🏆 Top Ranked Station
</h2>

<h1
style={{
fontSize:"44px"
}}
>
{topStation.name}
</h1>

<h2
style={{
color:"#8BE28B"
}}
>
⭐ {topStation.score}/100
</h2>

</div>

)}

<p
style={{
marginBottom:"25px",
fontSize:"18px"
}}
>
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
cursor:"pointer",
transition:"0.2s"

}}

>

<h2>

{favorites.includes(
station.name
)
?"⭐":"☆"}

{" "}

#{index+1}

•

{station.name}

</h2>

<button
onClick={(e)=>{

e.stopPropagation();

toggleFavorite(
station.name
)

}}
style={{
marginBottom:"15px"
}}
>

Favorite

</button>

<p>
⭐
<span
style={{
color:"#8BE28B",
fontWeight:"bold",
fontSize:"24px"
}}
>
{station.score}/100
</span>
</p>

<p>
{status(
station.score
)}
</p>

<p>
📈
{trend(
station
)}
</p>

{expanded===index && (

<div>

<hr/>

<p>
🚉
{station.line}
</p>

<p>
📍
{station.borough}
</p>

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
🚨 Delay Score:
{station.delayScore}/10
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

)}

</div>

))}

</main>

);

}
