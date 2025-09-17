import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DeliveryPartnerService from '../services/DeliveryPartnerService'
import './DeliveryLayout.css'

const DeliveryLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [available, setAvailable] = useState(true)
  const [loading, setLoading] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Load initial availability status
  useEffect(() => {
    if (user?.id) {
      loadAvailability()
    }
  }, [user])

  const loadAvailability = async () => {
    try {
      const response = await DeliveryPartnerService.getAvailability(user.id)
      setAvailable(response.available)
    } catch (error) {
      console.error('Error loading availability:', error)
      // Default to true if there's an error
      setAvailable(true)
    }
  }

  const handleAvailabilityToggle = async () => {
    if (loading) return
    
    setLoading(true)
    const newAvailable = !available
    
    try {
      await DeliveryPartnerService.updateAvailability(user.id, newAvailable)
      setAvailable(newAvailable)
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Failed to update availability. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            
            {/* Availability Toggle */}
            <div className="availability-section">
              <div className="availability-header">
                <span className="availability-label">
                  {available ? '🟢 Available' : '🔴 Unavailable'}
                </span>
              </div>
              <div className="toggle-container">
                <input
                  type="checkbox"
                  id="availability-toggle"
                  className="toggle-input"
                  checked={available}
                  onChange={handleAvailabilityToggle}
                  disabled={loading}
                />
                <label htmlFor="availability-toggle" className="toggle-label">
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-text">
                  {loading ? 'Updating...' : (available ? 'Online' : 'Offline')}
                </span>
              </div>
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
