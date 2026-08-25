import express from 'express'

import {createRegister, login,createAdmin} from '../Controllers/authController.js'

const router =express.Router();

router.post("/register",createRegister);

router.post("/login",login);

router.post("/create-admin",createAdmin);

export default router;