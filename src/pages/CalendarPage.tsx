import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getTrainings } from '../api/api'
import type { Training } from '../api/api'

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Haetaan harjoitukset ja muutetaan kalenterin tapahtumiksi
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data: Training[] = await getTrainings()
        const calendarEvents = data.map(t => ({
          id: String(t.id),
          title: t.customer
            ? `${t.activity} - ${t.customer.firstname} ${t.customer.lastname}`
            : t.activity,
          start: t.date,
          // Lasketaan lopetusaika keston perusteella
          end: new Date(new Date(t.date).getTime() + t.duration * 60000).toISOString(),
        }))
        setEvents(calendarEvents)
      } catch (e: any) {
        setError(e.message)
      }
    }
    fetchTrainings()
  }, [])

  return (
    <div style={{ padding: '1.5rem 2rem', height: 'calc(100vh - 60px)', overflow: 'auto' }}>
      {/* Otsikko */}
      <h1 style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: '#f0f0f0', marginBottom: '1rem' }}>
        Kalenteri
      </h1>

      {/* Virheviesti */}
      {error && (
        <div style={{ background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.3)', borderRadius: '6px', padding: '0.75rem 1rem', color: '#ff5a5a', fontFamily: 'monospace', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Kalenteri - harmaalla taustalla*/}
      <div style={{ background: '#ffffff4d', borderRadius: '1px', padding: '1rem' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          height="auto"
          locale="fi"
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }}
        />
      </div>
    </div>
  )
}