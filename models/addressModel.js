const mongoose=require("mongoose");

const addressSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref:"Users"
    },
    firstName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        default:""
    },
    pincode:{
        type:Number
    },
    phone:{
        type:Number,
    },
    address:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:''
    },
    state:{
        type:String,
        default:''
    },
    landmark:{
        type:String,
        default:''
    },
    status:{
        type:String,
        enum:["ACTIVE", "INACTIVE"],
        default:"ACTIVE"
    },
    addressType:{
        type:String,
        enum:["PRIMARY", "SECONDARY"],
        default:"PRIMARY"
    }
},{timestamps:true});

  

addressSchema.virtual('fullName')
.get(function(){
    return `${this.firstName} ${this.lastName}`;
})

module.exports =mongoose.model("Address",addressSchema); 
