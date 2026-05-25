import { NextResponse } from "next/server";

export async function GET() {

const stations=[

{
name:"W 4 St–Wash Sq",
service:"🟢 Good Service",
delayScore:2,
waitTime:3
},

{
name:"Times Sq–42 St",
service:"🟡 Delays",
delayScore:6,
waitTime:7
},

{
name:"Grand Central–42 St",
service:"🟢 Good Service",
delayScore:3,
waitTime:4
},

{
name:"Canal St",
service:"🔴 Major Delays",
delayScore:9,
waitTime:12
},

{
name:"Atlantic Av–Barclays",
service:"🟢 Good Service",
delayScore:2,
waitTime:2
}

];

return NextResponse.json(
stations
);

}
