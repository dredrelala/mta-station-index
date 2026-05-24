'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStations() {
      setLoading(true)

      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error(error)
      } else {
        setStations(data || [])
      }

      setLoading(false)
    }

    loadStations()
  }, [])

  return (
    <main
      style={{
        background: '#111',
        color: 'white',
        minHeight: '100vh',
        padding: '30px',
        fontFamily: 'Arial'
      }}
    >
      <h1>🚇 MTA Station Index</h1>

      {loading ? (
        <p>Loading stations...</p>
      ) : (
        <p>{stations.length} stations found</p>
      )}

      {stations.map((station, index) => (
        <div
          key={station.id || index}
          style={{
            borderBottom: '1px solid #333',
            padding: '20px 0'
          }}
        >
          <h2>
            #{index + 1} {station["Stop Name"] || station.name}
          </h2>

          <p>
            <strong>Line:</strong>{' '}
            {station.Line || station.line || 'N/A'}
          </p>

          <p>
            <strong>Borough:</strong>{' '}
            {station.borough || station.Borough || 'N/A'}
          </p>

          <p>
            <strong>Division:</strong>{' '}
            {station.Division || station.division || 'N/A'}
          </p>
        </div>
      ))}
    </main>
  )
}
