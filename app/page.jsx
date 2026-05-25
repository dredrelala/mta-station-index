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

function greeting(){
 const hour=new Date().getHours();

 if(hour<12) return "Good morning";
 if(hour<18) return "Good afternoon";

 return "Good evening";
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

setStations(data||[]);

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
const nearby=filtered.slice(1,5);
const trending=filtered.slice(5,10);

return(

<main
style={{
background:"#060606",
minHeight:"100vh",
padding:"24px",
color:"white",
fontFamily:
"-apple-system,BlinkMacSystemFont,sans-serif"
}}
>

<div
style={{
marginBottom:"35px"
}}
>

<h3
style={{
opacity:.65,
fontWeight:"500",
marginBottom:"6px"
}}
>
{greeting()} 👋
</h3>

<h1
style={{
fontSize:"40px",
fontWeight:"800",
lineHeight:"1"
}}
>
Bloomberg
for Transit
</h1>

</div>

<input
placeholder="Search stations..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
width:"100%",
padding:"18px",
border:"none",
borderRadius:"22px",
background:"#151515",
color:"white",
fontSize:"16px",
marginBottom:"30px"
}}
/>

{hero && (

<div
style={{
padding:"28px",
borderRadius:"32px",
background:
"linear-gradient(135deg,#2563EB,#312E81)",
marginBottom:"35px"
}}
>

<p
style={{
opacity:.8
}}
>
📍 Nearest Station
</p>

<h1
style={{
fontSize:"34px",
marginTop:"8px"
}}
>
{hero.name}
</h1>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginTop:"24px"
}}
>

<div>

<h2
style={{
fontSize:"52px",
fontWeight:"800"
}}
>
{hero.score||50}
</h2>

<p
style={{
opacity:.7
}}
>
Transit Score
</p>

</div>

<div
style={{
width:"80px",
height:"80px",
borderRadius:"50%",
background:
scoreColor(hero.score||50),
display:"flex",
justifyContent:"center",
alignItems:"center",
fontWeight:"700",
fontSize:"24px"
}}
>
⭐
</div>

</div>

<div
style={{
display:"flex",
gap:"10px",
marginTop:"20px",
flexWrap:"wrap"
}}
>

<span
style={{
padding:"8px 14px",
borderRadius:"999px",
background:"rgba(255,255,255,.15)"
}}
>
🟢 Reliable
</span>

<span
style={{
padding:"8px 14px",
borderRadius:"999px",
background:"rgba(255,255,255,.15)"
}}
>
♿ Accessible
</span>

<span
style={{
padding:"8px 14px",
borderRadius:"999px",
background:"rgba(255,255,255,.15)"
}}
>
🚆 Service Good
</span>

</div>

</div>

)}

<h2
style={{
marginBottom:"18px"
}}
>
Nearby
</h2>

<div
style={{
display:"flex",
overflowX:"auto",
gap:"15px",
marginBottom:"35px"
}}
>

{nearby.map((station,index)=>(

<div
key={index}
style={{
minWidth:"220px",
padding:"22px",
borderRadius:"28px",
background:"#141414"
}}
>

<h3>
{station.name}
</h3>

<div
style={{
marginTop:"20px",
fontSize:"28px",
fontWeight:"700"
}}
>
{station.score||50}
</div>

<p
style={{
opacity:.6
}}
>
Transit Score
</p>

</div>

))}

</div>

<h2
style={{
marginBottom:"18px"
}}
>
Trending Today
</h2>

{trending.map((station,index)=>(

<div
key={index}
style={{
padding:"20px",
borderBottom:
"1px solid #1d1d1d"
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between"
}}
>

<div>

<h3>
{station.name}
</h3>

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
fontWeight:"700"
}}
>
⭐ {station.score||50}
</div>

</div>

</div>

))}

</main>

)

}
