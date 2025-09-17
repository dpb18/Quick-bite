// DeliveryPartnerService.js
import API_CONFIG from '../config/api';

class DeliveryPartnerService {
    static async updateAvailability(partnerId, available) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/delivery-partners/${partnerId}/availability`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ available })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update availability');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating availability:', error);
            throw error;
        }
    }
    
    static async getAvailability(partnerId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/delivery-partners/${partnerId}/availability`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch availability');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching availability:', error);
            throw error;
        }
    }
}

export default DeliveryPartnerService;
