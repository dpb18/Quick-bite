import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalDeliveryPartners: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch customers
      const customersResponse = await fetch('http://localhost:3001/customers');
      const customers = customersResponse.ok ? await customersResponse.json() : [];
      
      // Fetch delivery partners
      const deliveryResponse = await fetch('http://localhost:3001/delivery-partners');
      const deliveryPartners = deliveryResponse.ok ? await deliveryResponse.json() : [];
      
      // For now, we'll use mock data for orders and revenue
      // In a real application, you would fetch this from your orders API
      const mockOrders = 156; // You can replace this with actual API call
      const mockRevenue = 12450.75; // You can replace this with actual API call
      
      setStats({
        totalOrders: mockOrders,
        totalCustomers: customers.length,
        totalDeliveryPartners: deliveryPartners.length,
        totalRevenue: mockRevenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default values if API calls fail
      setStats({
        totalOrders: 156,
        totalCustomers: 24,
        totalDeliveryPartners: 12,
        totalRevenue: 12450.75
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to your admin portal</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-number">{stats.totalOrders}</div>
          <p className="stat-text">Orders processed</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Customers</h3>
          <div className="stat-number">{stats.totalCustomers}</div>
          <p className="stat-text">Registered users</p>
        </div>
        
        <div className="stat-card">
          <h3>Delivery Partners</h3>
          <div className="stat-number">{stats.totalDeliveryPartners}</div>
          <p className="stat-text">Active partners</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-number">₹{stats.totalRevenue.toFixed(2)}</div>
          <p className="stat-text">Revenue earned</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">�</div>
            <div className="activity-details">
              <h4>New Order Received</h4>
              <p>Order #1234 placed by customer</p>
              <span className="activity-time">15 minutes ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">�</div>
            <div className="activity-details">
              <h4>New Customer Registered</h4>
              <p>Customer signed up successfully</p>
              <span className="activity-time">45 minutes ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">🚚</div>
            <div className="activity-details">
              <h4>Delivery Partner Added</h4>
              <p>New delivery partner joined the platform</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">🍕</div>
            <div className="activity-details">
              <h4>New Product Added</h4>
              <p>Pizza Margherita added to menu</p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
