import Order from '../Models/Order.js';
import Product from '../Models/Product.js';

export const createOrder =async(req,res)=>{
    try{
        const {customerName,product,quantity}=req.body;

        if(!customerName){
            return res.status(400).json({
                message:"Customer name is required"
            });
        }
          
        const selectedProduct= await Product.findOne({prodName:product});

        if(!selectedProduct){
            return res.status(404).json({
                message:"product not found"
            });
        }
        
        if(!quantity || quantity<=0){
            return res.status(400).json({
                message:"quantity must be greater than 0"
            });
        }

        if(quantity>=selectedProduct.stock){
            return res.status(400).json({
                message:`Insufficient stock.<br> Available stock ${selectedProduct.stock}`
            });
        }

        const amount=quantity * selectedProduct.price;

        const order = await Order.create({
            customerName,product:selectedProduct.id,
            quantity,amount
        });

        selectedProduct.stock -= quantity;

        await selectedProduct.save();

        res.status(201).json({
            success:true,
            message:"Order created successfully",order,
            remainingStock:selectedProduct.stock
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

export const getOrders =async(req,res)=>{
try{
       const order = await Order.find();
           res.status(200).json({
           success:true,
           message:"Orders fetched successfully",order
       })
}
catch(error){
     res.status(500).json({
        success:false,
        message:err.message
    });
}
};
