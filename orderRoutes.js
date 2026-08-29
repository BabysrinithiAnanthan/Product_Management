import express from 'express'
import { createOrder, getAllOrders, getMyOrders,cancelOrder, updateOrder} from '../Controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import {adminOnly} from '../middleware/adminMiddleware.js';



const router = express.Router();

router.post("/",protect,createOrder);
router.get("/all",protect,adminOnly,getAllOrders);
router.put("/:id/cancel",protect,cancelOrder);
router.get("/myOrders",protect,getMyOrders);
router.put("/:id/status",protect,adminOnly,updateOrder);

export default router;
