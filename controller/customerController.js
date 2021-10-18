const User = require("../models/user")
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const addressModel = require("../models/addressModel");
const { send, generateOTP } = require("../helpers/utilitiy");
const productModel = require("../models/productModel");
const posterModel = require("../models/posterModel")
const cartModel = require("../models/cartModel");
const { successResponseWithData, ErrorResponse } = require("../helpers/apiResponse");
const orderModel = require("../models/orderModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");

exports.singup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, username, phoneNumber } = req.body;
        const user = await User.findOne({ email: email })
        if (user) return ErrorResponse(res, "email allready exits !")

        let fName = req.body.firstName,
            lName = req.body.lastName
        const fullName = `${fName} ${lName}`

        const userName = await User.findOne({ username: username })
        if (userName) return ErrorResponse(res, "username allready exits !")


        const _user = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            fullName,
            username: username
        });;
        const data = await _user.save()
        return successResponseWithData(res, "Success", data);

    } catch (error) {
        return ErrorResponse(res, "Something is wrong!")
    }

}

exports.singin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return ErrorResponse(res, error)

        if (user) {
            if (user.authenticate(req.body.password)) {
                const token = await jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECREAT, { expiresIn: '2d' });
                const { _id, firstName, lastName, phoneNumber, username, role, fullName, email } = user;
                let data = await {
                    token,
                    user: {
                        _id, firstName, lastName, phoneNumber, username, role, fullName, email
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

exports.getProfile = async (req, res) => {
    const user = req.user;
    let userDetail = await User.findOne({ _id: user._id }, { password: 0, hash_password: 0, forgotPasswordOtp: 0 });
    return successResponseWithData(res, "Success", userDetail);
}

exports.updateProfile = async (req, res) => {
    try {
        let user = req.user;
        let { firstName, lastName } = req.body;
        let filename = req.file && req.file.filename ? req.file.filename : "";
        let dataToSet = {};
        firstName ? dataToSet.firstName = firstName : true;
        lastName ? dataToSet.lastName = lastName : true;
        filename ? dataToSet.profilePicture = filename : true;
        let updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: dataToSet }, { new: true })
        return successResponseWithData(res, "Success", updatedUser);
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, " something is wrong !")
    }
}

exports.addAddress = async (req, res) => {
    try {
        const user = req.user;
        const { firstName, lastName, pincode, phone, address, city, state, landmark, addressType } = req.body;
        let temp = { firstName, lastName, pincode, phone, address, city, state, landmark, addressType, userId: user._id }
        let addressDetail = await addressModel.create(temp);
        return successResponseWithData(res, "Success", addressDetail);
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, " something is wrong !")
    }
}

exports.getAddress = async (req, res) => {
    try {
        const user = req.user;
        let address = await addressModel.find({ userId: user._id, status: "ACTIVE" });
        return successResponseWithData(res, "success", address)
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.editAddress = async (req, res) => {
    try {
        const user = req.user;
        const addressId = req.params.addressId;

        const { firstName, lastName, pincode, phone, address, city, state, landmark, addressType } = req.body;
        let dataToSet = {}
        firstName ? dataToSet.firstName = firstName : true;
        lastName ? dataToSet.lastName = lastName : true;
        pincode ? dataToSet.pincode = pincode : true;
        phone ? dataToSet.phone = phone : true;
        address ? dataToSet.address = address : true;
        city ? dataToSet.city = city : true;
        state ? dataToSet.state = state : true;
        landmark ? dataToSet.landmark = landmark : true;
        addressType ? dataToSet.addressType = addressType : true;

        let updatedAddress = await addressModel.findByIdAndUpdate({ _id: addressId }, { $set: dataToSet }, { new: true });
        return successResponseWithData(res, "success", updatedAddress)
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.logout = async (req, res) => {
    return successResponseWithData(res, "Success", {});
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) return ErrorResponse(res, " email does not exit please enter valid email !")
        let otp = generateOTP(6);
        const token = jwt.sign({ otp }, process.env.JWT_SECREAT, { expiresIn: '2m' });
        console.log(token);
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


exports.getProduct = async (req, res) => {
    const user = req.user;
    const { searchKey, sortPrice, fromPrice, toPrice, color } = req.query;

    let searchString = searchKey;
    searchString = new RegExp("^" + searchString, "i");
    let criteria = [{ status: "ACTIVE" }]
    searchKey ? criteria.push({ name: searchString }) : true;
    color ? criteria.push({ "description.colors": color }) : true;
    fromPrice ? criteria.push({ price: { $gte: fromPrice } }) : true;
    toPrice ? criteria.push({ price: { $lte: toPrice } }) : true;

    let sort = sortPrice ? { price: Number(sortPrice) } : { name: 1 }
    let products = await productModel.find({ $and: criteria })
    .populate("category")
    .populate("brand")
    .sort(sort);
    return successResponseWithData(res, "success", products);
}
exports.productDetail = async (req, res) => {
    const productId = req.params.productId;
    let productDetail = await productModel.findOne({ _id: productId })
    .populate("category")
    .populate("brand");
    return successResponseWithData(res, "success", productDetail)
}

exports.addToCart = async (req, res) => {
    try {
        const { itemId, qty } = req.body;
        const user = req.user;
        let temp = {
            item: itemId,
            qty,
            userId: user._id,
        }
        let itemInCart = await cartModel.findOne({ userId: user._id, item: itemId });
        if (itemInCart) {
            let cartData = await cartModel.findOneAndUpdate({ _id: itemInCart._id }, { $inc: { qty: qty } }, { new: true });
            return successResponseWithData(res, "success", cartData)
        }
        let cartData = await cartModel.create(temp);
        return successResponseWithData(res, "success", cartData)

    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.getCart = async (req, res) => {
    try {
        const user = req.user;
        let cart = await cartModel.find({ userId: user._id }).populate("item");
        return successResponseWithData(res, "success", cart)
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.updateCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const { qty } = req.body;
        let cartData = await cartModel.findOneAndUpdate({ _id: cartId }, { $inc: { qty } }, { new: true });
        return successResponseWithData(res, "success", cartData)
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await cartModel.deleteOne({ _id: cartId });
        return successResponseWithData(res, "success", {})
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}



exports.addOrder = async (req, res) => {
    try {

        const { totalAmount, payablePrice, quantity, paymentStatus, paymentType, addressId, productId } = req.body;
        const user = req.user;
        const temp = {
            userId: user._id,
            addressId: addressId,
            totalAmount,
            paymentStatus,
            paymentType,
            items: [{
                payablePrice,
                quantity,
                productId: productId
            }],
            orderStatus: [
                {
                    type: "ordered",
                    date: new Date(),
                    isCompleted: true,
                },
                {
                    type: "packed",
                    isCompleted: false,
                },
                {
                    type: "shipped",
                    isCompleted: false,
                },
                {
                    type: "delivered",
                    isCompleted: false,
                },
            ]
        }
        const order = await orderModel.create(temp)
        return successResponseWithData(res, "success", order)
    } catch (error) {
        console.log(error);
        return ErrorResponse(res, "something went wrong!")
    }
}

exports.getOrders = async (req, res) => {
    try {
        const user = req.user
        const orderList = await orderModel.find({ user: user._id })
            .select("_id paymentStatus paymentType orderStatus items")
            .populate("items.productId", "_id name image");
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
            const data = { order }
            return successResponseWithData(res, "success", data)
        }
    } catch (error) {
        return ErrorResponse(res, "some thing went wrong!");
    }

}

exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        await orderModel.deleteOne({ _id: orderId });
        return successResponseWithData(res, "success", {})
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.posterPage = async (req, res) => {
    try {
        const poster = await posterModel.find({ status: "ACTIVE" });
        return successResponseWithData(res, "success", poster);
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.productPage = async (req, res) => {
    try {

     const product = await productModel.find({status: "ACTIVE" })
    .populate("category")
    .populate("brand")
    return successResponseWithData(res, "success", product);
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.categoryPage = async (req, res) => {
    try {
        const  category =await categoryModel.find({"status":"ACTIVE"});
        return successResponseWithData(res, "success", category);


    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.brandsPage = async (req, res) => {
    try {
        const brands =await brandModel.find({"status":"ACTIVE"})
        return successResponseWithData(res, "success", brands);


    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.topPicksPage = async (req, res) => {
    try {
        const topPicks =await orderModel.aggregate([
            {$unwind: "$items"},
            {$group:{
                _id: "$items.productId",
                count: {$sum: 1}
            }},
            {
                $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetail",
              },
            },
            {"$unwind":"$productDetail"},
            {$sort: {count: -1}},
            {$limit: 10}
        ]);

        return successResponseWithData(res, "success", topPicks);


    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}

exports.vendorPage = async (req, res) => {
    try {
        const vendor =await brandModel.find({"status":"ACTIVE"})
        return successResponseWithData(res, "success", vendor);
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res, { message: "somethink is wrong!" });
    }
}


