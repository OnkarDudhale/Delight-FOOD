import { useState } from 'react'
import { adminAssets } from '../../assets/admin_assets/assets.js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext.jsx'

const AddFoodItem = () => {


  const navigate = useNavigate()

  const [image, setImage] = useState(null);
  const { axios, currency } = useContext(AppContext)

  const [foodData, setFoodData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  })


  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFoodData(foodData => ({ ...foodData, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    try {

      event.preventDefault()
      const formData = new FormData();
      formData.append("foodData", JSON.stringify(foodData))
      formData.append("image", image)

      const response = await axios.post('/api/food/add', formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setFoodData({
          name: "",
          description: "",
          price: "",
          category: "Salad"
        })
        setImage(false)
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message;
      toast.error(message);
      navigate('/')
    }
  }

  return (
    <div className='add w-[70%]  ml-[max(5vw,25px)] mt-10 text-[#6d6d6d] text-[16px] '>
      <h2 className='text-[tomato] md:hidden text-[18px] mb-5 mt-10'>Add Food Items</h2>
      <form className='flex flex-col gap-5 ' onSubmit={onSubmitHandler}>
        <div className="img-upload flex flex-col gap-5  w-35 max-md:w-25">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img className={`w-full ${image} ? "border-2 border-[tomato]" : ""`} src={image ? URL.createObjectURL(image) : adminAssets.upload_area} alt="upload-area" required />
          </label>
          <input className='hidden' onChange={(e) => setImage(e.target.files[0])} type="file" id='image' required />
        </div>
        <div className="flex flex-col gap-5 add-product-name w-[max(50%,320px)] max-md:w-[max(30%,250px)] ">
          <p>Food name</p>
          <input onChange={onChangeHandler} value={foodData.name} type="text" name='name' placeholder='Type here' className='p-2 border border-[#a9a9a9] rounded-sm outline-[tomato]' required />
        </div>
        <div className="flex flex-col gap-5 add-product-description w-[max(50%,320px)] max-md:w-[max(30%,250px)]">
          <p>Food description</p>
          <textarea onChange={onChangeHandler} value={foodData.description} name="description" placeholder='describe food item here' cols={3} rows={4} className='p-3 border border-[#a9a9a9] rounded-sm outline-[tomato]' required></textarea>
        </div>
        <div className="flex gap-10 add-category-price">
          <div className="flex flex-col gap-5 add-category">
            <p>Food category</p>
            <select onChange={onChangeHandler} name="category" value={foodData.category} className='p-1 max-w-30 border border-[#a9a9a9] rounded-sm outline-[tomato]'>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="flex flex-col gap-5 add-price">
            <p>Food price</p>
            <input onChange={onChangeHandler} value={foodData.price} className='p-1 max-w-30 border border-[#a9a9a9] rounded-sm outline-[tomato]' type="Number" name='price' placeholder={`${currency}200`} required />
          </div>
        </div>
        <button className='p-1.5 mt-5 max-w-30 border-none bg-[tomato] rounded-sm text-white cursor-pointer' type='submit'>ADD</button>
      </form>
    </div>
  )
}

export default AddFoodItem