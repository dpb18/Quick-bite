import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from 'react-toastify';
import ProductService from "../../Services/ProductService"
import './AdminLogin.css';

const AdminLogin = ({ setIsAdmin }) => {
    const [userName, setUserName] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === "userName") setUserName(value)
        if (name === "pass") setPass(value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const creds = { userName, pass }
        ProductService.loginAdmin(creds)
            .then(response => {
                setUserName('')
                setPass('')
                setIsAdmin(true)
                setError('')
                toast.success('Login successful! Welcome Admin.')
                setTimeout(() => {
                    navigate("/")
                }, 1500);
            })
            .catch(error => {
                setError('Invalid username or password')
                setIsAdmin(false)
                toast.error('Login failed. Please check your credentials.')
            })
    }
    return (
        <div className="admin-login-container">
            <h2 className="admin-login-title">Admin Login</h2>
            <form className="admin-login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>User Name: </label>
                    <input type="text" name="userName" value={userName} onChange={handleChange} className="form-input" placeholder="Enter username" />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input type="password" name="pass" value={pass} onChange={handleChange} className="form-input" placeholder="Enter password" />
                </div>
                <div className="form-group">
                    <button type="submit" className="submit-btn">Login</button>
                </div>
            </form>
            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
        </div>
    )
}

export default AdminLogin