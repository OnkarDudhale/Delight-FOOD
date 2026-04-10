import Food from "../models/Food.js";
import { v2 as cloudinary } from 'cloudinary';

//add food items

export const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No image uploaded" });
        }

        const foodData = JSON.parse(req.body.foodData);

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: "food-delivery-images"
        });


        await Food.create({
            ...foodData,
            image: uploadResult.secure_url,
            publicId: uploadResult.public_id
        });

        res.json({
            success: true,
            message: "Food Added Successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error while adding food"
        });
    }
};

// all food list
export const listFoods = async (req, res) => {
    try {
        const foodList = await Food.find({});
        if (foodList) {
            res.json({ success: true, foodList });
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//remove food item
export const removeFood = async (req, res) => {
    try {
        const { foodId } = req.params;

        const food = await Food.findById(foodId);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        if (food.publicId) {
            await cloudinary.uploader.destroy(food.publicId);
        }

        await Food.findByIdAndDelete(foodId);

        res.json({
            success: true,
            message: "Food removed successfully!"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error while removing food"
        });
    }
};

export const updatePrice = async (req, res) => {
    try {
        const { itemId, price } = req.body;
        if (!itemId || !price) {
            return res.json({ success: false, message: "Missing required fields" })
        }

        await Food.findByIdAndUpdate(itemId, { price })

        res.json({
            success: true,
            message: "Price updated"
        });
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        });
    }
}

export const searchFoodItems = async (req, res) => {
    try {
        const { q } = req.query;

        const startsWithItems = await Food.find({ name: { $regex: `^${q}`, $options: 'i' } });
        const includesItems = await Food.find({
            name: { $regex: q, $options: 'i' },
            _id: { $nin: startsWithItems.map(i => i._id) }
        });

        const foodItems = [...startsWithItems, ...includesItems];

        res.json({ success: true, foodItems })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};