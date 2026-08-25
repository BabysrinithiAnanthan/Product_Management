import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import prodRoutes from './Routes/productRoutes.js'
import orderRoutes from './Routes/orderRoutes.js'
import aRoutes from './Routes/authRoutes.js'


dotenv.config();

const app= express();

app.use(cors());

app.use(express.json());
app.use('/api/products',prodRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/auth',aRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Conncted Successfully");
}).catch((error) => {
    console.log("Connection failed");
})

const PORT=5000
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})




