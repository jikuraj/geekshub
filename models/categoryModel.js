const mongoose=require("mongoose");
const categirySchema= new mongoose.Schema({
    name:{
        type:String,
    },
    image:[{
        img:{type:String}
    }],
    status:{
        type:String,
        enum:['ACTIVE','INACTIVE' ],
        default:'ACTIVE'
    }
    
},{timestamps:true});

module.exports=mongoose.model('categories',categirySchema, 'categories');