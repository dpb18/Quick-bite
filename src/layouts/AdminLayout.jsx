import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-layout">
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
          <h2>QuickBite Admin</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '×' : '☰'}
          </button>
        </div>

        {sidebarOpen && (
          <nav className="sidebar-nav">
            <Link to="/admin/dashboard" className="nav-item">
              📊 Dashboard
            </Link>
            <Link to="/admin/view-products" className="nav-item">
              📦 View Products
            </Link>
            <Link to="/admin/add-product" className="nav-item">
              ➕ Add Product
            </Link>
            <Link to="/admin/view-orders" className="nav-item">
              📋 View Orders
            </Link>
            <Link to="/admin/view-customers" className="nav-item">
              👥 View Customers
            </Link>
            <Link to="/admin/view-delivery-partners" className="nav-item">
              🚚 Delivery Partners
            </Link>
          </nav>
        )}

        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="user-info">
              <span>👤 {user?.name}</span>
              <small>{user?.email}</small>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`admin-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </div>
    </div>
  )
}

export default AdminLayout
