const mongoose=require("mongoose");


const contactSchema=new mongoose.Schema({
    address:{
        type:String
    },
    phonenumber:{
        type:Number,
    
    },
    emailaddress:{
        type:String
    },
    yourname:{
        type:String
    },
    message:{
        type:String
    }
    


    
})
module.exports=mongoose.model("contact",contactSchema)