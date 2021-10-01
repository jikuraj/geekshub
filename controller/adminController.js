const User=require("../models/user")
const productModel=require("../models/productModel");
const shortid=require("shortid");
const slugify=require("slugify");
const jwt=require("jsonwebtoken");
const { successResponseWithData,ErrorResponse } = require("../helpers/apiResponse");



exports.singin=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(error) return ErrorResponse(res,error);
        if(user){
            if(user.authenticate(req.body.password) && user.role==='admin'){
                const token=jwt.sign({_id:user._id, role:user.role},process.env.JWT_SECREAT, {expiresIn: '2d'});
                const {_id,firstName,lastName,email,role,fullName}=user;
                let data={
                    token,
                    user:{
                       _id, firstName,lastName,email,role,fullName
                    }
                }
              return  successResponseWithData(res,"success",data);

            }else{
                return ErrorResponse(res,{
                    message:'Invalid password'
                })
            }
        }else{
            return ErrorResponse(res,{message:'somethink went wrong'})
        }
    })
}

exports.createProduct=async(req,res)=>{  
    try {
        const {
            name,price,materials,
            colors,
            packageContents,
            itemSize,
            details,category,
        }=req.body;
        let image=[];
    
        if(req.files.length>0){
            image= req.files.map(file=>{
                return {img:file.filename}
            })
        }
        const product={
            name:name,
            slug:slugify(name),
            price,
            description:{
                materials,
                colors,
                packageContents,
                itemSize,
                details,
            },
            image,
        }
    
       let productData= await productModel.create(product)
        return successResponseWithData(res,"success",productData)
    } catch (error) {
       return ErrorResponse(res,error)
    }
       
    }

    exports.logout = async(req,res)=>{
        return successResponseWithData(res,"success",{})
    };

    exports.getProduct = async (req, res) => {
        const user = req.user;
        let userDetail = await productModel.find().sort({ name: 1 });
        return successResponseWithData(res,"success", userDetail )
    }


    exports.productDetail = async (req, res) => {
        const productId = req.params.productId;
        let productDetail = await productModel.findOne({_id:productId});
        return successResponseWithData(res,"success",productDetail)
    } 