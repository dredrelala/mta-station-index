export async function GET() {

const stations = [
{
name:"Times Sq-42 St",
borough:"M",
line:"Broadway",
cleanliness:8,
reliability:9,
crowding:10,
accessibility:7,
transfers:10,
elevator:"operational",
delayScore:6
},
{
name:"8 St-NYU",
borough:"M",
line:"Broadway",
cleanliness:8,
reliability:10,
crowding:8,
accessibility:7,
transfers:7,
elevator:"operational",
delayScore:8
},
{
name:"Clark St",
borough:"Bk",
line:"Clark St",
cleanliness:7,
reliability:10,
crowding:3,
accessibility:5,
transfers:2,
elevator:"operational",
delayScore:9
},
{
name:"Grand Central",
borough:"M",
line:"Lexington",
cleanliness:7,
reliability:9,
crowding:10,
accessibility:10,
transfers:10,
elevator:"operational",
delayScore:7
},
{
name:"Nereid Av",
borough:"Bx",
line:"White Plains Rd",
cleanliness:8,
reliability:10,
crowding:2,
accessibility:6,
transfers:2,
elevator:"operational",
delayScore:10
}
];

const scoredStations = stations.map(station=>{

const crowdScore = 11-station.crowding;

const total =
station.cleanliness +
(station.reliability*2) +
crowdScore +
station.accessibility +
station.transfers +
station.delayScore;

const score=Math.round((total/60)*100);

return{
...station,
score,
updated:new Date().toLocaleString()
};

});

scoredStations.sort((a,b)=>b.score-a.score);

return Response.json({
success:true,
stationsFound:scoredStations.length,
stations:scoredStations
});

}
