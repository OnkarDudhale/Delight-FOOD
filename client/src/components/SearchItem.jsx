import { useContext, useState } from "react"
import { assets } from "../assets/frontend_assets/assets.js"
import { AppContext } from "../context/AppContext.jsx"
import { useNavigate } from "react-router-dom"

export const SearchItem = () => {
    const [query, setQuery] = useState("");

    const { axios, setResults } = useContext(AppContext);

    const navigate = useNavigate();
    const searchFoodHandler = async () => {
        try {
            const response = await axios.get(`/api/food/search?q=${query}`)
            if (response.data.success) {
                setResults(response.data.foodItems)
                setQuery("");
                navigate('/foodItems');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="flex items-center gap-2 bg-[#fff2ef] px-3 py-1 rounded-full shadow-sm border border-transparent focus-within:border-[tomato] transition">

                <input type="text" value={query} onChange={(e) => { console.log("Typing:", e.target.value); setQuery(e.target.value) }} placeholder="Search food item..."
                    className="flex-1 bg-transparent outline-none text-[tomato] placeholder:text-gray-500 text-sm sm:text-base"
                />

                <button
                    onClick={searchFoodHandler}
                    className="p-2 rounded-full hover:bg-white active:scale-95 transition cursor-pointer"
                >
                    <img
                        src={assets.search_icon}
                        alt="search"
                        className="h-5 w-5 sm:h-6 sm:w-6 hover:text-[tomato]"
                    />
                </button>

            </div>
        </div>
    )
}