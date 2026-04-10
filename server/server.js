import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import path from 'path';
import connectCloudinary from './config/cloudinary.js';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();

const app = express();
const port = 3000;

// middleware
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((req, res, next) => {
    if (req.originalUrl === "/api/order/webhook") {
        next(); // skip JSON parsing for webhook
    } else {
        express.json()(req, res, next);
    }
});

// connect to database and Cloudinary
connectDB();
connectCloudinary();

// API endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => {
    console.log("server is running on port 3000")
});

app.get('/', (req, res) => res.send('API is working'));