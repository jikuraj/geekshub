const mongoose=require("mongoose");
const productSchema= new mongoose.Schema({
    name:{
        type:String,
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
    },
    description:{
        materials:{
            type:String,
        },
        colors:{
             type:String
        },
        packageContents:{
            type:String,
        },
        itemSize:{
            type:String
        },
        details:{
            type:String
        }

    },
    offer:{type:Number},
    image:[{
        img:{type:String}
    }],
    reviews:[{
        userId:{
             type:mongoose.Schema.Types.ObjectId ,
             ref:'User'
    },
        review:String
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    
},{timestamps:true});

module.exports=mongoose.model('Product',productSchema);