// Perus-URL kaikille API-kutsuille
const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api'

// Asiakkaan tietorakenne (TypeScript-rajapinta)
export interface Customer {
  id?: string
  href?: string
  firstname: string
  lastname: string
  email: string
  phone: string
  streetaddress: string
  postcode: string
  city: string
  _links?: any
}

// Harjoituksen tietorakenne
export interface Training {
  id: number
  date: string
  duration: number
  activity: string
  customer: Customer | null
}

// Haetaan kaikki asiakkaat palvelimelta
export const getCustomers = async (): Promise<Customer[]> => {
  const res = await fetch(`${BASE_URL}/customers`)
  if (!res.ok) throw new Error('Failed to fetch customers')
  const data = await res.json()
  // Muokataan vastaus sopivaan muotoon ja lisätään id ja href kentät
  return data._embedded.customers.map((c: any) => ({
    ...c,
    id: c._links.self.href.split('/').pop(),
    href: c._links.self.href,
  }))
}

// Lisätään uusi asiakas tietokantaan
export const addCustomer = async (customer: Omit<Customer, 'id' | 'href' | '_links'>): Promise<Customer> => {
  const res = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })
  if (!res.ok) throw new Error('Failed to add customer')
  return res.json()
}

// Päivitetään olemassa olevan asiakkaan tiedot
export const updateCustomer = async (href: string, customer: Omit<Customer, 'id' | 'href' | '_links'>): Promise<Customer> => {
  const res = await fetch(href, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  })
  if (!res.ok) throw new Error('Failed to update customer')
  return res.json()
}

// Poistetaan asiakas tietokannasta href-linkin avulla
export const deleteCustomer = async (href: string): Promise<void> => {
  const res = await fetch(href, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete customer')
}

// Haetaan kaikki harjoitukset asiakastietoineen
export const getTrainings = async (): Promise<Training[]> => {
  const res = await fetch(`${BASE_URL}/gettrainings`)
  if (!res.ok) throw new Error('Failed to fetch trainings')
  return res.json()
}

// Poistetaan harjoitus id:n perusteella
export const deleteTraining = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/trainings/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete training')
}