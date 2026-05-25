export async function GET() {

const baseStations = [

{name:"Newkirk Av-Little Haiti",line:"Nostrand",borough:"Bk"},
{name:"Jefferson St",line:"Canarsie",borough:"Bk"},
{name:"Times Sq-42 St",line:"Broadway",borough:"M"},

// paste ALL your original stations here
];

const stations = baseStations.map((station)=>({

...station,

reliability:Math.floor(Math.random()*10)+1,
crowding:Math.floor(Math.random()*10)+1,
accessibility:Math.floor(Math.random()*10)+1,
transfers:Math.floor(Math.random()*10)+1,
delay_score:Math.floor(Math.random()*10)+1,
elevator:Math.random()>.5,
updated:"Today"

})).map(station=>({

...station,

score:

(station.reliability*3)+
(station.accessibility*2)+
(station.transfers*2)+
((10-station.crowding)*2)+
((10-station.delay_score)*3)

}));

return Response.json({

success:true,
stations

});

}
