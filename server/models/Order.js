import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        items: [
            {
                foodId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Food",
                    required: true,
                },
                name: String,
                price: Number,
                quantity: Number,
            },
        ],

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "inr",
        },

        address: {
            firstName: String,
            lastName: String,
            email: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String,
            phone: String,
        },

        status: {
            type: String,
            enum: ["pending", "paid", "failed", "processing", "delivered","out for delivery"],
            default: "pending",
        },

        payment: {
            type: Boolean,
            default: false,
        },

        paymentType: {
            type: String,
            enum: ["COD", "Online"],
            default: "Online"
        },

        stripeSessionId: String,

    },
    { timestamps: true }
);

export default mongoose.models.Order ||
    mongoose.model("Order", orderSchema);