"use client";

import { useEffect, useState } from "react";

export default function Home() {

const [stations,setStations]=useState([]);
const [search,setSearch]=useState("");

useEffect(()=>{

async function getStations(){

const res=await fetch("/api/stations");
const data=await res.json();

if(data.success){
setStations(data.stations);
}

}

getStations();

},[]);

const filtered=stations.filter(station=>
station.name?.toLowerCase()
.includes(search.toLowerCase())
);

return(

<div style={{
background:"#0b0f19",
minHeight:"100vh",
padding:"40px",
color:"white"
}}>

<h1>🚇 MTA Station Index V8</h1>

<input
placeholder="Search station..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
padding:"10px",
width:"300px",
borderRadius:"10px",
marginBottom:"20px"
}}
/>

<p>{filtered.length} stations found</p>

{filtered.map((station,index)=>(

<div
key={index}
style={{
padding:"20px",
marginBottom:"20px",
border:"1px solid #333",
borderRadius:"20px"
}}
>

<h2>
#{index+1} {station.name}
</h2>

<p>🚉 {station.line}</p>

<p>📍 {station.borough}</p>

<p>⭐ {station.score || 50}/100</p>

</div>

))}

</div>

)

}
