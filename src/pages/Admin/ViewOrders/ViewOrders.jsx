import React, { useState } from 'react';
import './ViewOrders.css';

const ViewOrders = () => {
    // Dummy orders data (same as user frontend)
    const [orders, setOrders] = useState([
        {
            _id: "order_001",
            items: [
                { name: "Caesar Salad", quantity: 2 },
                { name: "Pasta Carbonara", quantity: 1 }
            ],
            amount: 450,
            status: "Food Processing",
            date: "2024-09-14",
            customerName: "John Doe",
            customerPhone: "+91 9876543210"
        },
        {
            _id: "order_002", 
            items: [
                { name: "Margherita Pizza", quantity: 1 },
                { name: "Garlic Bread", quantity: 2 }
            ],
            amount: 680,
            status: "Out for Delivery",
            date: "2024-09-13",
            customerName: "Jane Smith",
            customerPhone: "+91 9876543211"
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
            date: "2024-09-12",
            customerName: "Mike Johnson",
            customerPhone: "+91 9876543212"
        }
    ]);

    // Function to update order status
    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order => 
            order._id === orderId 
                ? { ...order, status: newStatus }
                : order
        ));
    };

    // Function to get status color
    const getStatusColor = (status) => {
        if (status === 'Food Processing') return '#ffc107';
        if (status === 'Out for Delivery') return '#fd7e14';
        if (status === 'Delivered') return '#28a745';
        return '#6c757d';
    };

    return (
        <div className="view-orders">
            <h2>View Orders</h2>
            <div className="orders-container">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <h3>Order ID: {order._id}</h3>
                            <span 
                                className="status-badge" 
                                style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                                {order.status}
                            </span>
                        </div>

                        <div className="order-info">
                            <div className="customer-info">
                                <p><strong>Customer:</strong> {order.customerName}</p>
                                <p><strong>Phone:</strong> {order.customerPhone}</p>
                                <p><strong>Date:</strong> {order.date}</p>
                            </div>

                            <div className="order-items">
                                <p><strong>Items:</strong></p>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.name} x {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="order-amount">
                                <p><strong>Total Amount: ₹{order.amount}</strong></p>
                            </div>
                        </div>

                        <div className="order-actions">
                            <h4>Update Delivery Status:</h4>
                            <div className="status-buttons">
                                <button
                                    className="status-btn processing"
                                    onClick={() => updateOrderStatus(order._id, 'Food Processing')}
                                    disabled={order.status === 'Food Processing'}
                                >
                                    Food Processing
                                </button>
                                <button
                                    className="status-btn delivery"
                                    onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                                    disabled={order.status === 'Out for Delivery'}
                                >
                                    Out for Delivery
                                </button>
                                <button
                                    className="status-btn delivered"
                                    onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                    disabled={order.status === 'Delivered'}
                                >
                                    Delivered
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewOrders;
