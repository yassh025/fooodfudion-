import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("cod");
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

    const [cities, setCities] = useState([]);
    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);
    const navigate = useNavigate();

    const gujaratCities = {
        "Gujarat": {
            "cities": {
                "Ahmedabad": "380001",
                "Surat": "395001",
                "Vadodara": "390001",
                "Rajkot": "360001",
                "Bhavnagar": "364001",
                "Gandhinagar": "382010",
                "Jamnagar": "361001",
                "Junagadh": "362001",
                "Anand": "388001",
                "Nadiad": "387001",
                "Vapi": "396195",
                "Navsari": "396445",
                "Bharuch": "392001",
                "Patan": "384265",
                "Mehsana": "384002",
                "Morbi": "363641",
                "Godhra": "389001",
                "Bhuj": "370001",
                "Surendranagar": "363001",
                "Porbandar": "360575",
                "Dwarka": "361335",
                "Palitana": "364270",
                "Chhota Udepur": "391165",
                "Dahod": "389151",
                "Kheda": "387411",
                "Amreli": "365601",
                "Kutch": "370001",
                "Valsad": "396001",
                "Daman": "396210",
                "Silvassa": "396230",
                "Dang": "396375",
                "Tapi": "394107",
            }
        },
        "Maharashtra": {
            "cities": {
                "Mumbai": "400001",
                "Pune": "411001",
                "Nagpur": "440001",
            }
        },
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));

        if (name === "state") {
            const cityList = gujaratCities[value]?.cities || {};
            setCities(Object.keys(cityList));
            setData(prev => ({
                ...prev,
                city: "",
                zipcode: ""
            }));
        }

        if (name === "city") {
            const zip = gujaratCities[data.state]?.cities[value] || "";
            setData(prev => ({
                ...prev,
                zipcode: zip
            }));
        }
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
        };

        try {
            if (payment === "stripe") {
                const response = await axios.post(url + "/api/order/create-payment", orderData, {
                    headers: { token }
                });
                if (response.data.success) {
                    window.location.href = response.data.session_url;
                } else {
                    toast.error("Payment Gateway Error");
                }
            } else {
                const response = await axios.post(url + "/api/order/placecod", orderData, {
                    headers: { token }
                });
                if (response.data.success) {
                    navigate("/myorders");
                    toast.success(response.data.message);
                    setCartItems({});
                } else {
                    toast.error("Order Failed");
                }
            }
        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("To place an order, sign in first");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <select name="state" onChange={onChangeHandler} value={data.state} required>
                        <option value="">Select State</option>
                        {Object.keys(gujaratCities).map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <select name="city" onChange={onChangeHandler} value={data.city} required>
                        <option value="">Select City</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit / UPI )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
        </form>
    );
};

export default PlaceOrder;