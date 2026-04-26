import { useState } from 'react'
import type { Customer } from '../api/api'

interface Props {
  open: boolean
  customer: Customer | null
  onClose: () => void
  onSave: (training: { date: string; activity: string; duration: number; customer: string }) => void
}

export default function TrainingDialog({ open, customer, onClose, onSave }: Props) {
  // Lomakkeen tila
  const [activity, setActivity] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [date, setDate] = useState<string>('')

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      // Muutetaan päivämäärä ISO-8601 muotoon
      date: new Date(date).toISOString(),
      activity,
      duration: Number(duration),
      customer: customer!.href!,
    })
    // Tyhjennetään lomake
    setActivity('')
    setDuration('')
    setDate('')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #2e2e2e',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '440px',
        padding: '1.5rem',
      }}>
        {/* Otsikko */}
        <h2 style={{ fontFamily: 'monospace', color: '#f0f0f0', marginBottom: '0.5rem' }}>
          Uusi harjoitus
        </h2>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Asiakas: {customer?.firstname} {customer?.lastname}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Harjoituksen nimi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#888', textTransform: 'uppercase' }}>
              Harjoitus
            </label>
            <input
              value={activity}
              onChange={e => setActivity(e.target.value)}
              required
              placeholder="esim. Juoksu"
              style={{
                background: '#242424',
                border: '1px solid #2e2e2e',
                borderRadius: '6px',
                padding: '0.5rem 0.875rem',
                color: '#f0f0f0',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Kesto minuuteissa */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#888', textTransform: 'uppercase' }}>
              Kesto (min)
            </label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              required
              min={1}
              placeholder="esim. 60"
              style={{
                background: '#242424',
                border: '1px solid #2e2e2e',
                borderRadius: '6px',
                padding: '0.5rem 0.875rem',
                color: '#f0f0f0',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Päivämäärä ja aika */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#888', textTransform: 'uppercase' }}>
              Päivämäärä ja aika
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              style={{
                background: '#242424',
                border: '1px solid #2e2e2e',
                borderRadius: '6px',
                padding: '0.5rem 0.875rem',
                color: '#f0f0f0',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Painikkeet */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{
              background: 'transparent',
              border: '1px solid #2e2e2e',
              borderRadius: '6px',
              padding: '0.5rem 1.25rem',
              color: '#888',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}>
              Peruuta
            </button>
            <button type="submit" style={{
              background: '#e8ff5a',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1.25rem',
              color: '#111',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}>
              Lisää
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}