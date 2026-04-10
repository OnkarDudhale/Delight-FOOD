import React, { useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'
import { assets } from '../../assets/frontend_assets/assets.js'
import { adminAssets } from '../../assets/admin_assets/assets.js'
import { AppContext } from '../../context/AppContext.jsx'


const ListFoodItems = () => {

  const [list, setList] = useState([]);
  const [prices, setPrices] = useState({})

  const { token, axios, currency } = useContext(AppContext);

  if (!list) {
    return <h2>Loading...</h2>
  }
  const fetchList = async () => {
    try {
      const response = await axios.get('/api/food/list');

      if (response.data.success) {
        setList(response.data.foodList);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(`/api/food/remove/${foodId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Food item removed successfully..");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to remove food");
    }
  };

  useEffect(() => {
    fetchList()
  }, [])

  const handlePriceChange = (id, value) => {
    setPrices((prev) =>
    ({
      ...prev,
      [id]: value
    })
    )
  }

  const updatePrice = async (itemId) => {
    try {
      const res = await axios.post('/api/food/updatePrice', { itemId, price: prices[itemId] });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong")
    }
  }

  return (
    <div className='flex flex-col px-10 mt-5 max-md:px-3'>
      <p className='text-[tomato] md:hidden text-[18px] mt-10'>All Foods List</p>
      <div className="list-table mt-5">
        <div className="table-format grid grid-cols-[1fr_2fr_1fr_1fr_0.7fr] max-md:grid-cols-[3fr_2fr_2fr_1fr] items-center gap-2.5 py-3 px-3.5 border border-[#cacaca] bg-[#f9f9f9] text-[13px] title">
          <b className='max-md:hidden'>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b >Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='table-format relative grid grid-cols-[1fr_2fr_1fr_1fr_0.7fr] max-md:grid-cols-[3fr_2fr_2fr_1fr] items-center gap-2.5 py-3 px-3.5 border border-[#cacaca] text-[13px]'>
            <img className='w-20 max-md:hidden' src={item.image} alt="food-image" />
            <p className='max-md:text-[12px]'>{item.name}</p>
            <p className='max-md:ml-2'>{item.category}</p>
            <div className="price-update flex">
              {currency}<input type="number" onChange={(e) => handlePriceChange(item._id, e.target.value)} className='w-11 pl-0.5 border border-none outline-none' value={prices[item._id] || item.price} />
            </div>
            <div className="action flex max-md:gap-3 md:gap-5">
              <button onClick={() => updatePrice(item._id)} className=' cursor-pointer flex justify-center items-center rounded-full p-1 hover:scale-120 hover:border-2 hover:text-red-600 border border-[tomato] transition-transform duration-200'><img className='w-3 h-3' src={adminAssets.edit_icon} alt="edit" /></button>
              <p onClick={() => removeFood(item._id)} className='cursor-pointer flex items-center justify-center h-5 w-5 hover:text-red-600 hover:scale-125 
             transition-transform duration-200'><img src={adminAssets.remove_icon} alt="remove_icon" /></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListFoodItems