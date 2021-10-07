const User = require("../models/user")
const productModel = require("../models/productModel");
const posterModel = require("../models/posterModel");
const orderModel = require("../models/orderModel")

const shortid = require("shortid");
const slugify = require("slugify");
const jwt = require("jsonwebtoken");
const { successResponseWithData, ErrorResponse } = require("../helpers/apiResponse");
const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");




exports.singin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return ErrorResponse(res, error)

        if (user) {
            if (user.authenticate(req.body.password) && user.role === 'admin') {
                const token = await jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECREAT, { expiresIn: '2d' });
                const { _id, firstName, lastName, email, role, fullName } = user;
                let data = await {
                    token,
                    user: {
                        _id, firstName, lastName, email, role, fullName
                    }
                }
                return successResponseWithData(res, "Success", data);

            } else {
                return ErrorResponse(res, "Invalid password !")
            }
        }

    } catch (error) {
        return ErrorResponse(res, "invalid email !")

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
            brand,
            discount,

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
                details,

            },
            discount,
            image,
            brand,
            category
        }

        let productData = await productModel.create(product)
        return successResponseWithData(res, "success", productData)
    } catch (error) {
        return ErrorResponse(res, error)
    }

}

exports.logout = async (req, res) => {
    return successResponseWithData(res, "success", {})
};

exports.getProduct = async (req, res) => {
    const user = req.user;
    let userDetail = await productModel.find().sort({ name: 1 });
    return successResponseWithData(res, "success", userDetail)
}


exports.productDetail = async (req, res) => {
    const productId = req.params.productId;
    let productDetail = await productModel.findOne({ _id: productId });
    return successResponseWithData(res, "success", productDetail)
};

exports.poster = async (req, res) => {
    try {
        const { description } = req.body
        let image = [];
        console.log(req.files.length);
        if (req.files.length > 0) {
            image = req.files.map(file => {
                return { img: file.filename }
            })
        }
        const temp = { image, description };
        const posterDetail = await posterModel.create(temp);

        return successResponseWithData(res, "success", posterDetail)

    } catch (error) {
        return ErrorResponse(res, "some thing wet wrong!")
    }
}

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
            
            const data = { order }
            return successResponseWithData(res, "success", data)
        }
    } catch (error) {
        return ErrorResponse(res, "some thing went wrong!");
    }

}

exports.addBrand = async (req, res) => {
    try {
        const { name } = req.body
        let image = [];
        if (req.files.length > 0) {
            image = req.files.map(file => {
                return { img: file.filename }
            })
        }
        const temp = { image, name };
        const brand = await brandModel.create(temp);

        return successResponseWithData(res, "success", brand)

    } catch (error) {
        return ErrorResponse(res, "some thing wet wrong!")
    }
}

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body
        let image = [];
        if (req.files.length > 0) {
            image = req.files.map(file => {
                return { img: file.filename }
            })
        }
        const temp = { image, name };
        const category = await categoryModel.create(temp);

        return successResponseWithData(res, "success", category)

    } catch (error) {
        return ErrorResponse(res, "some thing wet wrong!")
    }
}