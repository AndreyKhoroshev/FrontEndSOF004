import { useState, useEffect, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import dayjs from 'dayjs'
import { getTrainings } from '../api/api'
import type { Training } from '../api/api'

export default function TrainingList() {
  // Tila harjoitusten datalle, lataukselle ja virheille
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [quickFilter, setQuickFilter] = useState<string>('')
  const gridRef = useRef<AgGridReact>(null)

  // Haetaan harjoitukset palvelimelta
  const fetchTrainings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTrainings()
      setTrainings(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Haetaan data kun komponentti ladataan
  useEffect(() => { fetchTrainings() }, [fetchTrainings])


  // Taulukon sarakkeiden määrittely
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

  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', padding: '1.5rem 2rem', gap: '1rem' }}>
      {/* Otsikko ja hakukenttä */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: 'var(--text)' }}>Harjoitukset</h1>
        </div>
        <input
          placeholder="Hae harjoituksia..."
          value={quickFilter}
          onChange={e => setQuickFilter(e.target.value)}
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            color: 'var(--text)',
            fontSize: '0.875rem',
            width: '220px',
            outline: 'none',
          }}
        />
      </div>

      {/* Virheviesti */}
      {error && (
        <div style={{ background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.3)', borderRadius: '6px', padding: '0.75rem 1rem', color: 'var(--danger)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Harjoitustaulukko */}
      <div className="ag-theme-alpine-dark" style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
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