import { useState, useEffect } from "react"
import { toast } from 'react-toastify';
import ProductService from "../../../services/ProductService"
import { useNavigate, useParams } from "react-router-dom"
import './AddProducts.css';

const EditProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [imgUrl,setImage]= useState('');
    const [description,setDescription]= useState('')

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        ProductService.getProductById(id)
            .then((response) => {
                setName(response.data.name);
                setPrice(response.data.price);
                setCategory(response.data.category);
                setImage(response.data.imgUrl);
                setDescription(response.data.description);
            })
            .catch((error) => console.log(error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") setName(value);
        if (name === "price") setPrice(value);
        if (name === "category") setCategory(value);
        if (name === "imgUrl") setImage(value);
        if (name === "description") setDescription(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const product = { name, price: String(price),imgUrl,category: String(category),description: String(description) };
        ProductService.updateProduct(id, product)
            .then((response) => {
                toast.success("Product updated successfully!");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            })
            .catch((error) => {
                console.log(error);
                toast.error('Failed to update product. Please try again.');
            });
    };

    return (
        <div className="add-product-container">
            <h1 className="add-product-title">Edit Food Item</h1>
            <form className="add-product-form">
                <div className="form-group">
                    <label>Food Name:</label>
                    <input type="text" name="name" value={name} onChange={handleChange} className="form-input" placeholder="Enter food name" />
                </div>
                <div className="form-group">
                    <label>Image URL:</label>
                    <input type="text" name="imgUrl" value={imgUrl} onChange={handleChange} className="form-input" placeholder="Paste image URL" />
                </div>
                <div className="form-group">
                    <label>Food Price:</label>
                    <input type="number" name="price" value={price} onChange={handleChange} className="form-input" placeholder="Enter price" />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input type="text" name="description" value={description} onChange={handleChange} className="form-input" placeholder="Enter description" />
                </div>
                <div className="form-group">
                    <label>Food Category:</label>
                    <select name="category" onChange={handleChange} value={category} className="form-input">
                        <option value="">Select Category</option>
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                    </select>
                </div>
                <div className="form-group">
                    <button onClick={handleSubmit} className="submit-btn">Update</button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
