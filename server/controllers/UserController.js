import User from "../models/User.js";
import bcrypt from 'bcrypt'
import validator from 'validator'
import { createRefreshToken, createAccessToken } from "../utils/jwt.js";
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists.." });
        }

        if (!validator.isLength(username, { min: 4, max: 12 })) {
            return res.json({ success: false, message: "Name should contain at least 4 characters" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email" })
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minSymbols: 1,
            minNumbers: 1,
            minUppercase: 0,
            minLowercase: 0
        })) {
            return res.json({ success: false, message: "Password need to be atleast 8 characters long contains minimum 1 symbol and 1 number" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const role = process.env.ADMIN_EMAIL === email ? "admin" : "user";


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        })

        const refreshToken = createRefreshToken(newUser._id, newUser.role);
        const accessToken = createAccessToken(newUser._id, newUser.role);

        newUser.refreshToken = refreshToken;

        await newUser.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ success: true, message: "You have been registered successfully.", accessToken })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found. Please check your email or register first." })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        const refreshToken = createRefreshToken(user._id, user.role);
        const accessToken = createAccessToken(user._id, user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({ success: true, message: "Successfully logged in.", accessToken })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }
        if (token) {
            const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

            const user = await User.findById(decoded.id);
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0),
        })

        res.json({ success: true, message: "You Logged out successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const checkLogin = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Not authenticated',
                success: false
            });
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        const user = await User.findById(decoded.id)
            .select("username email role profile_image -_id");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.json({
            success: true,
            message: 'Authenticated',
            user
        });

    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({
            message: 'Invalid or expired token',
            success: false
        });
    }
};

export const changeProfile = async (req, res) => {
    try {
        const { id } = req.user;
        if (!req.file) {
            return res.json({ success: false, message: "No profile image uploaded" })
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.json({ success: false, message: "Invalid file type" });
        }

        const user = await User.findById(id);

        // Delete old image if exists
        if (user?.publicImage_id) {
            await cloudinary.uploader.destroy(user.publicImage_id);
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const profileUploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: "delight-profile_images"
        }
        );
        await User.findByIdAndUpdate(id, {
            profile_image: profileUploadResult.secure_url,
            publicImage_id: profileUploadResult.public_id
        })

        res.json({ success: true, message: "Profile image updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
} 
