import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import FoodItem from "../components/FoodItem";
import { SearchItem } from '../components/SearchItem';

export const SearchResults = () => {

    const { results, foodList } = useContext(AppContext);

    console.log(results)

    return (
        <div className="food-display">
            <SearchItem />
            <div className="food-display-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7.5 mt-7.5">
                {results.length > 0 ? (
                    results.map((item) => (
                        <FoodItem key={item._id} item={item} />
                    ))
                ) : (
                    foodList.map((item) => (
                        <FoodItem key={item._id} item={item} />
                    ))
                )
                }
            </div>
        </div>
    )
}