import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import _ from 'lodash'
import { getTrainings } from '../api/api'
import type { Training } from '../api/api'

export default function StatisticsPage() {
  const [chartData, setChartData] = useState<{ activity: string; duration: number }[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Training[] = await getTrainings()
        // Ryhmitellään harjoitukset tyypin mukaan ja lasketaan kesto yhteen
        const grouped = _.groupBy(data, 'activity')
        const result = Object.entries(grouped).map(([activity, trainings]) => ({
          activity,
          duration: _.sumBy(trainings, 'duration'),
        }))
        setChartData(result)
      } catch (e: any) {
        setError(e.message)
      }
    }
    fetchData()
  }, [])

  return (
    <div style={{ padding: '1.5rem 2rem' }}>
      {/* Otsikko */}
      <h1 style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: '#f0f0f0', marginBottom: '1rem' }}>
        Tilastot
      </h1>

      {/* Virheviesti */}
      {error && (
        <div style={{ background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.3)', borderRadius: '6px', padding: '0.75rem 1rem', color: '#ff5a5a', fontFamily: 'monospace', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Kaavio harjoitustyypeittäin */}
      <div style={{ background: '#1a1a1a', borderRadius: '8px', padding: '1.5rem', border: '1px solid #2e2e2e' }}>
        <h2 style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#888', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Harjoitusten kesto tyypeittäin (min)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
            <XAxis
              dataKey="activity"
              tick={{ fill: '#888', fontFamily: 'monospace', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: '#888', fontFamily: 'monospace', fontSize: 12 }}
              label={{ value: 'Kesto (min)', angle: -90, position: 'insideLeft', fill: '#888', fontFamily: 'monospace', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ background: '#242424', border: '1px solid #2e2e2e', borderRadius: '6px', color: '#f0f0f0', fontFamily: 'monospace' }}
              labelStyle={{ color: '#e8ff5a' }}
            />
            <Bar dataKey="duration" fill="#e8ff5a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}