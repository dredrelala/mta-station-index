"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
 const [stations,setStations]=useState([]);

 useEffect(()=>{

   async function loadStations(){

     const {data}=await supabase
      .from("stations")
      .select("*");

     const ranked=(data||[]).map((station)=>{

      const cleanliness=
      station.cleanliness ||
      ((station.name.length%5)+6);

      const reliability=
      station.ridership
      ? Math.min(10,Math.floor(station.ridership/50000))
      : 5;

      const busyness=
      station.ridership
      ? Math.min(10,Math.floor(station.ridership/60000))
      : 5;

      const accessibility=
      station.accessible ? 10 : 6;

      const transfers=
      station.line
      ? station.line.split("-").length
      : 1;

      const score=Math.round(
       (
        cleanliness*.30+
        reliability*.30+
        (11-busyness)*.20+
        accessibility*.10+
        transfers*.10
       )*10
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

     ranked.sort((a,b)=>b.score-a.score);

     setStations(ranked);

   }

   loadStations();

 },[]);

 return(
 <main style={{
 background:"#111",
 minHeight:"100vh",
 color:"white",
 padding:"40px",
 fontFamily:"Arial"
 }}>

 <h1>🚇 MTA Station Index V6</h1>

 <p>{stations.length} stations found</p>

 {stations.map((station,index)=>(

 <div
 key={index}
 style={{
 padding:"30px",
 marginBottom:"20px",
 border:"1px solid #333",
 borderRadius:"20px",
 background:"#1b1b1b"
 }}
 >

 <h2>#{index+1} {station.name}</h2>

 <p>🚇 {station.line}</p>

 <p>📍 {station.borough}</p>

 <h2>⭐ {station.score}/100</h2>

 <p>🧼 {station.cleanliness}/10</p>
 <p>⏱ {station.reliability}/10</p>
 <p>👥 {station.busyness}/10</p>
 <p>♿ {station.accessibility}/10</p>
 <p>🔄 {station.transfers}/10</p>

 </div>

 ))}

 </main>
 )
}
