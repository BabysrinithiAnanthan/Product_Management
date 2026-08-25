import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    customerName:{
        type:String,
        required:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    amount:{
        type:Number,
        required:true,
        min:0
    },
    status:{
        type:String,
        enum:["Pending","Confirmed","Cancelled","Delivered"],
        default:"Pending"
    }
},
    {
         timestamps:true
    }
);
const Order = mongoose.model("Order",orderSchema);

export default Order;