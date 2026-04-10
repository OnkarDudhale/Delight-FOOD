import { Router } from 'express'
import { addToCart, getCartItems, removeFromCart } from '../controllers/CartController.js';
import { authenticate } from '../middlewares/auth.js'

const cartRouter = Router();

cartRouter.post('/add', authenticate, addToCart);
cartRouter.post('/remove', authenticate, removeFromCart);
cartRouter.get('/get', authenticate, getCartItems)

export default cartRouter