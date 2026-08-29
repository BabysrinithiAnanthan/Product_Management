import mongoose from "mongoose";
import Product from "../Models/Product.js";

export const createProduct=async(req,res)=>{
    try{
        const {prodID,prodName,price,stock} = req.body;

        const product = await Product.create({prodID,prodName,price,stock});

        res.status(201).json({
            success:true,
            message:"Product created successfully",product
        });

    }catch(err){
        res.status(500).json({
            success:false,
            message:"All the Fields are Required"

        });
    }
};

export const getProducts = async(req,res) =>{
    try{
        const products= await Product.find();

        res.status(200).json({
            success:true,
            products:products,
            message:"Products fetched successfully",products
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
};

export const getProduct = async(req,res)=>{
    try{
       
        const product = await Product.findById(req.params.id);
        res.status(200).json({
            success:true,
            message:"Product Fetched successfully",product
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
};

export const updateProduct =async(req,res)=>{
    try{
        const {id} = req.params;
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid Product ID"
            });
        }
        const {prodID,prodName,price,stock}=req.body;

        const updateData={};

        if(prodID !== undefined){
            updateData.prodID = prodID;
        }
        if(prodName !== undefined){
            updateData.prodName = prodName;
        }if(price !== undefined){
            updateData.price = price;
        }if(stock !== undefined){
            updateData.stock=stock;
        }

       const product =await Product.findByIdAndUpdate(id,updateData,{returnDocument:'after',runValidators:true});
       
       if(!product){
        return res.status(404).json({
            success:false,
            message:"Product Not Updated",product
        });
       }
       res.status(200).json({
        success:true,
        message:"Product Updated Successsfully",product
       });
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        });
    }
};

export const deleteProduct =async(req,res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success:"Product Deleted Successfully",product
        });
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
    };
