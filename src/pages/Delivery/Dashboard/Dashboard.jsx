import React from 'react'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className="delivery-dashboard">
      <div className="dashboard-header">
        <h1>Delivery Partner Dashboard</h1>
        <p>Welcome to your delivery partner portal</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Today's Deliveries</h3>
          <div className="stat-number">12</div>
          <p className="stat-text">Orders completed</p>
        </div>
        
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <div className="stat-number">3</div>
          <p className="stat-text">Ready for pickup</p>
        </div>
        
        <div className="stat-card">
          <h3>Earnings Today</h3>
          <div className="stat-number">₹1,200</div>
          <p className="stat-text">Total earned</p>
        </div>
        
        <div className="stat-card">
          <h3>Rating</h3>
          <div className="stat-number">4.8</div>
          <p className="stat-text">Customer rating</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📦</div>
            <div className="activity-details">
              <h4>Order #1234 Delivered</h4>
              <p>Successfully delivered to customer at 2:30 PM</p>
              <span className="activity-time">30 minutes ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">🚚</div>
            <div className="activity-details">
              <h4>Order #1235 Picked Up</h4>
              <p>Picked up from QuickBite Restaurant</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">⭐</div>
            <div className="activity-details">
              <h4>5-Star Rating Received</h4>
              <p>Customer rated your service</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
