import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../../assets/assets';
 
const MyOrders = () => {
 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { url, token } = useContext(StoreContext);

    // Dummy order data for demonstration
    const dummyOrders = [
        {
            _id: "order_001",
            items: [
                { name: "Caesar Salad", quantity: 2 },
                { name: "Pasta Carbonara", quantity: 1 }
            ],
            amount: 450,
            status: "Food Processing",
            date: "2024-09-14"
        },
        {
            _id: "order_002", 
            items: [
                { name: "Margherita Pizza", quantity: 1 },
                { name: "Garlic Bread", quantity: 2 }
            ],
            amount: 680,
            status: "Out for Delivery",
            date: "2024-09-13"
        },
        {
            _id: "order_003",
            items: [
                { name: "Chicken Burger", quantity: 1 },
                { name: "French Fries", quantity: 1 },
                { name: "Coke", quantity: 2 }
            ],
            amount: 520,
            status: "Delivered",
            date: "2024-09-12"
        }
    ];
 
    const fetchOrders = async () => {
        try {
            
            
                // If no real orders found, use dummy data
                setData(dummyOrders);
                console.log('Using dummy orders data');
            
        } catch (error) {
            console.log('Error fetching orders, using dummy data:', error.message);
            // If API call fails, show dummy orders
            setData(dummyOrders);
        } finally {
            setLoading(false);
        }
    };
 
    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
            // If no token, show dummy data
            setData(dummyOrders);
            setLoading(false);
        }
    }, [token]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return '#28a745';
            case 'out for delivery': return '#fd7e14';
            case 'food processing': return '#ffc107';
            default: return '#6c757d';
        }
    };
 
  return (
    <div className='myorders main-content'>
        <h2>My Orders</h2>
        
        {loading ? (
            <div className="loading">
                <p>Loading your orders...</p>
            </div>
        ) : (
            <div className="container">
                {data.length === 0 ? (
                    <div className="no-orders">
                        <p>No orders found. Place your first order now!</p>
                    </div>
                ) : (
                    data.map((order, index) => {
                        return (
                            <div key={order._id || index} className='myorders-order'>
                                <img src={assets.parcel_icon} alt="Order Icon" />
                                <p className="order-items">
                                    {order.items.map((item, index) => {
                                        if (index === order.items.length - 1) {
                                            return item.name + " x " + item.quantity;
                                        } else {
                                            return item.name + " x " + item.quantity + ", ";
                                        }
                                    })}
                                </p>
                                <p className="order-amount">₹{order.amount}.00</p>
                                <p className="order-items-count">Items: {order.items.length}</p>
                                <p className="order-status">
                                    <span style={{ color: getStatusColor(order.status) }}>&#x25cf;</span> 
                                    <b>{order.status}</b>
                                </p>
                                {order.date && (
                                    <p className="order-date">Date: {order.date}</p>
                                )}
                                <button 
                                    onClick={() => {
                                        alert(`Tracking order ${order._id || 'ID_' + (index + 1)}`);
                                        fetchOrders();
                                    }}
                                    className="track-btn"
                                >
                                    Track Order
                                </button>
                            </div>
                        )
                    })
                )}
            </div>
        )}
    </div>
  )
}
 
export default MyOrders