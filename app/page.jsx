"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [status,setStatus] = useState(null);

  useEffect(()=>{

    async function loadData(){

      const res = await fetch("/api/stations");

      const data = await res.json();

      setStatus(data);

    }

    loadData();

  },[]);

  return (

    <main
      style={{
        background:"#111",
        color:"white",
        minHeight:"100vh",
        padding:"40px",
        fontFamily:"Arial"
      }}
    >

      <h1>🚇 MTA Station Index V4</h1>

      <h2>
        Feed Status
      </h2>

      {status?.feeds?.map((feed,index)=>(

        <div
          key={index}
          style={{
            padding:"20px",
            border:"1px solid #333",
            borderRadius:"20px",
            marginBottom:"20px"
          }}
        >

          <p>
            Feed #{index+1}
          </p>

          <p>
            Status:
            {feed.status===200
              ? " ✅ Live"
              : " ❌ Offline"}
          </p>

        </div>

      ))}

      <p>
        Updated:
        {" "}
        {status?.updated
          ? new Date(
              status.updated
            ).toLocaleString()
          : ""}
      </p>

    </main>

  );

}
