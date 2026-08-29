import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    prodID:{
     type:String,
     required:true
    },
    prodName:{  
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        
    },
    amount:{
        type:Number,
        required:true,
        
    },
    status:{
        type:String,
        enum:["pending","confirmed","cancelled","delivered"],
        default:"Pending"
    }
},
    {
         timestamps:true
    }
);
const Order = mongoose.model("Order",orderSchema);

export default Order;
