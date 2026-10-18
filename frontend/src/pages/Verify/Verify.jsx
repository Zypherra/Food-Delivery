import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const method = searchParams.get("method");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);

    console.log(success, method, orderId);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(`${url}/api/order/verify`, { success, method, orderId })
        if (response.data.success) {
            navigate("/myorders");
        }
        else {
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (success === "true") {
                navigate("/");
            } else {
                navigate("/order");
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [success, navigate]);

    const getMethodIcon = () => {
        switch (method) {
            case 'online':
                return '💳';
            case 'cod':
                return '💵';

            default:
                return '✓';
        }
    };

    const getMethodName = () => {
        switch (method) {
            case 'online':
                return 'Online Payment';
            case 'cod':
                return 'Cash on Delivery';

            default:
                return 'Payment';
        }
    };

    const getMessage = () => {
        if (success === "true") {
            switch (method) {
                case 'online':
                    return 'Your payment was successful! Your order has been placed.';
                case 'cod':
                    return 'Your order has been placed! Please keep cash ready for delivery.';

                default:
                    return 'Your order has been placed successfully!';
            }
        } else {
            return 'Payment failed. Please try again.';
        }
    };

    return (
        <div className='verify'>
            <div className='verify-content'>
                {success === "true" ? (
                    <>
                        <div className='success-icon'>
                            <span className='method-icon'>{getMethodIcon()}</span>
                        </div>
                        <h2>Order Confirmed!</h2>
                        <p className='method-name'>{getMethodName()}</p>
                        <p className='message'>{getMessage()}</p>
                    </>
                ) : (
                    <>
                        <div className='error-icon'>✗</div>
                        <h2>Order Failed</h2>
                        <p className='message'>{getMessage()}</p>
                    </>
                )}
                <p className='redirect-message'>Redirecting in 3 seconds...</p>
            </div>
        </div>
    )
}

export default Verify
