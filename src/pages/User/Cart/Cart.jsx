import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './Cart.css'
import { StoreContext } from "../../../context/StoreContext";


 
const Cart = () => {
    const { cartItems, food_list, dynamic_food_list, removeFromCart, getTotalCartAmount, getDiscountedTotal } = useContext(StoreContext);
    const navigate = useNavigate();
    const deliveryFee = 30; // Assuming a fixed delivery fee

    // Use dynamic food list if available, otherwise use static food list
    const foodList = dynamic_food_list.length > 0 ? dynamic_food_list : food_list;

    const handleCheckout = () => {
        if (getTotalCartAmount() > 0) {
            navigate('/user/placeorder');
        } else {
            alert('Your cart is empty! Please add items before proceeding to checkout.');
        }
    };
 
    return (
<div className="cart main-content">
<div className="cart-items">
<div className="cart-items-title cart-items-item-header">
<p>Items</p>
<p>Title</p>
<p>Price</p>
<p>Quantity</p>
<p>Total</p>
<p>Remove</p>
</div>
<hr />
                {foodList.map((item, index) => {
                    const itemId = item.id || item._id;
                    if (cartItems[itemId] > 0) {
                        return (
<div key={itemId}>
<div className='cart-items-item'>
<img src={item.imgUrl || item.image} alt="" />
<p>{item.name}</p>
<p>&#8377;{item.price}</p>
<p>{cartItems[itemId]}</p>
<p>&#8377;{item.price * cartItems[itemId]}</p>
<p onClick={() => removeFromCart(itemId)} className="cross">x</p>
</div>
<hr />
</div>
                        )
                    }
                })}
</div>
<div className="cart-bottom">
<div className="cart-total">
<h2>Cart Totals</h2>
<div>
<div className="cart-total-details">
<p>Subtotal</p>
<p>&#8377;{getTotalCartAmount()}</p>
</div>
<hr />
<div className="cart-total-details">
<p>Delivery Charges</p>
<p>&#8377;{getTotalCartAmount() > 0 ? deliveryFee : 0}</p>
</div>
<hr />
<div className="cart-total-details">
<b>Total</b>
<b>&#8377;{getTotalCartAmount() > 0 ? getTotalCartAmount() + deliveryFee : 0}</b>
</div>
</div>
<button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
</div>
<div className="cart-promo-code">
<div>
<p>If you have a promo code, Enter it here</p>
<div className="cart-promo-code-input">
<input type="text" placeholder="promo code " />
<button onSubmit={getDiscountedTotal}>Submit</button>
</div>
</div>
</div>
</div>
</div>
    )
}
 
export default Cart;