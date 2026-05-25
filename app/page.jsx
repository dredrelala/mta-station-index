"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function scoreColor(score){
 if(score>=85) return "#34C759";
 if(score>=70) return "#FFCC00";
 return "#FF453A";
}

export default function Home(){

 const [stations,setStations]=useState([]);
 const [search,setSearch]=useState("");

 useEffect(()=>{
   loadStations();
 },[]);

 async function loadStations(){

   const {data,error}=await supabase
   .from("stations")
   .select("*");

   if(error){
     console.log(error);
     return;
   }

   setStations(data || []);
 }

 let filtered=[...stations];

 if(search){

   filtered=filtered.filter((station)=>
   station.name
   ?.toLowerCase()
   .includes(search.toLowerCase())
   );

 }

 filtered.sort(
 (a,b)=>(b.score||50)-(a.score||50)
 );

 const hero=filtered[0];
 const trending=filtered.slice(1,6);

 return(

 <main
 style={{
 background:"#080808",
 color:"white",
 minHeight:"100vh",
 padding:"20px",
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

 <input
 placeholder="Search stations..."
 value={search}
 onChange={(e)=>setSearch(e.target.value)}
 style={{
 width:"100%",
 padding:"18px",
 borderRadius:"20px",
 border:"none",
 background:"#171717",
 color:"white",
 fontSize:"16px",
 marginBottom:"30px"
 }}
 />

 {hero && (

 <div
 style={{
 borderRadius:"30px",
 padding:"30px",
 background:
 "linear-gradient(135deg,#2563EB,#1E1B4B)",
 marginBottom:"35px"
 }}
 >

 <p
 style={{
 opacity:.8
 }}
 >
 Nearest Station
 </p>

 <h1
 style={{
 fontSize:"36px",
 marginTop:"8px"
 }}
 >
 {hero.name}
 </h1>

 <div
 style={{
 display:"flex",
 gap:"15px",
 marginTop:"20px",
 alignItems:"center"
 }}
 >

 <div
 style={{
 width:"70px",
 height:"70px",
 borderRadius:"50%",
 background:
 scoreColor(hero.score||50),
 display:"flex",
 justifyContent:"center",
 alignItems:"center",
 fontWeight:"700",
 fontSize:"22px"
 }}
 >
 {hero.score||50}
 </div>

 <div>

 <p>🟢 Excellent Service</p>
 <p>📍 6 mins away</p>

 </div>

 </div>

 </div>

 )}

 <h2
 style={{
 marginBottom:"20px"
 }}
 >
 Trending Nearby
 </h2>

 <div
 style={{
 display:"flex",
 overflowX:"auto",
 gap:"15px",
 paddingBottom:"20px"
 }}
 >

 {trending.map((station,index)=>(

 <div
 key={index}
 style={{
 minWidth:"240px",
 background:"#151515",
 borderRadius:"25px",
 padding:"20px"
 }}
 >

 <div
 style={{
 display:"flex",
 justifyContent:"space-between"
 }}
 >

 <div>

 <h3>{station.name}</h3>

 <p
 style={{
 opacity:.6
 }}
 >
 Good Service
 </p>

 </div>

 <div
 style={{
 background:
 scoreColor(
 station.score||50
 ),
 width:"45px",
 height:"45px",
 borderRadius:"50%",
 display:"flex",
 justifyContent:"center",
 alignItems:"center"
 }}
 >
 {station.score||50}
 </div>

 </div>

 <div
 style={{
 display:"flex",
 gap:"10px",
 marginTop:"15px",
 flexWrap:"wrap"
 }}
 >

 <span
 style={{
 background:"#222",
 padding:"6px 10px",
 borderRadius:"999px"
 }}
 >
 🧠 Reliable
 </span>

 <span
 style={{
 background:"#222",
 padding:"6px 10px",
 borderRadius:"999px"
 }}
 >
 ♿ Access
 </span>

 </div>

 </div>

 ))}

 </div>

 </main>

 )

}
