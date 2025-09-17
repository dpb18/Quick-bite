import React, { useState, useContext } from 'react'
import { assets } from '../../../assets/assets'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../context/StoreContext';
import { useAuth } from '../../../context/AuthContext';

const Navbar = () => {
    const [menu,setMenu] = useState("about");
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const {cartItems, food_list, dynamic_food_list, addToCart, removeFromCart} = useContext(StoreContext);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // Function to handle search
    const handleSearch = (text) => {
        setSearchText(text);
        if (text.length > 0) {
            // Use dynamic food list first, then fallback to static
            const searchList = dynamic_food_list.length > 0 ? dynamic_food_list : food_list;
            const results = searchList.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase()) ||
                item.category.toLowerCase().includes(text.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }

    // Function to toggle search box
    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (showSearch) {
            setSearchText("");
            setSearchResults([]);
        }
    }

    // Function to close search
    const closeSearch = () => {
        setShowSearch(false);
        setSearchText("");
        setSearchResults([]);
    }

    // Function to add item to cart from search
    const handleAddToCart = (itemId) => {
        addToCart(itemId);
        // Optional: show a brief success message or close search
    }

    // Function to handle logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    }
  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" className='logo'/>
        <ul className='navbar-menu'>
         <Link to='/user'> <li onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</li> </Link>  
         <Link to='/user/about'>   <li onClick={()=>setMenu("about")} className={menu==="about"?"active":""}>About</li> </Link>
         <Link to='/user/contact'>  <li onClick={()=>setMenu("contact")} className={menu==="contact"?"active":""}>Contact</li> </Link>
         <Link to='/quickbite-digital'>   <li onClick={()=>setMenu("digital")} className={menu==="digital"?"active":""}>QuickBite digital</li></Link>
        </ul>
        <div className='navbar-right'>
            <img 
                src={assets.search_icon} 
                alt='Search' 
                className='search-icon'
                onClick={toggleSearch}
            />
            <div className='navbar-search-icon'>
                <Link to={"/user/cart"}>
                <img  src={assets.basket_icon} alt="" />
                </Link>
                <div className={`dot ${Object.values(cartItems).some(qty => qty > 0) ? 'dot-green' : ''}`}></div>
            </div>
            
            {isAuthenticated ? (
                <div className="navbar-profile">
                    <img src={assets.profile_icon} alt="Profile" className="profile-icon" />
                    <div className="profile-dropdown">
                        <div className="profile-info">
                            <p>{user?.name}</p>
                            <small>{user?.email}</small>
                            {user?.phone && <small>📞 {user.phone}</small>}
                            {user?.location && <small>📍 {user.location}</small>}
                        </div>
                        <Link to="/user/myorders">My Orders</Link>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            ) : (
                <Link to="/login">
                    <button>Login</button>
                </Link>
            )}
        </div>

        {/* Search Box */}
        {showSearch && (
            <div className='search-overlay' onClick={closeSearch}>
                <div className='search-box' onClick={(e) => e.stopPropagation()}>
                    <div className='search-header'>
                        <h3>Search Food Items</h3>
                        <button onClick={closeSearch} className='close-search'>×</button>
                    </div>
                    
                    <div className='search-input-container'>
                        <input 
                            type="text" 
                            placeholder="Search by food name or category..."
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            className='search-input'
                            autoFocus
                        />
                    </div>
                    
                    {/* Search Results */}
                    <div className='search-results'>
                        {searchText.length === 0 && (
                            <div className='search-placeholder'>
                                <p>Start typing to search for delicious food items...</p>
                            </div>
                        )}
                        {searchText.length > 0 && searchResults.length === 0 && (
                            <div className='no-results'>
                                <p>No food items found for "{searchText}"</p>
                                <small>Try searching with different keywords</small>
                            </div>
                        )}
                        {searchResults.map((item) => (
                            <div key={item._id || item.id} className='search-result-item'>
                                <div className='item-image-container'>
                                    <img src={item.image} alt={item.name} className='item-image' />
                                    {!cartItems[item._id || item.id]
                                        ? <img 
                                            className='search-add-icon' 
                                            onClick={() => addToCart(item._id || item.id)} 
                                            src={assets.add_icon_white}
                                            alt="Add to cart"
                                          />
                                        : <div className='search-item-counter'>
                                            <img 
                                                onClick={() => removeFromCart(item._id || item.id)} 
                                                src={assets.remove_icon_red} 
                                                alt="Remove" 
                                            />
                                            <p>{cartItems[item._id || item.id]}</p>
                                            <img 
                                                onClick={() => addToCart(item._id || item.id)} 
                                                src={assets.add_icon_green} 
                                                alt="Add more" 
                                            />
                                          </div>
                                    }
                                </div>
                                <div className='item-details'>
                                    <h4>{item.name}</h4>
                                    <p className='item-category'>{item.category}</p>
                                    <p className='item-description'>{item.description}</p>
                                    <span className='item-price'>₹{item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

    </div>
  )
}

export default Navbar