import { useState, useEffect, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import dayjs from 'dayjs'
import { getTrainings, deleteTraining } from '../api/api'
import type { Training } from '../api/api'

export default function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [error, setError] = useState<string | null>(null)
  const [quickFilter, setQuickFilter] = useState<string>('')
  const gridRef = useRef<AgGridReact>(null)

  // Haetaan harjoitukset palvelimelta
  const fetchTrainings = useCallback(async () => {
    try {
      setError(null)
      const data = await getTrainings()
      setTrainings(data)
    } catch (e: any) {
      setError(e.message)
    }
  }, [])

  useEffect(() => { fetchTrainings() }, [fetchTrainings])

  // Poistetaan harjoitus vahvistuksen jälkeen
  const handleDelete = async (training: Training) => {
    if (!window.confirm(`Haluatko varmasti poistaa harjoituksen: ${training.activity}?`)) return
    try {
      await deleteTraining(training.id)
      fetchTrainings()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const columnDefs: ColDef<Training>[] = [
    {
      headerName: 'Asiakas',
      sortable: true,
      filter: true,
      flex: 1.2,
      // Näytetään asiakkaan koko nimi harjoitustaulukossa
      valueGetter: (params) =>
        params.data?.customer
          ? `${params.data.customer.firstname} ${params.data.customer.lastname}`
          : '—',
    },
    { field: 'activity', headerName: 'Harjoitus', sortable: true, filter: true, flex: 1.2 },
    {
      field: 'date',
      headerName: 'Päivämäärä',
      sortable: true,
      filter: true,
      flex: 1.2,
      // Muotoillaan päivämäärä muotoon pp.kk.vvvv hh:mm
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : '—',
      comparator: (a, b) => dayjs(a).unix() - dayjs(b).unix(),
    },
    {
      field: 'duration',
      headerName: 'Kesto (min)',
      sortable: true,
      filter: true,
      flex: 0.9,
    },
    {
      headerName: 'Toiminnot',
      flex: 0.8,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {/* Poista-painike */}
          <button
            onClick={() => handleDelete(params.data)}
            style={{
              background: 'rgba(191, 35, 35, 0.23)',
              color: '#f82222',
              border: '1px solid rgba(208, 34, 34, 0.3)',
              borderRadius: '4px',
              padding: '3px 10px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}
          >
            Poista
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', padding: '1.5rem 2rem', gap: '1rem' }}>
      {/* Otsikko ja hakukenttä */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: '#f0f0f0' }}>Harjoitukset</h1>
          <p style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' }}>{trainings.length} harjoitusta</p>
        </div>
        <input
          placeholder="Hae harjoituksia..."
          value={quickFilter}
          onChange={e => setQuickFilter(e.target.value)}
          style={{
            background: '#242424',
            border: '1px solid #2e2e2e',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            color: '#f0f0f0',
            fontSize: '0.875rem',
            width: '220px',
            outline: 'none',
          }}
        />
      </div>

      {/* Virheviesti */}
      {error && (
        <div style={{ background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.3)', borderRadius: '6px', padding: '0.75rem 1rem', color: '#ff5a5a', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Harjoitustaulukko */}
      <div className="ag-theme-alpine-dark" style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #2e2e2e' }}>
        <AgGridReact
          ref={gridRef}
          rowData={trainings}
          columnDefs={columnDefs}
          quickFilterText={quickFilter}
          pagination={true}
          paginationPageSize={20}
          defaultColDef={{ resizable: true }}
          animateRows={true}
        />
      </div>
    </div>
  )
}