import { useState, useEffect, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { getCustomers, } from '../api/api'
import type { Customer } from '../api/api'

export default function CustomerList() {
  // Tila asiakkaiden datalle, lataukselle ja virheille
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [quickFilter, setQuickFilter] = useState<string>('')
  const gridRef = useRef<AgGridReact>(null)

  // Haetaan asiakkaat palvelimelta
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCustomers()
      setCustomers(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Haetaan data kun komponentti ladataan
  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  // Taulukon sarakkeiden määrittely
  const columnDefs: ColDef<Customer>[] = [
    { field: 'firstname', headerName: 'Etunimi', sortable: true, filter: true, flex: 1 },
    { field: 'lastname', headerName: 'Sukunimi', sortable: true, filter: true, flex: 1 },
    { field: 'email', headerName: 'Sähköposti', sortable: true, filter: true, flex: 1.5 },
    { field: 'phone', headerName: 'Puhelin', sortable: true, filter: true, flex: 1 },
    { field: 'city', headerName: 'Kaupunki', sortable: true, filter: true, flex: 1 },
    { field: 'streetaddress', headerName: 'Osoite', sortable: true, filter: true, flex: 1.5 },
    { field: 'postcode', headerName: 'Postinumero', sortable: true, filter: true, flex: 0.8 },
    
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', padding: '1.5rem 2rem', gap: '1rem' }}>
      {/* Otsikko ja hakukenttä */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: 'var(--text)' }}>Asiakkaat</h1>
          
        </div>
        <input
          placeholder="Hae asiakkaita..."
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

      {/* Asiakastaulukko */}
      <div className="ag-theme-alpine-dark" style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <AgGridReact
          ref={gridRef}
          rowData={customers}
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