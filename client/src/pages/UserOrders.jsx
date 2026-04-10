import React, { useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
import { getDeliveryDate } from '../utils/deliveryDate'

const UserOrders = () => {
    const [orders, setOrders] = useState([])
    const { axios, token, currency } = useContext(AppContext)



    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/get')
            if (data.success) {
                setOrders(data.orders)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders()
        }
    }, [token])


    return (
        orders.length > 0 ? (
            <div className='mt-10'>
                {
                    orders?.map((order, index) => (
                        <div key={order._id} className='border border-[#ff9582] rounded-lg p-4 mb-8 py-5'>

                            <div className="flex justify-between text-black md:items-center md:font-medium max-md:flex-col">
                                <span>OrderId : {order._id}</span>
                                <span>Date : {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className='flex justify-between md:items-center text-[tomato] md:font-medium max-md:flex-col'>
                                <span>Payment : {order.paymentType}</span>
                                <span>Status : <span className={`${order.status === "delivered"||"out for delivery" ? "text-green-500" : "text-yellow-500"}`}>{order.status}</span></span>
                                <span>Total Amount : {currency}{order.amount}</span>
                            </p>
                            < hr className=' my-5' />

                            {order.items?.map((item, index) => (
                                <div key={item._id || index} className={`relative bg-white text-grey-500/70 ${order.items.length !== index + 1 && 'border-b'} border-gray-300 p-2 py-3 flex flex-col md:flex-row md:items-center justify-between items-center md:gap-16 w-full `}>

                                    <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0 text-gray-500'>
                                        <p><span className='text-[tomato]'>{item.name}</span></p>

                                        <p>Quantity : <span>{item.quantity || '1'}</span></p>
                                    </div>
                                    <p className=' text-lg font-medium'>
                                        <span className='text-[tomato]'>{currency}{item.price * item.quantity || item.price}</span>
                                    </p>
                                </div>
                            ))}
                            <div className="mt-2 ">
                                Expected delivery : {" "}
                                <span className='text-orange-400'>{getDeliveryDate(order.createdAt).toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                })}
                                </span>
                            </div>
                        </div>
                    ))
                }

            </div >
        )
            :
            <div>
                Nothing in user orders
            </div>

    )
}
export default UserOrders