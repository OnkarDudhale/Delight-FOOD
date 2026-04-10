import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import { useState } from "react"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"

const PlaceOrder = () => {

  const { getTotalCartAmount, axios, foodList, cartItems, currency } = useContext(AppContext)

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "", email: "", street: "", city: "", state: "",
    zipcode: "", country: "", phone: ""
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => { return { ...data, [name]: value } })
  }

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!Object.values(cartItems).some(qty => qty > 0)) {
      toast.error("Cart is empty");
      return navigate('/');
    }


    let orderItems = [];

    foodList.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems
    };

    try {
      const response = await axios.post(
        "/api/order/place", orderData,);

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error("Error placing order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };


  return (
    <form onSubmit={placeOrder} className="max-md:flex-col flex items-start justify-between gap-12.5 mt-15">
      <div className="place-order-left w-full max-w-[max(30%,500px)]">
        <p className="title text-[30px] font-semibold mb-12.5">Delivery Information</p>
        <div className="multi-fields flex gap-2.5">
          <input onChange={onChangeHandler} value={data.firstName} name="firstName" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="text" placeholder="First name" required />
          <input onChange={onChangeHandler} value={data.lastName} name="lastName" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="text" placeholder="Last name" required />
        </div>
        <input onChange={onChangeHandler} value={data.email} name="email" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="email" placeholder="Email address" required />
        <input onChange={onChangeHandler} value={data.phone} name="phone" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="text" placeholder="Phone" required />
        <input onChange={onChangeHandler} value={data.street} name="street" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="text" placeholder="Street" required />
        <div className="multi-fields flex gap-2.5">
          <input onChange={onChangeHandler} value={data.city} name="city" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="text" placeholder="city" required />
          <input onChange={onChangeHandler} value={data.state} name="state" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="text" placeholder="State" required />
        </div>
        <div className="multi-fields flex gap-2.5">
          <input onChange={onChangeHandler} value={data.zipcode} name="zipcode" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="text" placeholder="Zip code" required />
          <input onChange={onChangeHandler} value={data.country} name="country" className="mb-4 w-full p-2.5 border border-[#c5c5c5] rounded-sm outline-[tomato]" type="text" placeholder="Country" required />
        </div>
      </div>
      <div className="place-order-right w-full max-w-[max(40%,400px)]">
        <div className="cart-total flex flex-1 flex-col gap-5">
          <h2 className='text-[30px] font-semibold max-md:text-2xl'>Cart Totals</h2>
          <div>
            <div className="cart-total-details flex justify-between text-[#555]">
              <p className='text-[15px]'>Subtotal</p>
              <p className='text-[15px]'>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr className='my-2.5' />
            <div className="cart-total-details flex justify-between text-[#555]">
              <p className='text-[15px]'>Delivery Fee</p>
              <p className='text-[15px]'>{currency}{getTotalCartAmount() ? 2 : 0}</p>
            </div>
            <hr className='my-2.5' />
            <div className="cart-total-details flex justify-between text-[#555]">
              <p >Total</p>
              <b>{currency}{getTotalCartAmount() ? getTotalCartAmount() + 2 : 0}</b>
            </div>
          </div>
          <button type="submit" className='border-none text-white bg-[tomato] max-md:w-[max(10vw,150px)] w-[max(15vw,200px)] max-md:text-[11px] text-[14px] py-3 rounded-sm cursor-pointer mt-5'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder