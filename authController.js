import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const createAdmin = async(req,res)=>{
    try{

        const existingAdmin = await User.findOne({
            email:"adminsri@gmail.com"
        });

        if(existingAdmin){
            return res.status(400).json({
                message:"Admin already exists"
            });
        }

        const hasehedPassword = await bcrypt.hash("sri@0702",10);

        const admin = await User.create({
            userName:"ADMIN",
            email:"adminsri@gmail.com",
            password:hasehedPassword,
            role:"admin"
        });

        res.status(201).json({
            message:"Admin created successfully",
            admin:{
                id:admin._id,
                name:admin.userName,
                email:admin.email,
                role:admin.role
            }
        });
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

export const createRegister = async(req,res)=>{
    try{
        const {userName,email,password} = req.body;

        if(!userName || !email|| !password){
            return res.status(400).json({
                success:false,
                message:"All the fields are required"
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hasehedPassword = await bcrypt.hash(password,10);
        
        const user = await User.create({
            userName,email,password:hasehedPassword,role:"user"
        });

        res.status(201).json({message:"User registered successfully",
            user:{
                id:user._id,
                name:user.userName,
                email:user.email,
                role:user.role
            },
            
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

export const login =async(req,res)=>{
    try{
        const {email,password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                message:"login and password are required"
            });
        }

       const user = await User.findOne({email});
       
       if(!user){
        return res.status(401).json({
            message:"Invalid user credentials"
        });
       }

       const isPasswordCorrect = await bcrypt.compare(password,user.password);

       if(!isPasswordCorrect)
       {
          return res.status(401).json({
            message:"Invalid credentials"
          });
        }

        const token =jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"         
            }
        );

        res.status(200).json({
            message:"Login Succssful",
            token,
            user:{
                id:user._id,
                name:user.userName,
                email:user.email,
                role:user.role
            }
        });
    }
    catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
};