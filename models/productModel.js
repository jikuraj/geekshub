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
    discount:{
        type:Number,
        default:0,
        status:{
            enum:["ACTIVE","INACTIVE"],
            default:"ACTIVE",
        }
    },
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
    status:{
        type:String,
        enum:['ACTIVE','INACTIVE' ],
        default:'ACTIVE'
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories",
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"brands",
    },
    
},{timestamps:true});

module.exports=mongoose.model('Product',productSchema);