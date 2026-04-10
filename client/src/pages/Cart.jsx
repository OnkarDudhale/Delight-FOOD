import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/frontend_assets/assets.js'
import toast from 'react-hot-toast'

const Cart = ({ setShowLogin }) => {

  const { user, cartItems, foodList, removeFromCart, getTotalCartAmount, currency } = useContext(AppContext);

  const navigate = useNavigate();

  const isLogin = async () => {

    if (!Object.values(cartItems).some(qty => qty > 0)) {
      toast.error("Cart is empty");
      return navigate('/');
    }

    if (user) {
      navigate('/placeOrder')
    } else {
      toast.error("Please log in first.");
      navigate('/')
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setShowLogin(true)
    }
  }

  return (
    <div className='mt-15 page-width'>
      <div className="cart-items">
        <div className="cart-items-title grid grid-cols-[1fr_2fr_1fr_1fr_1fr_0.5fr]  max-md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center text-gray-400 md:text-[max(1.2vw,13px)] max-md:text-[11px]">
          <p className='max-md:hidden'>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p >Remove</p>
        </div>
        <br />
        <hr />
        {foodList.filter(item =>
          cartItems[item._id]).map(item => (
            <div key={item._id}>
              <div className="cart-items-item my-2.5 text-black grid grid-cols-[1fr_2fr_1fr_1fr_1fr_0.5fr] max-md:max-md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center text-[max(1.1vw,13px)]">
                <img className='max-md:hidden w-12.5 max-md:w-9' src={item.image} alt="" />
                <p className='max-md:text-[12px] ml-0.5'>{item.name}</p>
                <p className='max-md:text-[13px]'>{currency}{item.price}</p>
                <p className='max-md:text-[13px]'>{cartItems[item._id]}</p>
                <p className='max-md:text-[13px]'>{currency}{item.price * cartItems[item._id]}</p>
                <p onClick={() => removeFromCart(item._id)} className="cursor-pointer flex items-center justify-center h-5 w-5 hover:text-red-600 hover:scale-125 
             transition-transform duration-200">
                  <img src={assets.remove_icon} alt="remove" className='inline-block w-6 h-6' />
                </p>
              </div>
              < hr className='h-0.5 bg-[#e2e2e2] border-none' />
            </div>
          )
          )}
      </div>
      <div className="cart-bottom max-md:flex-col-reverse mt-20 flex justify-between gap-[max(12vw,20px)]">
        <div className="cart-total flex flex-1 flex-col gap-5">
          <h2 className='text-3xl max-md:text-2xl'>Cart Totals</h2>
          <div>
            <div className="cart-total-details flex justify-between text-[#555]">
              <p className='max-md:text-[15px]'>Subtotal</p>
              <p className='max-md:text-[15px]'>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr className='my-2.5' />
            <div className="cart-total-details flex justify-between text-[#555]">
              <p className='max-md:text-[15px]'>Delivery Fee</p>
              <p className='max-md:text-[15px]'>{currency}{getTotalCartAmount() ? 2 : 0}</p>
            </div>
            <hr className='my-2.5' />
            <div className="cart-total-details flex justify-between text-[#555]">
              <p >Total</p>
              <b>{currency}{getTotalCartAmount() ? getTotalCartAmount() + 2 : 0}</b>
            </div>
          </div>
          <button onClick={() => isLogin()} className='border-none text-white bg-[tomato] max-md:w-[max(10vw,150px)] w-[max(15vw,200px)] max-md:text-[11px] text-[14px] py-3 rounded-sm cursor-pointer'>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode flex-1">
          <div >
            <p className='font-medium text-[#555]'>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input mt-2.5 flex justify-between items-center bg-[#eaeaea] rounded-sm">
              <input className='outline-none  bg-transparent pl-2.5 text-[14px]' type="text" placeholder='enter your promo code here' />
              <button className='w-[max(10vw,150px)] max-md:w-[max(4vw,70px)] max-md:py-2 max-md:px-4 max-md:text-[13px] py-2.5 px-5 bg-black border-none text-white rounded-r-sm cursor-pointer'>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Cart