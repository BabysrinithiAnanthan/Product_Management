import Order from '../Models/Order.js';
import Product from '../Models/Product.js';

export const createOrder = async (req, res) => {
    try {
        const { prodID, quantity } = req.body;

        if (!prodID || !quantity) {
            return res.status(400).json({
                message: "productID and quantity is required"
            });
        }

        const product = await Product.findOne({ prodID:prodID });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Insufficient stock Available stock ${product.stock}`
            });
        }

        const amount = quantity * product.price;
        product.stock =Number(product.stock)-Number(quantity);
        
        await product.save();
        console.log(product.stock);

        console.log("req.user:", req.user);
        console.log("user id:", req.user?._id);

        const order = await Order.create({
            user: req.user.id,
            prodID: product.prodID,
            prodName: product.prodName,
            quantity: quantity,
            price: product.price,
            amount: amount,
            status: "confirmed"

        });

        //order = await order.populate('product'); 
        // product.stock -= quantity;

        // await product.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            remainingStock: product.stock, order
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const {status} =req.query;

        const filter={};

        if(status){
            filter.status=status;
        }

        const orders = await Order.find(filter).populate("user", "userName email").populate("prodID", "prodName price");
        res.status(200).json({
            TotalOrders: orders.length,
            success: true,
            message: "All Orders Fetched Successfully", orders
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Get All order occur error", error
        });
    }
};

export const getMyOrders= async (req, res) => {
    try {
        const  {status} =req.query;
        let orders;
       if(status)
        {  
            orders = await Order.find({ user: req.user.id, status:status });
        }
       else{
            orders=await Order.find({user:req.user.id});
        }
        

        res.status(200).json({
            success: true,
            Count:orders.length,
            message: "Order fetched successfully", orders
        });
    }

     
    
    catch (error) {
        console.log("Get My Order Error");
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const cancelOrder = async(req,res) =>{

    try{
        console.log(req.params.id);
        const order = await Order.findById(req.params.id);
        console.log(order);

        if(!order){
           return res.status(404).json({
            message:"Order Not Found"
           });
        }

        // if(order.status !== "confirmed"){
        //     return res.status(400).json({
        //         status:false,
        //         message:"Status must be confirmed"
        //     })
        // }
        if(order.status === "cancelled"){
            return res.status(400).json({
                status:false,
                message:"Order is already cancelled"
            });
        }

        const product = await Product.findOne({prodID:order.prodID});

        console.log("Product found",product);


        if(!product){
            return res.status(404).json({
                message:"Product not found"
            });
        }

        product.stock += order.quantity;
        await product.save();

         order.status="cancelled";
         await order.save();
        
         res.status(200).json({
            success:true,
            message:"Order cancelled and Stock restored",order,
            currentStock:product.stock,
            status:order.status
        });
    
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        })
    }

};

export const updateOrder = async(req,res)=>{
    try{
        const {status}=req.body;
        const order =await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({
                message:"Updating order not found"
            });
        }
        const allowedStatus = ["pending","confirmed","cancelled","delivered"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Status not valid"
            });
        }

        order.status = status;

        await order.save();
        return res.status(200).json({
            message:"Order Status Updated",order
        });
}
catch(error){
    res.status.json({
        message:"Order updation error",
        error:error
    });
}};

