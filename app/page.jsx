"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function scoreColor(score){
 if(score >= 85) return "#34C759";
 if(score >= 70) return "#FFCC00";
 return "#FF453A";
}

export default function Home() {
 const [stations,setStations] = useState([]);
 const [search,setSearch] = useState("");

 useEffect(()=>{
   loadStations();
 },[]);

 async function loadStations(){
   const {data,error} = await supabase
   .from("stations")
   .select("*");

   if(error){
     console.log(error);
     return;
   }

   setStations(data || []);
 }

 let filtered = stations;

 if(search.trim()){
   filtered = filtered.filter((station)=>
    station.name?.toLowerCase()
    .includes(search.toLowerCase())
   );
 }

 filtered.sort((a,b)=>(b.score||50)-(a.score||50));

 const featured = filtered[0];

 return (
   <main
   style={{
     minHeight:"100vh",
     background:"#0B0B0D",
     color:"white",
     padding:"24px",
     fontFamily:"-apple-system"
   }}
   >

   <h1
   style={{
     fontSize:"34px",
     fontWeight:"700",
     marginBottom:"20px"
   }}
   >
   🚇 Bloomberg for Transit
   </h1>

   <div
   style={{
     position:"sticky",
     top:"10px",
     zIndex:"100",
     marginBottom:"30px"
   }}
   >
   <input
   placeholder="Search station..."
   value={search}
   onChange={(e)=>setSearch(e.target.value)}
   style={{
     width:"100%",
     padding:"16px",
     borderRadius:"18px",
     border:"none",
     fontSize:"16px",
     background:"#1C1C1E",
     color:"white"
   }}
   />
   </div>

   {featured && (

   <div
   style={{
      background:
      "linear-gradient(135deg,#1F3A8A,#111827)",
      borderRadius:"30px",
      padding:"30px",
      marginBottom:"35px",
      boxShadow:"0px 8px 40px rgba(0,0,0,.35)"
   }}
   >

   <p
   style={{
      opacity:.7,
      marginBottom:"8px"
   }}
   >
   Top Station Today
   </p>

   <h1
   style={{
      fontSize:"32px",
      marginBottom:"10px"
   }}
   >
   {featured.name}
   </h1>

   <div
   style={{
      display:"inline-block",
      padding:"10px 18px",
      borderRadius:"999px",
      background:
      scoreColor(featured.score || 50)
   }}
   >
   ⭐ {featured.score || 50}
   </div>

   <div
   style={{
      marginTop:"20px",
      display:"flex",
      gap:"12px",
      flexWrap:"wrap"
   }}
   >

   <div
   style={{
      background:"rgba(255,255,255,.08)",
      padding:"12px",
      borderRadius:"16px"
   }}
   >
   🧠 Reliable
   </div>

   <div
   style={{
      background:"rgba(255,255,255,.08)",
      padding:"12px",
      borderRadius:"16px"
   }}
   >
   ♿ Accessible
   </div>

   <div
   style={{
      background:"rgba(255,255,255,.08)",
      padding:"12px",
      borderRadius:"16px"
   }}
   >
   🚆 Good Service
   </div>

   </div>

   </div>

   )}

   <h2
   style={{
      marginBottom:"20px"
   }}
   >
   Nearby Stations
   </h2>

   {filtered.map((station,index)=>(

   <div
   key={station.id || index}
   style={{
      background:"#161618",
      borderRadius:"25px",
      padding:"22px",
      marginBottom:"18px",
      boxShadow:
      "0px 5px 20px rgba(0,0,0,.25)"
   }}
   >

   <div
   style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center"
   }}
   >

   <div>

   <h2
   style={{
      fontSize:"20px",
      marginBottom:"6px"
   }}
   >
   {station.name}
   </h2>

   <p
   style={{
      opacity:.6
   }}
   >
   🟢 Good Service
   </p>

   </div>

   <div
   style={{
      background:
      scoreColor(station.score || 50),
      width:"58px",
      height:"58px",
      borderRadius:"50%",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      fontWeight:"700"
   }}
   >
   {station.score || 50}
   </div>

   </div>

   <div
   style={{
      marginTop:"20px",
      display:"flex",
      gap:"10px",
      flexWrap:"wrap"
   }}
   >

   <span
   style={{
      background:"#222",
      padding:"8px 12px",
      borderRadius:"999px"
   }}
   >
   🧼 Clean
   </span>

   <span
   style={{
      background:"#222",
      padding:"8px 12px",
      borderRadius:"999px"
   }}
   >
   🧠 Reliable
   </span>

   <span
   style={{
      background:"#222",
      padding:"8px 12px",
      borderRadius:"999px"
   }}
   >
   ♿ Accessible
   </span>

   </div>

   </div>

   ))}

   </main>
 );
}
