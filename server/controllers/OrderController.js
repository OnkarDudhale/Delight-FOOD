import Stripe from "stripe";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import User from "../models/User.js";

export const placeOrderCod = async (req, res) => {
    try {
        const { id } = req.user;
        const { items, address } = req.body;

        if (!id || !items || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items must be a non-empty array" });
        }

        const foodIds = items.map(item => item.foodId);
        const foods = await Food.find({ _id: { $in: foodIds } }).lean();

        const foodMap = {};
        foods.forEach(food => {
            foodMap[food._id] = food;
        });

        let totalAmount = 0;

        for (const item of items) {
            if (item.quantity <= 0) {
                return res.status(400).json({ message: "Invalid quantity" });
            }

            const food = foodMap[item.foodId];

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: `Food not found: ${item.foodId}`,
                });
            }

            totalAmount += food.price * item.quantity;
        }

        const order = await Order.create({
            userId: id,
            items,
            address,
            amount: totalAmount,
            paymentType: "COD",
            status: "pending",
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("COD ORDER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


export const placeOrder = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const { id } = req.user;
        const { items, address } = req.body;

        if (!id || !items || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items must be a non-empty array" });
        }

        const frontend_url = process.env.FRONTEND_URL;

        const foodIds = items.map(item => item.foodId);
        const foods = await Food.find({ _id: { $in: foodIds } }).lean();

        const foodMap = {};
        foods.forEach(food => {
            foodMap[food._id] = food;
        });

        let line_items = [];
        let totalAmount = 0;

        for (const item of items) {
            if (item.quantity <= 0) {
                return res.status(400).json({ message: "Invalid quantity" });
            }

            const food = foodMap[item.foodId];

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: `Food not found: ${item.foodId}`,
                });
            }

            const itemTotal = food.price * item.quantity;
            totalAmount += itemTotal;

            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: food.name,
                    },
                    unit_amount: food.price * 100,
                },
                quantity: item.quantity,
            });
        }

        const deliveryFee = totalAmount > 0 ? 2 : 0;
        totalAmount += deliveryFee;

        if (deliveryFee > 0) {
            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Delivery Charges",
                    },
                    unit_amount: deliveryFee * 100,
                },
                quantity: 1,
            });
        }

        const newOrder = await Order.create({
            userId: id,
            items,
            amount: totalAmount,
            address,
            status: "pending",
            paymentType: "Online",
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/cart`,
            metadata: {
                orderId: newOrder._id.toString(),
                userId: id,
            },
        });

        newOrder.stripeSessionId = session.id;
        await newOrder.save();

        return res.json({
            success: true,
            session_url: session.url,
        });

    } catch (error) {
        console.error("STRIPE ORDER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


export const stripeWebhooks = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET_KEY
        );
    } catch (error) {
        console.log("Webhook Error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {

            case "checkout.session.completed": {
                const session = event.data.object;

                if (!session.metadata?.orderId || !session.metadata?.userId) {
                    return res.status(400).json({ message: "Missing metadata" });
                }

                const { orderId, userId } = session.metadata;

                await Order.findByIdAndUpdate(orderId, {
                    status: "paid",
                    payment: true,
                    paymentIntentId: session.payment_intent,
                });

                await User.findByIdAndUpdate(userId, {
                    cartData: {},
                });

                console.log("Order Paid:", orderId);
                break;
            }

            case "payment_intent.processing": {
                const paymentIntent = event.data.object;

                await Order.findOneAndUpdate(
                    { paymentIntentId: paymentIntent.id },
                    { status: "pending" }
                );

                break;
            }

            case "payment_intent.payment_failed": {
                const orderId = paymentIntent.metadata?.orderId;

                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, {
                        status: "failed",
                    });
                }

                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object;

                if (!session.metadata?.orderId) break;

                await Order.findByIdAndUpdate(session.metadata.orderId, {
                    status: "failed",
                });

                console.log("Order Failed:", session.metadata.orderId);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }


        res.json({ received: true });

    } catch (error) {
        console.error("WEBHOOK HANDLER ERROR:", error);
        res.status(500).json({ error: "Webhook processing failed" });
    }
};


export const getAllUserOrders = async (req, res) => {
    try {
        const { id } = req.user;

        const orders = await Order.find({ userId: id });

        if (orders.length === 0) {
            return res.json({
                success: false,
                message: "User has no orders",
            });
        }

        res.json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error("GET USERS ORDERS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({});

        res.json({
            success: true,
            orders,
        });

    } catch (error) {
        console.log("GET ALL ORDERS ERROR", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.json({ success: false, message: "Missing required fields" })
        }
        await Order.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "User Status updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const removeOrder = async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.json({ success: false, message: "Order id is required" });
        }

        const order = await Order.findById(order_id);

        if (order.status !== "delivered" && order.status !== "failed") {
            return res.json({ success: false, message: "Order must be delivered or failed" })
        }

        await Order.findByIdAndDelete(order_id);
        res.json({ success: true, message: "Order removed Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}