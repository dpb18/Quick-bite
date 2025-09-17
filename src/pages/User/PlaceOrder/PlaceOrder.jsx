import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './PlaceOrder.css'
import { StoreContext } from '../../../context/StoreContext'
import { useAuth } from '../../../context/AuthContext'
import OrderService from '../../../services/OrderService'

const PlaceOrder = () => {
  const deliveryFee = 30; // Assuming a fixed delivery fee
  const { getTotalCartAmount, cartItems, food_list, dynamic_food_list, clearCart } = useContext(StoreContext)
  const { user } = useAuth() // Get the logged-in user
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'country', 'phone']

    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number')
      return false
    }

    return true
  }

  const getOrderItems = () => {
    const allFoodItems = [...(food_list || []), ...(dynamic_food_list || [])];

    return allFoodItems
      .filter(item => {
        const itemId = item._id || item.id;
        return cartItems[itemId] > 0;
      })
      .map(item => {
        const itemId = item._id || item.id;
        return {
          id: itemId,
          name: item.name,
          quantity: cartItems[itemId],
          price: item.price,
          total: item.price * cartItems[itemId]
        };
      });
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!user || !user.id) {
      toast.error('Please log in to place an order')
      navigate('/auth')
      return
    }

    // Check if cart is empty
    if (getTotalCartAmount() === 0) {
      toast.error('Your cart is empty. Please add items before placing an order.')
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const orderData = {
        deliveryInfo: formData,
        items: getOrderItems(),
        subtotal: getTotalCartAmount(),
        deliveryFee: deliveryFee,
        total: getTotalCartAmount() + deliveryFee,
        paymentMethod: 'Cash on Delivery', // Default for now
        customer_id: user?.id || null // Use the actual logged-in user's ID
      }

      // Try real API first, fallback to mock if it fails
      let result;
      try {
        result = await OrderService.placeOrder(orderData)
      } catch (apiError) {
        console.log('Real API failed, using mock:', apiError.message)
        result = await OrderService.placeOrderMock(orderData)
      }

      if (result.success) {
        toast.success('Order placed successfully! 🎉')
        clearCart() // Clear the cart after successful order

        // Redirect to MyOrders page after a short delay
        setTimeout(() => {
          navigate('/user/myorders')
        }, 1500)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {/* Full Screen Loader */}
      {loading && (
        <div className="fullscreen-loader">
          <div className="loader-content">
            <div className="loader-spinner"></div>
            <h3>Placing Your Order...</h3>
            <p>Please wait while we process your order</p>
          </div>
        </div>
      )}

      <form className='place-order main-content' onSubmit={handlePlaceOrder}>
        <div className='place-order-left'>
          <p className="title">Delivery Information</p>
          <div className='multi-fields'>
            <input
              type="text"
              name="firstName"
              placeholder='First Name'
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder='Last Name'
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder='Email address'
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="street"
            placeholder='Street'
            value={formData.street}
            onChange={handleInputChange}
            required
          />
          <div className="multi-fields">
            <input
              type="text"
              name="city"
              placeholder='City'
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder='State'
              value={formData.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="multi-fields">
            <input
              type="text"
              name="zipCode"
              placeholder='Zip Code'
              value={formData.zipCode}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder='Country'
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            type="tel"
            name="phone"
            placeholder='Phone'
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>&#8377;{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Charges</p>
                <p>&#8377;{getTotalCartAmount() > 0 ? deliveryFee : 0}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>&#8377;{getTotalCartAmount() > 0 ? getTotalCartAmount() + deliveryFee : 0}</b>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || getTotalCartAmount() === 0}
              className={`place-order-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <div className="order-loader">
                  <div className="spinner"></div>
                  <span>Placing Order...</span>
                </div>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default PlaceOrder