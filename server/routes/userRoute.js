import { changeProfile, checkLogin, loginUser, logoutUser, registerUser } from "../controllers/UserController.js";
import express from 'express';
import { authenticate } from "../middlewares/auth.js";
import { refreshAccessToken } from "../controllers/RefreshAccessController.js";
import { upload } from "../config/multer.js";

const userRouter = express.Router();

userRouter.post('/signIn', loginUser);
userRouter.post('/signUp', registerUser);
userRouter.post('/logout', logoutUser);

userRouter.get('/check-login', authenticate, checkLogin);

userRouter.post('/refresh-token', refreshAccessToken);

userRouter.post('/update/profileImage', authenticate, upload.single("profile_image"), changeProfile)

export default userRouter;