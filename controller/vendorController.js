const User = require("../models/user");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel")
const jwt = require("jsonwebtoken");
const { send, generateOTP } = require("../helpers/utilitiy");
const { successResponseWithData, ErrorResponse } = require("../helpers/apiResponse");


exports.singup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, shopName, shopUrl, } = req.body;
        const user = await User.findOne({ email: email })
        if (user) return ErrorResponse(res, "email allready exits !")
        let fName = req.body.firstName,
            lName = req.body.lastName
        const fullName = `${fName} ${lName}`

        let temp = { firstName, lastName, email, password, fullName, phoneNumber, shopName, shopUrl, role: "vendor" }
        let vendorDetail = await User.create(temp);

        return successResponseWithData(res, "Success", vendorDetail);
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, " something is wrong !")
    }

}

exports.singin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return ErrorResponse(res, error)

        if (user) {
            if (user.authenticate(req.body.password) && user.role === "vendor") {
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECREAT, { expiresIn: '2d' });
                const { _id, firstName, lastName, phoneNumber, email, role, fullName } = user;
                let data = {
                    token,
                    user: {
                        _id, firstName, lastName, phoneNumber, email, role, fullName
                    }
                }
                return successResponseWithData(res, "Success", data);

            } else {
                return ErrorResponse(res, "Invalid password !")
            }
        }

    } catch (error) {
        return ErrorResponse(res, "invalid username !")
    }

}
exports.logout = async (req, res) => {
    return successResponseWithData(res, "Success", {});

};


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) return ErrorResponse(res, " email does not exit please enter valid email !")
        let otp = generateOTP(6);
        const token = jwt.sign({ otp }, process.env.JWT_SECREAT, { expiresIn: '2m' });
        let updatedUser = await User.findOneAndUpdate({ email }, { $set: { forgotPasswordOtp: token } }, { new: true });
        console.log(updatedUser);
        send(email, "FORGOT PASSWORD", otp)
        return successResponseWithData(res, "Success", {});
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, " something is wrong !")
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        let user = await User.findOne({ email });
        if (!user) return ErrorResponse(res, " user not found for this email !");
        if (!user.forgotPasswordOtp) return ErrorResponse(res, " reset password not valid !");
        const token = user.forgotPasswordOtp
        jwt.verify(token, process.env.JWT_SECREAT, async (err, payLoad) => {
            if (err) return ErrorResponse(res, " otp expired !");
            if (otp !== payLoad.otp) {
                return ErrorResponse(res, " wrong otp !")
            }
            user.password = newPassword
            user.forgotPasswordOtp = ""
            await user.save()
            return successResponseWithData(res, "success", "password updated successfully")
        });
    } catch (error) {
        return ErrorResponse(res, { message: "some went wrong!" });

    }
}

exports.createProduct = async (req, res) => {
    try {
        const {
            name, price, materials,
            colors,
            packageContents,
            itemSize,
            details,
            category,
            brand
        } = req.body;
        let image = [];

        if (req.files.length > 0) {
            image = req.files.map(file => {
                return { img: file.filename }
            })
        }
        const product = {
            name: name,
            slug: slugify(name),
            price,
            description: {
                materials,
                colors,
                packageContents,
                itemSize,
                details
            },
            image,
            category,
            brand
        }

        let productData = await productModel.create(product)
        return successResponseWithData(res, "success", productData)
    } catch (error) {
        return ErrorResponse(res, error)
    }

}


exports.getProduct = async (req, res) => {
    const user = req.user;
    let userDetail = await productModel.find()
    .populate("category")
    .populate("brand")
    .sort({ name: 1 });
    return successResponseWithData(res, "success", userDetail)
}
exports.productDetail = async (req, res) => {
    const productId = req.params.productId;
    let productDetail = await productModel.findOne({ _id: productId })
    .populate("category")
    .populate("brand");
    return successResponseWithData(res, "success", productDetail)
};

exports.getOrders = async (req, res) => {
    try {
        const user = req.user
        const orderList = await orderModel.find({ user: user._id })
            .select("_id paymentStatus paymentType orderStatus items")
            .populate("items.productId", "_id name productPictures");
        return successResponseWithData(res, "success", orderList)
    } catch (error) {
        return ErrorResponse(res, "some thing wet wrong!");
    }

}

exports.getOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await orderModel.findOne({ _id: orderId })
            .populate("items.productId", "_id name image")
            .lean();
        if (!order) return ErrorResponse(res, "order not found for this product")
        if (order) {
            const data = { order}
            return successResponseWithData(res, "success", data)
        }
    } catch (error) {
        return ErrorResponse(res, "some thing went wrong!");
    }

}


//findOneAndUpdate({ _id: user._id }, { $set: { password: newPassword, forgotPasswordOtp: "" } }, { new: true });