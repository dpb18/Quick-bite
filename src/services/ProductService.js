import axios from 'axios';

class ProductService {
  constructor() {
    this.baseURL = 'http://localhost:3001';
  }

  // Get all products
  async getAllProducts() {
    try {
      const response = await axios.get(`${this.baseURL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(id) {
    try {
      const response = await axios.get(`${this.baseURL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Add new product
  async addProduct(productData) {
    try {
      const response = await axios.post(`${this.baseURL}/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id, productData) {
    try {
      const response = await axios.put(`${this.baseURL}/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await axios.delete(`${this.baseURL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Mock data for when backend is not available
  getMockProducts() {
    return [
      {
        id: 1,
        name: 'Margherita Pizza',
        category: 'Pizza',
        price: 299,
        description: 'Classic margherita with fresh basil and mozzarella',
        image: '/src/assets/food_1.png'
      },
      {
        id: 2,
        name: 'Chicken Biryani',
        category: 'Rice',
        price: 349,
        description: 'Aromatic basmati rice with tender chicken',
        image: '/src/assets/food_2.png'
      },
      {
        id: 3,
        name: 'Burger Deluxe',
        category: 'Burger',
        price: 199,
        description: 'Juicy beef patty with fresh vegetables',
        image: '/src/assets/food_3.png'
      }
    ];
  }
}

export default new ProductService();
