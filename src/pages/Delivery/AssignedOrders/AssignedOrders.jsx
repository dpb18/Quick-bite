import React, { useState } from 'react'
import './AssignedOrders.css'

const AssignedOrders = () => {
  const [orders] = useState([
    {
      id: 'ORD001',
      customerName: 'John Doe',
      customerPhone: '+91 9876543210',
      address: '123 Main Street, City, State - 123456',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 299 },
        { name: 'Garlic Bread', quantity: 2, price: 149 }
      ],
      total: 597,
      status: 'ready_for_pickup',
      orderTime: '2:30 PM',
      restaurant: 'Pizza Palace'
    },
    {
      id: 'ORD002',
      customerName: 'Jane Smith',
      customerPhone: '+91 9123456789',
      address: '456 Oak Avenue, City, State - 654321',
      items: [
        { name: 'Chicken Biryani', quantity: 1, price: 349 },
        { name: 'Raita', quantity: 1, price: 59 }
      ],
      total: 408,
      status: 'picked_up',
      orderTime: '1:45 PM',
      restaurant: 'Biryani House'
    },
    {
      id: 'ORD003',
      customerName: 'Mike Johnson',
      customerPhone: '+91 9087654321',
      address: '789 Pine Road, City, State - 987654',
      items: [
        { name: 'Burger Combo', quantity: 2, price: 299 },
        { name: 'French Fries', quantity: 1, price: 99 }
      ],
      total: 697,
      status: 'ready_for_pickup',
      orderTime: '3:15 PM',
      restaurant: 'Burger Junction'
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready_for_pickup':
        return '#ff9800'
      case 'picked_up':
        return '#2196f3'
      case 'delivered':
        return '#4caf50'
      default:
        return '#666'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ready_for_pickup':
        return 'Ready for Pickup'
      case 'picked_up':
        return 'Picked Up'
      case 'delivered':
        return 'Delivered'
      default:
        return status
    }
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    // Here you would typically update the order status via API
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  return (
    <div className="assigned-orders">
      <div className="orders-header">
        <h1>Assigned Orders</h1>
        <p>Manage your delivery assignments</p>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <span 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="order-time">
                <span>Ordered at: {order.orderTime}</span>
                <span>Restaurant: {order.restaurant}</span>
              </div>
            </div>

            <div className="customer-details">
              <h4>Customer Details</h4>
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
              <p><strong>Address:</strong> {order.address}</p>
            </div>

            <div className="order-items">
              <h4>Order Items</h4>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="order-total">
                <strong>Total: ₹{order.total}</strong>
              </div>
            </div>

            <div className="order-actions">
              {order.status === 'ready_for_pickup' && (
                <button 
                  className="action-btn pickup-btn"
                  onClick={() => handleStatusUpdate(order.id, 'picked_up')}
                >
                  Mark as Picked Up
                </button>
              )}
              {order.status === 'picked_up' && (
                <button 
                  className="action-btn deliver-btn"
                  onClick={() => handleStatusUpdate(order.id, 'delivered')}
                >
                  Mark as Delivered
                </button>
              )}
              <button className="action-btn call-btn">
                📞 Call Customer
              </button>
              <button className="action-btn navigate-btn">
                🗺️ Navigate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssignedOrders
