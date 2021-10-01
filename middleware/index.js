const jwt=require('jsonwebtoken');

exports.authAdmin=(req,res,next)=>{
    if(req.headers.token){
        const token=req.headers.token
        const user=jwt.verify(token,process.env.JWT_SECREAT);
        req.user=user;
        if(req.user.role!=="admin"){
           return res.status(400).json("invalid user !")
        }
        
    }else{
        return res.status(400).json({message:'Authorization required'});
    }
   
    next();
}

exports.authCustomer=(req,res,next)=>{
    if(req.headers.token){
        const token=req.headers.token
        const user=jwt.verify(token,process.env.JWT_SECREAT);
        req.user=user;
        if(req.user.role!=="user"){
            return res.status(400).json("invalid user !")
         }
        
    }else{
        return res.status(400).json({message:'Authorization required'});
    }
   
    next();
}

exports.authVendor=(req,res,next)=>{
    if(req.headers.token){
        const token=req.headers.token
        const user=jwt.verify(token,process.env.JWT_SECREAT);
        req.user=user;
        if(req.user.role!=="vendor"){
            return res.status(400).json("invalid user !")
         }
        
    }else{
        return res.status(400).json({message:'Authorization required'});
    }
   
    next();
}