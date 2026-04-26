import { useState, useEffect } from 'react'
import type { Customer } from '../api/api'

// Tyhjä asiakaspohja uutta asiakasta varten
const EMPTY_CUSTOMER: Omit<Customer, 'id' | 'href' | '_links'> = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  streetaddress: '',
  postcode: '',
  city: '',
}

interface Props {
  open: boolean
  customer: Customer | null
  onClose: () => void
  onSave: (customer: Omit<Customer, 'id' | 'href' | '_links'>) => void
}

export default function CustomerDialog({ open, customer, onClose, onSave }: Props) {
  const [form, setForm] = useState(EMPTY_CUSTOMER)

  // Täytetään lomake asiakkaan tiedoilla muokkaustilassa
  useEffect(() => {
    setForm(customer ? {
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      streetaddress: customer.streetaddress,
      postcode: customer.postcode,
      city: customer.city,
    } : EMPTY_CUSTOMER)
  }, [customer, open])

  if (!open) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
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
        maxWidth: '500px',
        padding: '1.5rem',
      }}>
        {/* Otsikko */}
        <h2 style={{ fontFamily: 'monospace', color: '#f0f0f0', marginBottom: '1.25rem' }}>
          {customer ? 'Muokkaa asiakasta' : 'Uusi asiakas'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Etunimi" name="firstname" value={form.firstname} onChange={handleChange} />
            <Field label="Sukunimi" name="lastname" value={form.lastname} onChange={handleChange} />
          </div>
          <Field label="Sähköposti" name="email" type="email" value={form.email} onChange={handleChange} />
          <Field label="Puhelin" name="phone" value={form.phone} onChange={handleChange} />
          <Field label="Osoite" name="streetaddress" value={form.streetaddress} onChange={handleChange} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="Postinumero" name="postcode" value={form.postcode} onChange={handleChange} />
            <Field label="Kaupunki" name="city" value={form.city} onChange={handleChange} />
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
              {customer ? 'Tallenna' : 'Lisää'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Yksittäinen lomakekenttä
function Field({ label, name, value, onChange, type = 'text' }: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#888', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
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
  )
}