import mongoose from "mongoose";

const prodSchema = new mongoose.Schema({
    prodID:{
        type:String,
        unique:true,
        required:true
    },
    prodName:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    stock:{
        type:Number,
        required:true,
        min:0
}
},{
    timestamps:true
}
);

const Product = mongoose.model("Product",prodSchema);

export default Product;