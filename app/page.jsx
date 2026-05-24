"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations,setStations]=useState([]);
  const [search,setSearch]=useState("");
  const [borough,setBorough]=useState("All");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{

    async function loadStations(){

      try{
        const res=await fetch("/api/stations");
        const data=await res.json();

        if(data.success){
          setStations(data.stations);
        }

      }catch(err){
        console.log(err);
      }

      setLoading(false);
    }

    loadStations();

  },[]);

  const filtered=stations.filter(station=>{

    const searchMatch=
      station.name?.toLowerCase()
      .includes(search.toLowerCase());

    const boroughMatch=
      borough==="All"
      ? true
      : station.borough===borough;

    return searchMatch && boroughMatch;

  });

  return(

<div
style={{
background:"#0b0f19",
minHeight:"100vh",
padding:"40px",
color:"white"
}}
>

<h1
style={{
fontSize:"50px",
marginBottom:"10px"
}}
>
🚇 MTA Station Index V8
</h1>

<p>{filtered.length} stations found</p>

<div
style={{
display:"flex",
gap:"10px",
marginBottom:"30px"
}}
>

<input
placeholder="Search station..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
padding:"12px",
width:"300px",
borderRadius:"10px"
}}
/>

<select
value={borough}
onChange={(e)=>setBorough(e.target.value)}
style={{
padding:"12px",
borderRadius:"10px"
}}
>

<option>All</option>
<option>Bk</option>
<option>Manhattan</option>
<option>Queens</option>
<option>Bronx</option>

</select>

</div>

{loading && <p>Loading...</p>}

{filtered.map((station,index)=>(

<div
key={index}
style={{
padding:"20px",
marginBottom:"20px",
border:"1px solid #333",
borderRadius:"20px",
background:"#141b29"
}}
>

<h2>
#{index+1} {station.name}
</h2>

<p>🚉 {station.line}</p>

<p>📍 {station.borough}</p>

<p>
⭐ {station.score || 50}/100
</p>

<p>
🟢 Reliability:
{station.reliability || 5}/10
</p>

<p>
👥 Crowding:
{station.crowding || 5}/10
</p>

<p>
♿ Accessibility:
{station.accessibility || 5}/10
</p>

</div>

))}

</div>

);

}
