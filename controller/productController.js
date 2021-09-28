const Product=require("../models/productModel");
const shortid=require("shortid");
const slugify=require("slugify");

exports.createProduct=(req,res)=>{
    //   res.status(200).json({file:req.files , body:req.body})

    const {
        name,price,description,category,quantity
    }=req.body;
    let image=[];

    if(req.files.length>0){
        image= req.files.map(file=>{
            return {img:file.filename}
        })
    }
    const product=new Product({
        name:name,
        slug:slugify(name),
        price,
        quantity,
        description,
        image,
    })

    product.save((error,product)=>{
        if(error) return res.status(400).json({error});
        if(product){
            res.status(201).json({product})
        }
    })
}