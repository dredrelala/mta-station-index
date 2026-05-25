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

const [userLocation,setUserLocation]=useState(null);

useEffect(()=>{

const saved=
JSON.parse(
localStorage.getItem("favorites")
)||[];

setFavorites(saved);

navigator.geolocation.getCurrentPosition(

(position)=>{

setUserLocation({

lat:
position.coords.latitude,

lng:
position.coords.longitude

});

},

()=>{

console.log(
"Location unavailable"
);

}

);

async function loadStations(){

const transitResponse=
await fetch(
"/api/transit"
);

const transitData=
await transitResponse.json();

const {data}=await supabase
.from("stations")
.select("*");

const ranked=(data||[]).map((station)=>{

const live=
transitData.find(
s=>s.name===station.name
);

const delayScore=
live?.delayScore
??3;

const waitTime=
live?.waitTime
??5;

const service=
live?.service
??"🟢 Good Service";

const cleanliness=
Math.floor(Math.random()*4)+6;

const reliability=
Math.floor(Math.random()*4)+6;

const crowding=
Math.floor(Math.random()*10)+1;

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

let distance=
999;

if(

userLocation &&

station.latitude &&

station.longitude

){

distance=

Math.sqrt(

Math.pow(
station.latitude-
userLocation.lat,
2
)

+

Math.pow(
station.longitude-
userLocation.lng,
2
)

)

*69;

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
waitTime,
distance,
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

<h1>
🚇 Bloomberg for Transit V26
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
padding:"25px",
background:"#1c2955",
borderRadius:"20px",
marginBottom:"20px"
}}
>

<h2>
🏆 Top Ranked
</h2>

<h1>
{topStation.name}
</h1>

<h2>
⭐ {topStation.score}/100
</h2>

</div>

)}

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
padding:"20px",
marginBottom:"20px",
background:"#151c2e",
borderRadius:"20px"
}}
>

<h2>
#{index+1}
•
{station.name}
</h2>

<p>
⭐ {station.score}/100
</p>

<p>
{station.service}
</p>

{expanded===index && (

<div>

<hr/>

<p>
📍
{station.distance.toFixed(1)}
miles away
</p>

<p>
⏱ Wait:
{station.waitTime}
min
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
♿ Accessibility:
{station.accessibility}/10
</p>

<p>
🔁 Transfers:
{station.transfers}/10
</p>

</div>

)}

</div>

))}

</main>

);

}
