import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Landing Page
import LandingPage from './pages/LandingPage/LandingPage'

// Auth Components
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'

// User Components
import UserLayout from './layouts/UserLayout'
import Home from './pages/User/Home/Home'
import Cart from './pages/User/Cart/Cart'
import PlaceOrder from './pages/User/PlaceOrder/PlaceOrder'
import MyOrders from './pages/User/MyOrders/MyOrders'
import About from './components/User/About/About'
import Contact from './components/User/Contact/Contact'
import QuickBiteDigital from './components/User/QuickBiteDigital/QuickBiteDigital'

// Admin Components
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/Admin/Dashboard/Dashboard'
import AddProducts from './pages/Admin/AddProduct/AddProducts'
import ViewProducts from './pages/Admin/ViewProduct/ViewProducts'
import EditProduct from './pages/Admin/EditProduct/EditProduct'
import ViewCustomer from './pages/Admin/ViewCustomer/ViewCustomer'
import ViewDeliveryPartner from './pages/Admin/ViewDeliveryPartner/ViewDeliveryPartner'
import ViewOrders from './pages/Admin/ViewOrders/ViewOrders'

// Delivery Partner Components
import DeliveryLayout from './layouts/DeliveryLayout'
import DeliveryDashboard from './pages/Delivery/Dashboard/Dashboard'
import AssignedOrders from './pages/Delivery/AssignedOrders/AssignedOrders'

import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, hasRole, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Unauthorized Component
const Unauthorized = () => (
  <div className="unauthorized">
    <h2>Unauthorized Access</h2>
    <p>You don't have permission to access this page.</p>
  </div>
)

const App = () => {
  const { isAuthenticated, hasRole } = useAuth()

  // Redirect based on user role
  const getDefaultRoute = () => {
    if (!isAuthenticated()) return '/login'
    if (hasRole('admin')) return '/admin'
    if (hasRole('delivery-partner')) return '/delivery'
    return '/user'
  }

  return (
    <div className="app">
      <Routes>
        {/* Landing Page - Default route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Public Home Page */}
        <Route path="/home" element={
          <UserLayout>
            <Home />
          </UserLayout>
        } />
        
        {/* QuickBite Digital */}
        <Route path="/quickbite-digital" element={
          <UserLayout>
            <QuickBiteDigital />
          </UserLayout>
        } />
        
        {/* User Dashboard redirect for authenticated users */}
        <Route path="/dashboard" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* User Routes */}
        <Route path="/user/*" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <UserLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/myorders" element={<MyOrders />} />
              </Routes>
            </UserLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/add-product" element={<AddProducts />} />
                <Route path="/view-products" element={<ViewProducts />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />
                <Route path="/view-customers" element={<ViewCustomer />} />
                <Route path="/view-delivery-partners" element={<ViewDeliveryPartner />} />
                <Route path="/view-orders" element={<ViewOrders />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Delivery Partner Routes */}
        <Route path="/delivery/*" element={
          <ProtectedRoute allowedRoles={['delivery-partner']}>
            <DeliveryLayout>
              <Routes>
                <Route path="/" element={<DeliveryDashboard />} />
                <Route path="/assigned-orders" element={<AssignedOrders />} />
              </Routes>
            </DeliveryLayout>
          </ProtectedRoute>
        } />
      </Routes>

      <ToastContainer />
    </div>
  )
}

export default App
