import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);
const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({})
    const [dynamicFoodList, setDynamicFoodList] = useState([])
    const [token, setToken] = useState("dummy_user_token_123")
    const url = "http://localhost:3001"

    // Fetch products from backend
    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(data => setDynamicFoodList(data))
            .catch(err => console.log('Failed to fetch products:', err));
    }, []);

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems(prev => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const clearCart = () => {
        setCartItems({})
    }
    
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        // console.log('Cart Items:', cartItems);
        // console.log('Dynamic Food List:', dynamicFoodList);
        
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                // First look in dynamic food list (backend data)
                let itemInfo = dynamicFoodList.find((product) => 
                    String(product.id) === String(item) || String(product._id) === String(item)
                );
                
                // If not found in dynamic list, then look in static list
                if (!itemInfo) {
                    itemInfo = food_list.find((product) => String(product._id) === String(item));
                    console.log('Found in static list:', itemInfo);
                } else {
                    console.log('Found in dynamic list:', itemInfo);
                }
                
                if (itemInfo) {
                    const price = Number(itemInfo.price);
                    const quantity = Number(cartItems[item]);
                    const lineTotal = price * quantity;
                    
                    console.log(`Item: ${itemInfo.name}, Price: ${price}, Quantity: ${quantity}, Line Total: ${lineTotal}`);
                    totalAmount += lineTotal;
                } else {
                    // console.log(`Item with ID ${item} not found in any list`);
                }
            }
        }
        
        return totalAmount;
    }

    const getDiscountedTotal = (promocode) => {
        const total = getTotalCartAmount();
        if (promocode === "new100") {
            return Math.max(total - 100, 0);
        }
        return total;
    }

    const searchFoodByName = (query) => {
        if (!query) return [];
        return dynamicFoodList.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    const contextValue = {
        food_list, // Static food list for display
        dynamic_food_list: dynamicFoodList, // Backend food list for cart
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        getDiscountedTotal,
        searchFoodByName,
        url,
        token,
        setToken
    }

    useEffect(() => {
        console.log(cartItems)
    }, [cartItems])

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
