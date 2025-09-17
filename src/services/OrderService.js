const OrderService = {
  // Place a new order
  placeOrder: async (orderData) => {
    try {
      // Transform order data to match database schema
      const dbOrderData = {
        total_qty: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
        total_price: Math.round(orderData.total), // Convert to integer (paise/cents)
        otp_order: Math.floor(1000 + Math.random() * 9000), // Generate 4-digit OTP
        status: 'Food Processing',
        customer_id: orderData.customer_id, // Use the actual customer ID from orderData
        delivery_info: orderData.deliveryInfo,
        items: orderData.items
      };

      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dbOrderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      
      // Store detailed order information locally for display purposes
      if (result.success && result.order) {
        const detailedOrder = {
          ...result.order,
          items: orderData.items, // Store the detailed items
          deliveryInfo: orderData.deliveryInfo,
          paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
          date: new Date().toISOString().split('T')[0]
        };
        
        // Get existing orders from localStorage
        const existingOrders = JSON.parse(localStorage.getItem('userOrdersDetailed') || '[]');
        
        // Add new order to the beginning of the array
        existingOrders.unshift(detailedOrder);
        
        // Keep only last 10 orders to avoid localStorage bloat
        if (existingOrders.length > 10) {
          existingOrders.splice(10);
        }
        
        // Store back to localStorage
        localStorage.setItem('userOrdersDetailed', JSON.stringify(existingOrders));
      }
      
      return result;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async (customerId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/customer/${customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const orders = await response.json();
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get detailed orders from localStorage
  getDetailedOrders: () => {
    try {
      const detailedOrders = JSON.parse(localStorage.getItem('userOrdersDetailed') || '[]');
      return detailedOrders;
    } catch (error) {
      console.error('Error getting detailed orders:', error);
      return [];
    }
  },

  // Merge API orders with detailed local orders
  getMergedOrders: async (customerId) => {
    try {
      // Get detailed orders from localStorage
      const detailedOrders = OrderService.getDetailedOrders();
      
      // Try to get orders from API
      let apiOrders = [];
      try {
        apiOrders = await OrderService.getUserOrders(customerId);
      } catch (apiError) {
        console.log('API orders not available:', apiError.message);
      }
      
      // Create a map of detailed orders by order_id for quick lookup
      const detailedOrdersMap = {};
      detailedOrders.forEach(order => {
        if (order.order_id) {
          detailedOrdersMap[order.order_id] = order;
        }
      });
      
      // Merge API orders with detailed information
      const mergedOrders = apiOrders.map(apiOrder => {
        const detailedOrder = detailedOrdersMap[apiOrder.order_id];
        if (detailedOrder) {
          return {
            ...apiOrder,
            items: detailedOrder.items,
            deliveryInfo: detailedOrder.deliveryInfo,
            paymentMethod: detailedOrder.paymentMethod
          };
        }
        return apiOrder;
      });
      
      // Add any detailed orders that weren't found in API
      detailedOrders.forEach(detailedOrder => {
        const existsInMerged = mergedOrders.some(order => order.order_id === detailedOrder.order_id);
        if (!existsInMerged) {
          mergedOrders.push(detailedOrder);
        }
      });
      
      // Sort by date (newest first)
      mergedOrders.sort((a, b) => {
        const dateA = new Date(a.order_date || a.date || 0);
        const dateB = new Date(b.order_date || b.date || 0);
        return dateB - dateA;
      });
      
      return mergedOrders;
    } catch (error) {
      console.error('Error merging orders:', error);
      // Fallback to detailed orders only
      return OrderService.getDetailedOrders();
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Mock function for demonstration (remove when backend is ready)
  placeOrderMock: async (orderData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock order matching database schema
    const mockOrder = {
      order_id: Math.floor(Math.random() * 10000),
      order_date: new Date().toISOString(),
      total_qty: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
      total_price: Math.round(orderData.total),
      otp_order: Math.floor(1000 + Math.random() * 9000),
      status: 'Food Processing',
      delivery_partner_id: null, // Will be assigned later
      customer_id: 101, // Mock customer ID from database
      deliveryInfo: orderData.deliveryInfo,
      items: orderData.items,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      date: new Date().toISOString().split('T')[0],
      // Additional fields for frontend display
      _id: `order_${Date.now()}`,
      orderId: `QB${Math.floor(Math.random() * 10000)}`,
    };

    // Store in localStorage for persistence
    const existingOrders = JSON.parse(localStorage.getItem('userOrdersDetailed') || '[]');
    existingOrders.unshift(mockOrder);
    
    // Keep only last 10 orders
    if (existingOrders.length > 10) {
      existingOrders.splice(10);
    }
    
    localStorage.setItem('userOrdersDetailed', JSON.stringify(existingOrders));

    return {
      success: true,
      order: mockOrder
    };
  },

  // Update order status (for admin/delivery partner)
  updateOrderStatus: async (orderId, status, deliveryPartnerId = null) => {
    try {
      const updateData = { status };
      if (deliveryPartnerId) {
        updateData.delivery_partner_id = deliveryPartnerId;
      }

      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Assign delivery partner to order
  assignDeliveryPartner: async (orderId, deliveryPartnerId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ delivery_partner_id: deliveryPartnerId })
      });

      if (!response.ok) {
        throw new Error('Failed to assign delivery partner');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error assigning delivery partner:', error);
      throw error;
    }
  }
};

export default OrderService;
