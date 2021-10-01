const express=require("express");
const mongoose=require("mongoose");
const env=require("dotenv");
const customerRoutes=require("./routes/customerRoutes");
const adminRoutes=require("./routes/adminRoutes");
const vendorRoutes=require("./routes/vendorRoutes");
var cors = require("cors")

const app=express();

app.use(express.json());
env.config();
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, noauth, token, noauthother");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
});



mongoose.connect(process.env.MONGODB_URL,{useNewUrlparser:true})
.then(()=>{
    console.log("database connection successful");
}) //
.catch((err)=>{
    console.log(err);
});

app.use("/api/v2/customer",customerRoutes);
app.use("/api/v2/admin",adminRoutes);
app.use("/api/v2/vendor",vendorRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})