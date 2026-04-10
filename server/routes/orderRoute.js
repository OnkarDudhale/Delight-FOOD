import express from 'express'
import { getAllOrders, getAllUserOrders, placeOrder, placeOrderCod, removeOrder, stripeWebhooks, updateStatus } from '../controllers/OrderController.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';

const orderRouter = express.Router();

orderRouter.post('/placeCOD', authenticate, placeOrderCod)
orderRouter.post('/place', authenticate, placeOrder);
orderRouter.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhooks
);
orderRouter.get('/get', authenticate, getAllUserOrders);

//admin
orderRouter.get('/getAll', authenticate, authorizeRoles("admin"), getAllOrders);
orderRouter.put('/statusUpdate', authenticate, authorizeRoles("admin"), updateStatus);
orderRouter.post('/remove', authenticate, authorizeRoles("admin"), removeOrder)
export default orderRouter;