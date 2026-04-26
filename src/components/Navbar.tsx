import { NavLink } from 'react-router-dom'

// Navigaatiolinkkien määrittely
const NAV_ITEMS = [
  { path: '/', label: 'Asiakkaat' },
  { path: '/trainings', label: 'Harjoitukset' },
]

export default function Navbar() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      height: '60px',
      background: '#1a1a1a',
      borderBottom: '1px solid #2e2e2e',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Sovelluksen nimi */}
      <span style={{
        fontFamily: 'monospace',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: '#e8ff5a',
        marginRight: 'auto',
      }}>
         PTApp
      </span>

      {/* Navigaatiolinkit */}
      <nav style={{ display: 'flex', gap: '0.5rem' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            style={({ isActive }) => ({
              padding: '0.4rem 1rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              textDecoration: 'none',
              color: isActive ? '#e8ff5a' : '#888',
              background: isActive ? 'rgba(232,255,90,0.08)' : 'transparent',
              transition: 'all 0.15s',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}