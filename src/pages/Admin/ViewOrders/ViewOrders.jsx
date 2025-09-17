import React, { useState, useEffect } from 'react';
import './ViewOrders.css';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for delivery partner assignment
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/orders');
            
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            
            const ordersData = await response.json();
            console.log('Fetched orders:', ordersData);
            setOrders(ordersData);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, []);

    // Function to update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // Update local state
            setOrders(orders.map(order => 
                order.order_id === orderId 
                    ? { ...order, status: newStatus }
                    : order
            ));

            alert(`Order status updated to: ${newStatus}`);
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status. Please try again.');
        }
    };

    // Function to fetch available delivery partners
    const fetchDeliveryPartners = async () => {
        try {
            const response = await fetch('http://localhost:3001/delivery-partners');
            if (!response.ok) {
                throw new Error('Failed to fetch delivery partners');
            }
            const partners = await response.json();
            // Filter only available partners
            const availablePartners = partners.filter(partner => 
                partner.available === true || partner.available === 1
            );
            setDeliveryPartners(availablePartners);
        } catch (err) {
            console.error('Error fetching delivery partners:', err);
            alert('Failed to load delivery partners');
        }
    };

    // Function to show assignment modal
    const openAssignModal = (orderId) => {
        setSelectedOrderId(orderId);
        setShowAssignModal(true);
        fetchDeliveryPartners(); // Load delivery partners when modal opens
    };

    // Function to assign delivery partner to order
    const assignDeliveryPartner = async (partnerId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${selectedOrderId}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delivery_partner_id: partnerId })
            });

            if (!response.ok) {
                throw new Error('Failed to assign delivery partner');
            }

            // Update the orders list to reflect the assignment
            await fetchOrders();
            setShowAssignModal(false);
            setSelectedOrderId(null);
            alert('Delivery partner assigned successfully!');
        } catch (err) {
            console.error('Error assigning delivery partner:', err);
            alert('Failed to assign delivery partner. Please try again.');
        }
    };

    // Function to close assignment modal
    const closeAssignModal = () => {
        setShowAssignModal(false);
        setSelectedOrderId(null);
    };
    // Function to get status color
    const getStatusColor = (status) => {
        if (status === 'Food Processing') return '#ffc107';
        if (status === 'Order Ready for Pickup') return '#17a2b8';
        if (status === 'Out for Delivery') return '#fd7e14';
        if (status === 'Delivered') return '#28a745';
        if (status === 'Order Cancelled') return '#dc3545';
        return '#6c757d';
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="view-orders">
                <h2>View Orders</h2>
                <div className="loading">Loading orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-orders">
                <h2>View Orders</h2>
                <div className="error">
                    Error: {error}
                    <button onClick={fetchOrders} className="retry-btn">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="view-orders">
            <h2>View Orders</h2>
            <div className="orders-header">
                <p>Total Orders: {orders.length}</p>
            </div>
            <div className="orders-container">
                {orders.length === 0 ? (
                    <div className="no-orders">No orders found</div>
                ) : (
                    orders.map((order) => (
                        <div key={order.order_id} className="order-card">
                            <div className="order-header">
                                <h3>Order ID: {order.order_id}</h3>
                                <span 
                                    className="status-badge" 
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-info">
                                <div className="customer-info">
                                    <p><strong>Customer:</strong> {order.customer_name || 'N/A'}</p>
                                    <p><strong>Customer ID:</strong> {order.customer_id}</p>
                                    <p><strong>Order Date:</strong> {formatDate(order.order_date)}</p>
                                    {order.delivery_partner_name && (
                                        <p><strong>Delivery Partner:</strong> {order.delivery_partner_name}</p>
                                    )}
                                </div>

                                <div className="order-details">
                                    <p><strong>Items Quantity:</strong> {order.total_qty}</p>
                                    <p><strong>Total Amount:</strong> ₹{order.total_price}</p>
                                    {order.otp_order && (
                                        <p><strong>OTP:</strong> {order.otp_order}</p>
                                    )}
                                </div>
                            </div>

                            <div className="order-actions">
                                <h4>Update Delivery Status:</h4>
                                <div className="buttons-container">
                                    <div className="status-buttons-group">
                                        <button
                                            className="status-btn processing"
                                            onClick={() => updateOrderStatus(order.order_id, 'Food Processing')}
                                            disabled={order.status === 'Food Processing'}
                                        >
                                            Food Processing
                                        </button>
                                        <button
                                            className="status-btn pickup"
                                            onClick={() => updateOrderStatus(order.order_id, 'Order Ready for Pickup')}
                                            disabled={order.status === 'Order Ready for Pickup'}
                                        >
                                            Ready for Pickup
                                        </button>
                                        <button
                                            className="status-btn delivery"
                                            onClick={() => updateOrderStatus(order.order_id, 'Out for Delivery')}
                                            disabled={order.status === 'Out for Delivery'}
                                        >
                                            Out for Delivery
                                        </button>
                                    </div>

                                    {/* Assign Delivery Partner Section */}
                                    <div className="assign-partner-section">
                                        <button
                                            className="assign-btn"
                                            onClick={() => openAssignModal(order.order_id)}
                                            disabled={order.status === 'Delivered'}
                                        >
                                            {order.delivery_partner_name ? 
                                                `Assigned to: ${order.delivery_partner_name}` : 
                                                'Assign Delivery Partner'
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Simple Modal for Delivery Partner Assignment */}
            {showAssignModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Assign Delivery Partner</h3>
                        <p>Select a delivery partner for Order #{selectedOrderId}:</p>
                        
                        <div className="partner-list">
                            {deliveryPartners.length === 0 ? (
                                <p style={{textAlign: 'center', color: '#666', padding: '20px'}}>
                                    No available delivery partners found. 
                                    Please ask delivery partners to set their status to "Available".
                                </p>
                            ) : (
                                deliveryPartners.map(partner => (
                                    <div key={partner.partner_id} className="partner-item">
                                        <span className="partner-info">
                                            <strong>{partner.name}</strong> - {partner.phone}
                                            <span style={{color: '#4CAF50', fontSize: '0.9rem', marginLeft: '10px'}}>
                                                🟢 Available
                                            </span>
                                        </span>
                                        <button
                                            className="select-partner-btn"
                                            onClick={() => assignDeliveryPartner(partner.partner_id)}
                                        >
                                            Select
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={closeAssignModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewOrders;
