import { useState, useEffect, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { getCustomers, deleteCustomer, addCustomer, updateCustomer, addTraining } from '../api/api'
import type { Customer } from '../api/api'
import CustomerDialog from '../components/CustomerDialog'
import TrainingDialog from '../components/TrainingDialog'
import Papa from 'papaparse'

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [quickFilter, setQuickFilter] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
  const [trainingDialogOpen, setTrainingDialogOpen] = useState<boolean>(false)
  const [trainingCustomer, setTrainingCustomer] = useState<Customer | null>(null)
  const gridRef = useRef<AgGridReact>(null)

  const fetchCustomers = useCallback(async () => {
    try {
      setError(null)
      const data = await getCustomers()
      setCustomers(data)
    } catch (e: any) {
      setError(e.message)
    }
  }, [])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const handleDelete = async (customer: Customer) => {
    if (!window.confirm(`Haluatko varmasti poistaa asiakkaan ${customer.firstname} ${customer.lastname}?`)) return
    try {
      await deleteCustomer(customer.href!)
      fetchCustomers()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer)
    setDialogOpen(true)
  }

  const handleSave = async (formData: Omit<Customer, 'id' | 'href' | '_links'>) => {
    try {
      if (editCustomer) {
        await updateCustomer(editCustomer.href!, formData)
      } else {
        await addCustomer(formData)
      }
      setDialogOpen(false)
      setEditCustomer(null)
      fetchCustomers()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleSaveTraining = async (training: { date: string; activity: string; duration: number; customer: string }) => {
    try {
      await addTraining(training)
      setTrainingDialogOpen(false)
      setTrainingCustomer(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  // Viedään asiakastiedot CSV-tiedostoon
  const handleExportCSV = () => {
    const exportData = customers.map(({ firstname, lastname, email, phone, streetaddress, postcode, city }) => ({
      firstname,
      lastname,
      email,
      phone,
      streetaddress,
      postcode,
      city,
    }))
    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'asiakkaat.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columnDefs: ColDef<Customer>[] = [
    { field: 'firstname', headerName: 'Etunimi', sortable: true, filter: true, flex: 1 },
    { field: 'lastname', headerName: 'Sukunimi', sortable: true, filter: true, flex: 1 },
    { field: 'email', headerName: 'Sähköposti', sortable: true, filter: true, flex: 1.5 },
    { field: 'phone', headerName: 'Puhelin', sortable: true, filter: true, flex: 1 },
    { field: 'city', headerName: 'Kaupunki', sortable: true, filter: true, flex: 1 },
    { field: 'streetaddress', headerName: 'Osoite', sortable: true, filter: true, flex: 1.5 },
    { field: 'postcode', headerName: 'Postinumero', sortable: true, filter: true, flex: 0.8 },
    {
      headerName: 'Toiminnot',
      flex: 1.7,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '100%' }}>
          <button onClick={() => handleEdit(params.data)} style={{ background: 'rgba(255, 238, 0, 0.7)', color: '#ff8000', border: '1px solid rgba(235, 208, 30, 0.82)', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px' }}>
            Muokkaa
          </button>
          <button onClick={() => { setTrainingCustomer(params.data); setTrainingDialogOpen(true) }} style={{ background: 'rgb(3, 58, 31)', color: '#3eb842', border: '1px solid rgba(90,255,204,0.3)', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px' }}>
            Lisää harjoitus
          </button>
          <button onClick={() => handleDelete(params.data)} style={{ background: 'rgba(191, 35, 35, 0.23)', color: '#f82222', border: '1px solid rgba(208, 34, 34, 0.3)', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px' }}>
            Poista
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', padding: '1.5rem 2rem', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: '#f0f0f0' }}>Asiakkaat</h1>
          <p style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' }}>{customers.length} asiakasta</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            placeholder="Hae asiakkaita..."
            value={quickFilter}
            onChange={e => setQuickFilter(e.target.value)}
            style={{ background: '#242424', border: '1px solid #2e2e2e', borderRadius: '6px', padding: '0.5rem 1rem', color: '#f0f0f0', fontSize: '0.875rem', width: '220px', outline: 'none' }}
          />
          {/* CSV-vienti painike */}
          <button onClick={handleExportCSV} style={{ background: 'transparent', color: '#5affcc', border: '1px solid rgba(90,255,204,0.3)', borderRadius: '6px', padding: '0.5rem 1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            CSV
          </button>
          {/* Lisää uusi asiakas -painike */}
          <button onClick={() => { setEditCustomer(null); setDialogOpen(true) }} style={{ background: '#e8ff5a', color: '#111', border: 'none', borderRadius: '6px', padding: '0.5rem 1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            + Lisää asiakas
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,90,90,0.1)', border: '1px solid rgba(255,90,90,0.3)', borderRadius: '6px', padding: '0.75rem 1rem', color: '#ff5a5a', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div className="ag-theme-alpine-dark" style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid #2e2e2e' }}>
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

      <CustomerDialog
        open={dialogOpen}
        customer={editCustomer}
        onClose={() => { setDialogOpen(false); setEditCustomer(null) }}
        onSave={handleSave}
      />

      <TrainingDialog
        open={trainingDialogOpen}
        customer={trainingCustomer}
        onClose={() => { setTrainingDialogOpen(false); setTrainingCustomer(null) }}
        onSave={handleSaveTraining}
      />
    </div>
  )
}