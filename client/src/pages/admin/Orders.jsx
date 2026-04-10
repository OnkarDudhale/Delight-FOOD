import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { adminAssets } from '../../assets/admin_assets/assets.js'

const Orders = () => {

  const { axios, token, currency } = useContext(AppContext);

  const [orders, setOrders] = useState([]);

  const fetchAllUsersOrders = async () => {
    try {
      const response = await axios.get('/api/order/getAll');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      fetchAllUsersOrders();
    }
  }, [token])

  const statusHandler = async (e, orderId) => {
    try {
      const status = e.target.value;
      const res = await axios.put('/api/order/statusUpdate', { status, orderId })
      if (res.data.success) {
        await fetchAllUsersOrders()
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  const removeOrder = async (order_id) => {
    try {
      const response = await axios.post('/api/order/remove', { order_id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAllUsersOrders()
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className='no-scrollbar flex-1 min-h-[95vh] overflow-y-auto bg-gray-50'>
      <div className="md:p-8 p-4 space-y-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800">Order History</h2>

        {orders.map((order, index) => (

          <div
            key={index}
            className=" p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="top cursor-pointer flex justify-between">
              <p className="text-sm text-gray-500 mt-2">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <button onClick={() => removeOrder(order._id)} className='cursor-pointer hover:text-red-600 hover:scale-125 transition-transform duration-200'>
                <img src={adminAssets.remove_icon} alt="" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 p-6">
              {/* Product Info */}
              <div className="flex gap-4 flex-1 min-w-62.5">
                <div className="shrink-0">
                  <img
                    className="w-14 h-14 object-contain p-1 border border-gray-200 rounded"
                    src={adminAssets.parcel_icon}
                    alt="Order"
                  />
                </div>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <p className="font-medium text-gray-900">
                        {item.name}
                        <span className='text-[tomato] ml-1'>× {item.quantity}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {currency}{item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex-1 min-w-50 space-y-1 text-sm">
                <p className="font-medium text-gray-900">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className="text-gray-600">
                  {order.address.street}, {order.address.city}
                </p>
                <p className="text-gray-600">
                  {order.address.state}, {order.address.zipcode}
                </p>
                <p className="text-gray-600">
                  {order.address.country}
                </p>
                <p className="text-gray-600">
                  {order.address.phone}
                </p>
              </div>

              {/* Order Details */}
              <div className="flex flex-col justify-between min-w-45">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    {currency}<span className='text-[tomato]'>{order.amount}</span>
                  </p>
                  <p className='text-sm' >
                    Payment: <span className={`${order.payment ? "text-green-600" : "text-orange-500"}`}>{order.status}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Method: {order.paymentType}
                  </p>
                </div>
                <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='bg-[#ffe8e4] border border-transparent outline-[tomato] w-[max(12vw,130px)] text-[tomato]' >
                  <option value="processing">Food Processing</option>
                  <option value="out for delivery">Out For Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12">

            <p className="mt-4 text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Orders