"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getDistance(lat1, lon1, lat2, lon2) {
 const R = 3959;

 const dLat=((lat2-lat1)*Math.PI)/180;
 const dLon=((lon2-lon1)*Math.PI)/180;

 const a=
 Math.sin(dLat/2)**2+
 Math.cos((lat1*Math.PI)/180)*
 Math.cos((lat2*Math.PI)/180)*
 Math.sin(dLon/2)**2;

 return R*(2*Math.atan2(
 Math.sqrt(a),
 Math.sqrt(1-a)
 ));
}

export default function Home(){

const [stations,setStations]=useState([]);
const [userLocation,setUserLocation]=useState(null);

const [homeStation,setHomeStation]=useState("");
const [workStation,setWorkStation]=useState("");
const [setupComplete,setSetupComplete]=useState(false);

useEffect(()=>{

loadStations();

const savedHome=
localStorage.getItem("homeStation");

const savedWork=
localStorage.getItem("workStation");

if(savedHome && savedWork){

setHomeStation(savedHome);
setWorkStation(savedWork);

setSetupComplete(true);

}

navigator.geolocation.getCurrentPosition(

(position)=>{

setUserLocation({
latitude:position.coords.latitude,
longitude:position.coords.longitude
});

},

(error)=>{
console.log(error);
},

{
enableHighAccuracy:true,
timeout:15000,
maximumAge:0
}

);

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

function saveSetup(){

if(!homeStation||!workStation){

alert("Choose both stations");

return;

}

localStorage.setItem(
"homeStation",
homeStation
);

localStorage.setItem(
"workStation",
workStation
);

setSetupComplete(true);

}

const nearby=[...stations]
.map(station=>{

let distance=null;

if(
userLocation &&
station.latitude &&
station.longitude
){

distance=getDistance(
userLocation.latitude,
userLocation.longitude,
Number(station.latitude),
Number(station.longitude)
);

}

return{

...station,
distance

};

})

.filter(
station=>station.distance!==null
)

.sort(
(a,b)=>
a.distance-b.distance
)

.slice(0,5);

if(!setupComplete){

return(

<main
style={{
background:"#050505",
minHeight:"100vh",
padding:"30px",
color:"white",
fontFamily:"-apple-system"
}}
>

<h1
style={{
fontSize:"38px",
fontWeight:"800"
}}
>
🚇 Bloomberg for Transit
</h1>

<p
style={{
opacity:.7,
marginBottom:"40px"
}}
>
Build your commute profile
</p>

<div
style={{
background:"#111",
padding:"25px",
borderRadius:"30px"
}}
>

<h2>🏠 Home Station</h2>

<select
value={homeStation}
onChange={(e)=>
setHomeStation(
e.target.value
)
}
style={{
width:"100%",
padding:"16px",
marginBottom:"25px",
borderRadius:"18px"
}}
>

<option>
Choose home station
</option>

{stations.map((station)=>(

<option
key={station.id}
value={station.name}
>

{station.name}

</option>

))}

</select>

<h2>🏢 Work Station</h2>

<select
value={workStation}
onChange={(e)=>
setWorkStation(
e.target.value
)
}
style={{
width:"100%",
padding:"16px",
marginBottom:"25px",
borderRadius:"18px"
}}
>

<option>
Choose work station
</option>

{stations.map((station)=>(

<option
key={station.id}
value={station.name}
>

{station.name}

</option>

))}

</select>

<button
onClick={saveSetup}
style={{
width:"100%",
padding:"18px",
borderRadius:"20px",
border:"none",
fontSize:"18px",
fontWeight:"700",
background:"#2563EB",
color:"white"
}}
>
Continue →
</button>

</div>

</main>

)

}

return(

<main
style={{
background:"#050505",
minHeight:"100vh",
padding:"30px",
color:"white",
fontFamily:"-apple-system"
}}
>

<h1>
Good morning 👋
</h1>

<div
style={{
padding:"30px",
background:
"linear-gradient(135deg,#2563EB,#1E1B4B)",
borderRadius:"35px",
marginBottom:"30px"
}}
>

<p>Your commute today</p>

<h2>🏠 {homeStation}</h2>

↓

<h2>🏢 {workStation}</h2>

</div>

<h2>
📍 Nearby Stations
</h2>

{nearby.map((station)=>(

<div
key={station.id}
style={{
padding:"22px",
background:"#111",
borderRadius:"25px",
marginBottom:"15px"
}}
>

<h3>
{station.name}
</h3>

<p>
📍 {station.distance.toFixed(1)}
 miles away
</p>

<p>
⭐ {station.score||50}
</p>

</div>

))}

</main>

)

}
