import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthService from '../../services/AuthService'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import './Auth.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    role: 'customer' // default role
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      }
      
      // Clear fields that are not needed for the selected role
      if (name === 'role') {
        if (value === 'admin') {
          // Admin only needs name, email, password
          newData.phone = ''
          newData.location = ''
        } else if (value === 'delivery-partner') {
          // Delivery partner needs name, email, phone, password (no location)
          newData.location = ''
        }
        // Customer keeps all fields
      }
      
      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Role-specific validation
    if ((formData.role === 'customer' || formData.role === 'delivery-partner') && !formData.phone.trim()) {
      toast.error('Phone number is required')
      setLoading(false)
      return
    }

    if (formData.role === 'customer' && !formData.location.trim()) {
      toast.error('Location is required for customers')
      setLoading(false)
      return
    }

    try {
      // Prepare user data based on role
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }

      // Add role-specific fields
      if (formData.role === 'customer') {
        userData.phone = formData.phone
        userData.location = formData.location
      } else if (formData.role === 'delivery-partner') {
        userData.phone = formData.phone
      }
      // Admin doesn't need phone or location

      const response = await AuthService.register(userData)
      
      // Login the user with the returned data
      login(response.user)
      toast.success('Account created successfully!')
      
      // Navigate based on role
      if (formData.role === 'admin') {
        navigate('/admin')
      } else if (formData.role === 'delivery-partner') {
        navigate('/delivery')
      } else {
        navigate('/user')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="auth-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${assets.landing_img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>QuickBite</h1>
          <h2>Create your account</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role selection moved to top */}
          <div className="form-group">
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="delivery-partner">Delivery Partner</option>
            </select>
          </div>

          {/* Common fields for all roles */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Conditional fields based on role */}
          {(formData.role === 'customer' || formData.role === 'delivery-partner') && (
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
          )}

          {formData.role === 'customer' && (
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter your location"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            type="button" 
            className="back-button" 
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
          <p><Link to="/">Back to Landing Page</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup
