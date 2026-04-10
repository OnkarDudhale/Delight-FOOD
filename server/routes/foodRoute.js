import express from 'express'
import { addFood, listFoods, removeFood, searchFoodItems, updatePrice } from '../controllers/FoodController.js';
import { upload } from '../config/multer.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const foodRouter = express.Router();

foodRouter.post('/add', authenticate, authorizeRoles("admin"), upload.single("image"), addFood)
foodRouter.get('/list', listFoods);
foodRouter.delete('/remove/:foodId', authenticate, authorizeRoles("admin"), removeFood);
foodRouter.post('/updatePrice', authenticate, authorizeRoles("admin"), updatePrice);
foodRouter.get('/search', searchFoodItems)

export default foodRouter;