import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { AppContext } from '../context/AppContext'

const FoodItem = ({ item }) => {

    const [expanded, setExpanded] = useState(false);
    const { cartItems, addToCart, removeFromCart, currency } = useContext(AppContext);

    return (
        <div className='food-item w-full m-auto transition duration-300 fadeIn [animation-duration:1s]  rounded-xl  shadow hover:shadow-[0_10px_25px_rgba(255,99,71,0.30)]'>
            <div className="food-item-img-container relative">
                <img className='w-full  rounded-t-2xl hover:opacity-75 transition duration-400' src={item.image} alt="" />
                {!cartItems[item._id]
                    ? <img className='add w-8.75 absolute right-3.5 bottom-3.5 rounded-[50%] cursor-pointer transform hover:scale-130 delay-75 duration-200 ' onClick={() => addToCart(item._id)} src={assets.add_icon_white} alt="" />
                    : <div className='food-item-counter absolute bottom-3.5 right-3.5 flex items-center gap-2.5 p-1.5 rounded-3xl bg-white'>
                        <img className='w-7.5 cursor-pointer' onClick={() => removeFromCart(item._id)} src={assets.remove_icon_red} alt="" />
                        <p>{cartItems[item._id]}</p>
                        <img className='w-7.5 cursor-pointer ' onClick={() => addToCart(item._id)} src={assets.add_icon_green} alt="" />
                    </div>
                }

            </div>
            <div className="food-item-info p-5 max-md:p-2">
                <div className="food-item-name-rating flex justify-between items-center mb-2.5">
                    <p className='text-[20px] font-medium'>{item.name}</p>
                    <img className='w-17.5' src={assets.rating_starts} alt="" />
                </div>
                <div>
                    <p className={`text-[#676767] text-[14px] ${expanded ? "" : "line-clamp-2"}`}>
                        {item.description}
                    </p>

                    {item.description.length > 80 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-[tomato] text-sm mt-1"
                        >
                            {expanded ? "Show Less" : "Show More"}
                        </button>
                    )}
                </div>
                <p className="food-item-price text-[tomato] text-[20px] font-medium my-2.5 max-md:my-1.5"> {currency}{item.price}</p>
            </div>
        </div>
    )
}

export default FoodItem