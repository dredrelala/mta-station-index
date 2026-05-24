'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [stations, setStations] = useState([])

  useEffect(() => {
    async function getStations() {
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.log(error)
      } else {
        setStations(data)
      }
    }

    getStations()
  }, [])

  return (
    <main
      style={{
        background: '#111',
        minHeight: '100vh',
        color: 'white',
        padding: '30px',
        fontFamily: 'Arial'
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      <p>{stations.length} stations found</p>

      {stations.map((station, index) => (
        <div
          key={station.id}
          style={{
            borderBottom: '1px solid #444',
            padding: '20px 0'
          }}
        >
          <h2>
            #{index + 1} {station["Stop Name"] || station.name}
          </h2>

          <p>
            <strong>Line:</strong>{' '}
            {station.Line || station.line}
          </p>

          <p>
            <strong>Borough:</strong>{' '}
            {station.borough}
          </p>

          <p>
            <strong>Division:</strong>{' '}
            {station.Division || station.division}
          </p>
        </div>
      ))}
    </main>
  )
}
