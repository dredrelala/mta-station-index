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
const [location,setLocation]=useState(null);

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

const score=Math.round(

(
reliability*3+
(11-crowding)*2+
accessibility+
transfers
)
/7
*10

);

return{

...station,
score,
reliability,
crowding,
accessibility,
transfers,

distance:
Math.floor(
Math.random()*20
)+1

};

});

setStations(ranked);

}

loadStations();

},[]);

function getLocation(){

navigator.geolocation.getCurrentPosition(

(position)=>{

setLocation({

lat:position.coords.latitude,
lng:position.coords.longitude

});

}

);

}

function toggleFavorite(name){

let updated;

if(favorites.includes(name)){

updated=
favorites.filter(
item=>item!==name
);

}else{

updated=
[...favorites,name];

}

setFavorites(updated);

localStorage.setItem(
"favorites",
JSON.stringify(updated)
);

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

if(location){

return a.distance-b.distance;

}

if(sortBy==="score"){

return b.score-a.score;

}

return 0;

});

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
🚇 MTA Station Index V11
</h1>

<input
placeholder="Search..."
value={search}
onChange={(e)=>
setSearch(e.target.value)
}
style={{
width:"100%",
padding:"15px",
borderRadius:"12px",
marginBottom:"20px"
}}
/>

<button
onClick={getLocation}
style={{
padding:"15px",
marginBottom:"20px"
}}
>

📍 Near Me

</button>

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
background:"#161d2d",
borderRadius:"20px"
}}
>

<h2>

{favorites.includes(
station.name
)
?"⭐":"☆"}

{" "}

{station.name}

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

<p>
⭐ {station.score}/100
</p>

<p>
📍 {station.distance} mins away
</p>

<p>
🧠 {station.reliability}/10
</p>

<p>
👥 {station.crowding}/10
</p>

<p>
♿ {station.accessibility}/10
</p>

</div>

))}

</main>

)

}
