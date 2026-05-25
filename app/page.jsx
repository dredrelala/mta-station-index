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
const [sortBy,setSortBy]=useState("score");
const [borough,setBorough]=useState("All");

useEffect(()=>{

async function loadStations(){

const {data}=await supabase
.from("stations")
.select("*");

const ranked=(data||[]).map(station=>{

const reliability=
Math.floor(Math.random()*4)+6;

const crowding=
Math.floor(Math.random()*10)+1;

const score=
Math.round(
(
reliability*5+
(11-crowding)*5
)
);

return{

...station,
reliability,
crowding,
score,
updated:"Today"

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

if(sortBy==="score"){
return b.score-a.score;
}

if(sortBy==="reliability"){
return b.reliability-a.reliability;
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
🚇 MTA Station Index V18
</h1>

<input
placeholder="Search station..."
value={search}
onChange={(e)=>
setSearch(e.target.value)
}
style={{
width:"100%",
padding:"15px",
borderRadius:"15px",
marginBottom:"20px"
}}
/>

<div
style={{
display:"flex",
gap:"10px",
marginBottom:"20px"
}}
>

<select
value={sortBy}
onChange={(e)=>
setSortBy(e.target.value)
}
>
<option value="score">
Best Score
</option>

<option value="reliability">
Most Reliable
</option>

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

</div>

{topStation && (

<div
style={{
padding:"20px",
background:"#1a2038",
borderRadius:"20px",
marginBottom:"20px"
}}
>

<h2>
🏆 Top Ranked Station
</h2>

<h1>
{topStation.name}
</h1>

<p>
⭐ {topStation.score}/100
</p>

</div>

)}

<p>
{filtered.length}
stations found
</p>

{filtered.map((station,index)=>(

<div
key={index}
style={{
padding:"25px",
marginBottom:"20px",
background:"#151c2e",
borderRadius:"20px"
}}
>

<h2>
#{index+1}
{" "}
{station.name}
</h2>

<p>
⭐ Score:
{station.score}
</p>

<hr/>

{Object.entries(station).map(
([key,value])=>(

<p key={key}>

<strong>
{key}:
</strong>

{" "}

{String(value)}

</p>

)
)}

</div>

))}

</main>

)

}
