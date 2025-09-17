import React, { useContext } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../../context/StoreContext'
 
const PlaceOrder = () => {
  const deliveryFee = 30; // Assuming a fixed delivery fee
  const{getTotalCartAmount}=useContext(StoreContext)
  return (
   <form className='place-order main-content'>
  <div className='place-order-left'>
  <p className="title">Delivery Information </p>
  <div className='multi-fields'>
    <input type="text" placeholder='First Name'/>
    <input type="text" placeholder='Last Name'/>
 
  </div>
  <input type="email" placeholder='Email address'/>
  <input type="text" placeholder='Street'/>
  <div className="multi-fields">
    <input type="text" placeholder='City'/>
    <input type="text" placeholder='State'/>
  </div>
   <div className="multi-fields">
    <input type="text" placeholder='Zip Code'/>
    <input type="text" placeholder='Country'/>
  </div>
  <input type="text" placeholder='Phone'/>
  </div>
  <div className="place-order-right">
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
<button>PROCEED TO PAYMENT</button>
</div>
  </div>
   </form>
  )
}
 
export default PlaceOrder