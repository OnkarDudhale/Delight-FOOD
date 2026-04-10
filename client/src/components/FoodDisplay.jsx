import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import FoodItem from './FoodItem'

const FoodDisplay = ({ category }) => {

    const { foodList } = useContext(AppContext)
    return (
        <div className='food-display mt-7.5' id='food-display'>
            <h2 className='text-[max(2vw,24px)] font-semibold'>Top dishes near you</h2>
            <div className="food-display-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7.5 mt-7.5">
                {foodList.filter(item => category === "All" || category === item.category)
                    .map(item => (
                        <FoodItem key={item._id} item={item} />
                    ))
                }
            </div>
        </div>
    )
}

export default FoodDisplay