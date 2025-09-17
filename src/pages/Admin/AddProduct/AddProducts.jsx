import { useState } from "react"
import { toast } from 'react-toastify';
import ProductService from "../../../services/ProductService"
import { useNavigate } from "react-router-dom"
import './AddProducts.css';

const AddProducts=()=>{
 
    const [name,setName]= useState('')
    const [price,setPrice] =useState(0)
    const [category,setCategory]= useState('')
    const [imgUrl,setImage]= useState('')
    const [description,setDescription]= useState('')
    const navigate = useNavigate()
 
    const handleChange=(e)=>{
        const {name,value}=e.target
        if(name==='name')
            setName(value)
        if(name==='price')
            setPrice(value)
        if(name==='category')
           setCategory(value)
        if(name==='imgUrl')
           setImage(value)
        if(name==='description')
           setDescription(value)
    }
    
 
    const handleSubmit=(e)=>{
        e.preventDefault()
        
        const product={
            name,
            price: Number(price),
            category,
            imgUrl,
            description
        }
        ProductService.addProduct(product)
        .then(response=>{
            console.log('Product added, showing toast...');
            toast.success('Product added successfully!'); 
            setName('');
            setPrice(0);
            setCategory('');
            setImage('');
            setDescription('');
            // Add a small delay before navigation to let the toast show
            setTimeout(() => {
                navigate('/');
            }, 1500);
        })
        .catch(error=>{
            console.log('Error adding product:', error);
            toast.error('Failed to add product. Please try again.');
        })
       
    }

 
    return(
        <div className="add-product-container">
        <h1 className="add-product-title">Add Food Item</h1>
        <form className="add-product-form">
            <div className="form-group">
            <label>Food Name:</label>
            <input type='text' name="name" onChange={handleChange} value={name} className="form-input" placeholder="Enter food name" />
            </div>

            <div className="form-group">
            <label>Image URL:</label>
            <input type='text' name="imgUrl" onChange={handleChange} value={imgUrl} className="form-input" placeholder="Paste image URL" />
            </div>

            <div className="form-group">
            <label>Food Price:</label>
            <input type='number' name="price" onChange={handleChange} value={price} className="form-input" placeholder="Enter price" />
            </div>

            <div className="form-group">
            <label>Description:</label>
            <input type='text' name="description" onChange={handleChange} value={description} className="form-input" placeholder="Enter description" />
            </div>

            <div className="form-group">
            <label>Food Category:</label>
            <select name="category" onChange={handleChange} value={category} className="form-input">
                <option value="">Select Category</option>
                <option>Salad</option>
                <option>Rolls</option>
                <option>Deserts</option>
                <option>Sandwich</option>
                <option>Cake</option>
                <option>Pure Veg</option>
                <option>Pasta</option>
                <option>Noodles</option>
            </select>
            </div>
            <div className="form-group">
                <button onClick={handleSubmit} className="submit-btn">Submit</button>
            </div>
        </form>
        </div>
    )
}
 
export default AddProducts