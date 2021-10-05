const mongoose=require("mongoose");
const posterSchema=new mongoose.Schema({
    image:[{
        img:{type:String}
    }],
    status:{
        type:String,
        enum:['ACTIVE','INACTIVE' ],
        default:'ACTIVE'
    },
    description:{
        type:String
    }

},{timestamps:true})
const posterModel=mongoose.model("Poster",posterSchema);
module.exports=posterModel;