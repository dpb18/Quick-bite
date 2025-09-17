// OrderService.js for Delivery Partners
import API_CONFIG from '../config/api';

class DeliveryOrderService {
    static async getAssignedOrders(partnerId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/delivery-partner/${partnerId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch assigned orders');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching assigned orders:', error);
            throw error;
        }
    }
    
    static async acceptOrder(orderId, partnerId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderId}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delivery_partner_id: partnerId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to accept order');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error accepting order:', error);
            throw error;
        }
    }
    
    static async rejectOrder(orderId, partnerId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delivery_partner_id: partnerId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to reject order');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error rejecting order:', error);
            throw error;
        }
    }
    
    static async markAsDelivered(orderId, partnerId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderId}/delivered`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delivery_partner_id: partnerId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to mark order as delivered');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error marking order as delivered:', error);
            throw error;
        }
    }
}

export default DeliveryOrderService;
