import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CustomerList from './pages/CustomerList'
import TrainingList from './pages/TrainingList'
import CalendarPage from './pages/CalendarPage'

// Pääkomponentti joka sisältää reitityksen ja navigaation
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Asiakkaiden listaus */}
        <Route path="/" element={<CustomerList />} />
        {/* Harjoitusten listaus */}
        <Route path="/trainings" element={<TrainingList />} />
        {/* Kalenteri */}
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  )
}