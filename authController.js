import jwt from 'jsonwebtoken'

export const protect = (req,res,next) =>{
    try{
        const authHeader = req.headers.authorization;
        console.log("Auth:",req.headers.authorization);

        if(!authHeader){
            return res.status(401).json({
                message:"No Token Provided"
            });
        }
        if(!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message:"Inavalid token format"
            });
        }

        const token =authHeader.split(" ")[1];

        const decoded =jwt.verify(token,process.env.JWT_SECRET);

        console.log("DECODED:", decoded);
console.log("USER ID:", decoded._id);
console.log("USER ID:", decoded.id);
console.log("USER ID:", decoded.userId);


       
        req.user = decoded;

        next();
}catch(err){
    return res.status(401).json({
        message:"Invalid or expired token"
    });
}
};
