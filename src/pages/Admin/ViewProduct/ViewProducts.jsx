import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import ProductService from "../../../services/ProductService";
import './ViewProducts.css';
 
const ViewProducts = () => {
 
    const [products,setProducts] = useState([]);
    const fetchProducts = () => {
        ProductService.getAllProducts().then((response) => {
            setProducts(response);
        }).catch((error) => {
            console.error('Error fetching products:', error);
            // Use mock data as fallback
            setProducts(ProductService.getMockProducts());
        });
    }
 
    const deleteProduct = (id) => {
        if(window.confirm("Are you sure to delete?"))
        ProductService.deleteProduct(id).then(()=>{
            toast.success('Product deleted successfully!');
            fetchProducts();
        }).catch(error=>{
            console.log(error);
            toast.error('Failed to delete product. Please try again.');
        })
    };
 
    const productList = products.map(product=>{
        return <div key={product.id} className="product-card">
            <img src={product.imgUrl} alt={product.name} className="product-img" />
            <div className="product-name">{product.name}</div>
            <div className="product-price">₹{product.price}</div>
            <div className="product-category">{product.category}</div>
            <div className="product-description">{product.description}</div>
            <div className="product-actions">
                <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
                <Link to={`/editProduct/${product.id}`} className="edit-btn">Edit</Link>
            </div>
        </div>
    });
 
    useEffect(()=>{
        fetchProducts();
    },[])
    return (
        <div className="view-products-container">
            <h1 className="products-title">Food Dishes</h1>
            <div className="products-list">
                {productList}
            </div>
        </div>
    );
}
 
export default ViewProducts;