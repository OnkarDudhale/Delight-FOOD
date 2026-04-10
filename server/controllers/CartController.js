import User from '../models/User.js'
import Food from '../models/Food.js'

//add items to user cart
export const addToCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const { id } = req.user;
        if (!id || !itemId) {
            return res.json({ success: false, message: "User id and itemId are required" });
        }

        const product = await Food.findById(itemId);

        if (!product) {
            return res.json({ success: false, message: "Food item not found" });
        }

        const user = await User.findByIdAndUpdate(id, {
            $inc: { [`cartData.${itemId}`]: 1 }
        }, { returnDocument: 'after' })

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }


        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}

//remove items from user cart
export const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        const { id } = req.user;

        if (!id || !itemId) {
            return res.json({ success: false, message: "User id and itemId required" });
        }

        const user = await User.findById(id);

        if (!user || !user.cartData[itemId]) {
            return res.json({ success: false, message: "Item not in cart" });
        }

        if (user.cartData[itemId] === 1) {
            await User.findByIdAndUpdate(id, {
                $unset: { [`cartData.${itemId}`]: "" }
            });
        } else {
            await User.findByIdAndUpdate(id, {
                $inc: { [`cartData.${itemId}`]: -1 }
            });
        }

        res.json({ success: true, message: "Item removed from cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//fetch user cart data
export const getCartItems = async (req, res) => {

    try {
        const { id } = req.user;
        if (!id) {
            return res.json({ success: false, message: "User id required" })
        }

        const user = await User.findById(id);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = user.cartData;

        if (!cartData) {
            return res.json({ success: false, message: "User cart is empty" })
        }

        const itemIds = Object.keys(cartData);

        const products = await Food.find({
            _id: { $in: itemIds }
        })

        const cartItems = products.map(product => ({
            ...product._doc,
            quantity: cartData[product._id]
        }))

        res.json({ success: true, cartItems, cartQuantity: cartData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}