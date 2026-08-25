import express from 'express'
import { createOrder, getOrders } from '../Controllers/orderController.js';

const router = express.Router();

router.use("/",createOrder);
router.use("/",getOrders);

export default router;