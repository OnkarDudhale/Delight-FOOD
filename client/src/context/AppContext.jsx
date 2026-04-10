import { createContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const [cartItems, setCartItems] = useState({});

    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const [user, setUser] = useState(null);
    const isAdmin = user?.role === "admin";

    const [foodList, setFoodList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(true);

    const [results, setResults] = useState([])

    const navigate = useNavigate();

    const fetchUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get("/api/user/check-login");
            setUser(res.data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        try {
            const response = await axios.post("/api/user/logout");

            if (response.data.success) {
                setUser(null);
                setToken("");
                localStorage.removeItem("token");

                toast.success(response.data.message);
                setCartItems({})
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchFoodData = async () => {
        try {
            const response = await axios.get("/api/food/list");
            if (response.data.foodList.length > 0) {
                setFoodList(response.data.foodList);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchCartItems = async () => {
        try {
            const response = await axios.get("/api/cart/get");
            if (response.data.success) {
                setCartItems(response.data.cartQuantity);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setCartLoading(false)
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser();
            fetchCartItems();
        }
    }, [token]);

    useEffect(() => {
        fetchFoodData();
    }, []);

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

        try {
            if (token) {
                await axios.post("/api/cart/add", { itemId });
                toast.success("Food item added in cart")
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            if (prev[itemId] > 0) {
                return { ...prev, [itemId]: prev[itemId] - 1 };
            }
            return prev;
        });

        try {
            await axios.post('/api/cart/remove', { itemId })
            toast.success("Food item removed from cart");
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = foodList.find((p) => p._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }

        return totalAmount;
    };

    const contextValue = {
        axios,
        loading,
        results, setResults,
        cartLoading,
        isAdmin,
        logout,
        user,
        token,
        setToken,
        foodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        currency,
        setUser,
        fetchUser
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;



