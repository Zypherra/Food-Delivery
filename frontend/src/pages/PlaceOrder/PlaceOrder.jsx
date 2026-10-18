import React, { useContext, useEffect, useState } from 'react'
import "./PlaceOrder.css";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("Online");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod: paymentMethod
    }

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

      if (response.data.success) {
        // If payment method is Online (mock), show a mock payment simulation
        if (paymentMethod === "Online") {
          // Simulate online payment - show confirmation dialog
          const confirmPayment = window.confirm(
            "Simulate Online Payment?\n\n" +
            "Click OK to simulate successful payment\n" +
            "Click Cancel to simulate failed payment"
          );

          if (confirmPayment) {
            // Success
            const verifyData = {
              orderId: response.data.orderId,
              success: "true"
            };
            await axios.post(url + "/api/order/verify", verifyData);
            navigate(`/verify?success=true&method=online&orderId=${response.data.orderId}`);
          } else {
            // Failed
            const verifyData = {
              orderId: response.data.orderId,
              success: "false"
            };
            await axios.post(url + "/api/order/verify", verifyData);
            navigate(`/verify?success=false&method=online&orderId=${response.data.orderId}`);
          }
        } else {
          // For COD - direct success
          navigate(`/verify?success=true&method=${paymentMethod.toLowerCase().replace(' ', '-')}&orderId=${response.data.orderId}`);
        }
      } else {
        alert("Error placing order: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error placing order");
    }
  }

  useEffect(()=>{
    if(!token){
      navigate('/cart')
    } else if(getTotalCartAmount()===0){
      navigate('/cart') 
    }
  },[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name" />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className={paymentMethod === "Online" ? "payment-option active" : "payment-option"}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💳</span>
                <span className="payment-label">Online Payment (Mock)</span>
              </label>

              <label className={paymentMethod === "COD" ? "payment-option active" : "payment-option"}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💵</span>
                <span className="payment-label">Cash on Delivery</span>
              </label>


            </div>
          </div>

          <button type='submit'>PLACE ORDER</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
