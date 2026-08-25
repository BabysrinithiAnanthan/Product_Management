import express from 'express'
import { creatProduct,getProducts,getProduct, updateProduct, deleteProduct } from '../Controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router =express.Router();

router.get("/",protect,getProducts);

router.get("/:id",protect,getProduct);

router.post("/",protect,adminOnly,creatProduct);

router.put("/:id",protect,adminOnly,updateProduct);

router.delete("/:id",protect,adminOnly,deleteProduct);

export default router;
