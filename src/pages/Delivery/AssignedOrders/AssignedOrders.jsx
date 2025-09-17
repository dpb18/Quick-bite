import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import DeliveryOrderService from '../../../services/DeliveryOrderService'
import './AssignedOrders.css'

const AssignedOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetchAssignedOrders()
    }
  }, [user])

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true)
      const assignedOrders = await DeliveryOrderService.getAssignedOrders(user.id)
      setOrders(assignedOrders)
      setError(null)
    } catch (err) {
      console.error('Error fetching assigned orders:', err)
      setError('Failed to load assigned orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Out for Delivery':
        return '#2196f3'
      case 'Order Ready for Pickup':
        return '#ff9800'
      case 'Delivered':
        return '#4caf50'
      case 'Order Cancelled':
        return '#f44336'
      case 'Food Processing':
        return '#ffc107'
      default:
        return '#666'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Out for Delivery':
        return 'Out for Delivery'
      case 'Order Ready for Pickup':
        return 'Ready for Pickup'
      case 'Delivered':
        return 'Delivered'
      case 'Order Cancelled':
        return 'Cancelled'
      case 'Food Processing':
        return 'Processing'
      default:
        return status
    }
  }

  const handleAcceptOrder = async (orderId) => {
    try {
      await DeliveryOrderService.acceptOrder(orderId, user.id)
      await fetchAssignedOrders() // Refresh the list
      alert('Order accepted successfully!')
    } catch (error) {
      console.error('Error accepting order:', error)
      alert('Failed to accept order. Please try again.')
    }
  }

  const handleRejectOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to reject this order?')) {
      try {
        await DeliveryOrderService.rejectOrder(orderId, user.id)
        await fetchAssignedOrders() // Refresh the list
        alert('Order rejected successfully!')
      } catch (error) {
        console.error('Error rejecting order:', error)
        alert('Failed to reject order. Please try again.')
      }
    }
  }

  const handleMarkAsDelivered = async (orderId) => {
    if (window.confirm('Are you sure you want to mark this order as delivered?')) {
      try {
        await DeliveryOrderService.markAsDelivered(orderId, user.id)
        await fetchAssignedOrders() // Refresh the list
        alert('Order marked as delivered successfully!')
      } catch (error) {
        console.error('Error marking order as delivered:', error)
        alert('Failed to update order status. Please try again.')
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="assigned-orders">
        <div className="loading">Loading assigned orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="assigned-orders">
        <div className="error">
          {error}
          <button onClick={fetchAssignedOrders}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="assigned-orders">
      <div className="orders-header">
        <h1>Assigned Orders</h1>
        <p>Manage your delivery assignments</p>
        <button onClick={fetchAssignedOrders} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h3>No assigned orders</h3>
            <p>You don't have any orders assigned to you at the moment.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.order_id}</h3>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="order-time">
                  <span>Ordered: {formatDate(order.order_date)}</span>
                  <span>Total: ₹{order.total_price}</span>
                </div>
              </div>

              <div className="customer-details">
                <h4>Customer Details</h4>
                <p><strong>Name:</strong> {order.customer_name || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.customer_phone || 'N/A'}</p>
                <p><strong>Address:</strong> {order.customer_address || 'N/A'}</p>
              </div>

              <div className="order-items">
                <h4>Order Summary</h4>
                <div className="order-item">
                  <span>Total Items: {order.total_qty}</span>
                  <span>Amount: ₹{order.total_price}</span>
                </div>
              </div>

              <div className="order-actions">
                {(order.status === 'Order Ready for Pickup' || order.status === 'Out for Delivery') && order.status !== 'Order Cancelled' && order.status !== 'Delivered' && (
                  <>
                    <button 
                      className="action-btn accept-btn"
                      onClick={() => handleAcceptOrder(order.order_id)}
                      disabled={order.status === 'Out for Delivery'}
                    >
                      {order.status === 'Out for Delivery' ? '✅ Accepted' : '✅ Accept Order'}
                    </button>
                    <button 
                      className="action-btn reject-btn"
                      onClick={() => handleRejectOrder(order.order_id)}
                      disabled={order.status === 'Out for Delivery'}
                    >
                      ❌ Reject Order
                    </button>
                  </>
                )}
                {order.status === 'Out for Delivery' && (
                  <button 
                    className="action-btn deliver-btn"
                    onClick={() => handleMarkAsDelivered(order.order_id)}
                  >
                    📦 Mark as Delivered
                  </button>
                )}
                {order.status === 'Delivered' && (
                  <div className="delivered-status">
                    <span className="delivered-badge">✅ Order Delivered</span>
                  </div>
                )}
                {order.status === 'Order Cancelled' && (
                  <div className="cancelled-status">
                    <span className="cancelled-badge">❌ Order Cancelled</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AssignedOrders
