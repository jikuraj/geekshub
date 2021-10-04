const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { send, generateOTP } = require("../helpers/utilitiy");
const { successResponseWithData, ErrorResponse } = require("../helpers/apiResponse");


exports.singup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, shopName, shopUrl, } = req.body;
       const user=await User.findOne({ email: email })
            if (user) return ErrorResponse(res, "email allready exits !")
           
        let temp = { firstName, lastName, email, password, phoneNumber, shopName, shopUrl,role:"vendor"}
        let vendorDetail = await User.create(temp);
        
        return successResponseWithData(res, "Success", vendorDetail);
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, " something is wrong !")
    }

}

exports.singin = async(req, res) => {
    try {
       const user=await User.findOne({ email:req.body.email });
            if (!user)  return ErrorResponse(res ,error)

            if (user) {
                if (user.authenticate(req.body.password)&&user.role==="vendor") {
                    const token =await jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECREAT, { expiresIn: '2d' });
                    const { _id, firstName, lastName,phoneNumber, email, role, fullName } = user;
                    let data =await {  token,
                        user: {
                            _id, firstName, lastName,phoneNumber, email, role, fullName
                        }}
                   return successResponseWithData(res, "Success", data );

                } else {
                   return ErrorResponse(res ,"Invalid password !")
                }
            }

    } catch (error) {
        return ErrorResponse(res ,"invalid username !")

    }
    
}
exports.logout=async(req,res)=>{
    return successResponseWithData(res, "Success", {});

};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        let otp = generateOTP(6);
        console.log(otp);
        let updatedUser = await User.findOneAndUpdate({ email }, { $set: { forgotPasswordOtp: otp } }, { new: true });
        console.log(updatedUser);
        send(email, "FORGOT PASSWORD", otp)
        return successResponseWithData(res, "Success", {} );
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res ," something is wrong !")
    }
}
