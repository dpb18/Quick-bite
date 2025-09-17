import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './DeliveryLayout.css'

const DeliveryLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="delivery-layout">
      {/* Floating toggle button for when sidebar is closed */}
      {!sidebarOpen && (
        <button 
          className="floating-toggle" 
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>QuickBite Delivery</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '×' : '☰'}
          </button>
        </div>

        {sidebarOpen && (
          <nav className="sidebar-nav">
            <Link to="/delivery/" className="nav-item">
              📊 Dashboard
            </Link>
            <Link to="/delivery/assigned-orders" className="nav-item">
              📦 Assigned Orders
            </Link>
          </nav>
        )}

        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="user-info">
              <span>🚚 {user?.name}</span>
              <small>{user?.email}</small>
              {user?.phone && <small>📞 {user.phone}</small>}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`delivery-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </div>
    </div>
  )
}

export default DeliveryLayout
