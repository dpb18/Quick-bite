import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../../context/StoreContext';
import OrderService from '../../../services/OrderService';
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
            setLoading(true);
            
            // Use the new merged orders function that combines API and detailed localStorage data
            const mergedOrders = await OrderService.getMergedOrders(101);
            
            // Combine with dummy orders for demonstration
            const allOrders = [...mergedOrders, ...dummyOrders];
            
            // Remove duplicates based on _id or order_id
            const uniqueOrders = allOrders.filter((order, index, self) => 
                index === self.findIndex(o => 
                    (o._id && o._id === order._id) || 
                    (o.order_id && o.order_id === order.order_id)
                )
            );
            
            setData(uniqueOrders);
            console.log('All orders loaded with detailed items:', uniqueOrders);
            
        } catch (error) {
            console.log('Error fetching orders, using dummy data:', error.message);
            // If everything fails, show dummy orders + local detailed orders
            const detailedOrders = OrderService.getDetailedOrders();
            setData([...detailedOrders, ...dummyOrders]);
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
            case 'order ready for pickup': return '#17a2b8';
            case 'order cancelled': return '#dc3545';
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
                            <div key={order._id || order.order_id || index} className='myorders-order'>
                                <img src={assets.parcel_icon} alt="Order Icon" />
                                
                                <p className="order-items">
                                    {order.items ? order.items.map((item, index) => {
                                        if (index === order.items.length - 1) {
                                            return item.name + " x " + item.quantity;
                                        } else {
                                            return item.name + " x " + item.quantity + ", ";
                                        }
                                    }) : `${order.total_qty || 1} items ordered`}
                                </p>
                                
                                <p className="order-amount">₹{order.amount || order.total || order.total_price}</p>
                                
                                <p className="order-status">
                                    <span style={{ color: getStatusColor(order.status) }}>&#x25cf;</span> 
                                    <b>{order.status}</b>
                                </p>
                                
                                <button 
                                    onClick={() => {
                                        const displayId = order.orderId || `QB${order.otp_order}` || order._id || order.order_id || 'ID_' + (index + 1);
                                        alert(`Tracking order ${displayId}`);
                                        fetchOrders();
                                    }}
                                    className="track-btn"
                                >
                                    Track Order
                                </button>
                                
                                <div className="order-details">
                                    <p className="order-items-count">Items: {order.items ? order.items.length : (order.total_qty || 1)}</p>
                                    {(order.deliveryInfo && order.deliveryInfo.city) && (
                                        <p className="delivery-location">📍 {order.deliveryInfo.city}, {order.deliveryInfo.state}</p>
                                    )}
                                </div>
                                
                                <div className="order-meta">
                                    {(order.date || order.order_date) && (
                                        <p className="order-date">
                                            📅 {order.date || new Date(order.order_date).toLocaleDateString()}
                                        </p>
                                    )}
                                    {(order.orderId || order.otp_order) && (
                                        <p className="order-id">
                                            🏷️ {order.orderId || `QB${order.otp_order}`}
                                        </p>
                                    )}
                                    {order.paymentMethod && (
                                        <p className="payment-method">💳 {order.paymentMethod}</p>
                                    )}
                                </div>
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