const router=require("express").Router();
const multer  = require('multer');
const path=require("path");
const fileExtension=require("file-extension")
const crypto=require("crypto")
const auth = require("../middleware/index.js").authCustomer;
const {validateSingupRequest,validateSinginRequest,validateProfile, isRequestValidated}=require("../validators/validate")
const controller = require("../controller/customerController");
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
    cb(
    null,
    raw.toString("hex") + Date.now() + "." + fileExtension(file.mimetype)
    );
    });
    }
    });
var upload = multer({ storage: storage, })

router.post("/signup",validateSingupRequest,isRequestValidated,controller.singup );
router.post("/signin",validateSinginRequest,isRequestValidated,controller.singin)
router.get("/profile",auth, controller.getProfile)
router.put("/profile",auth, validateProfile,upload.single("image"),controller.updateProfile)
router.post("/address",auth,controller.addAddress)
router.get("/address",auth,controller.getAddress)
router.put("/address/:addressId",auth,controller.editAddress)
router.post("/logout",auth,controller.logout)
router.post("/forgotPassword",controller.forgotPassword);
router.get("/productList",controller.getProduct)
router.get("/productDetail/:productId",controller.productDetail);
router.post("/cart",auth, controller.addToCart)
router.get("/cart",auth, controller.getCart)
router.put("/cart/:cartId",auth, controller.updateCart)
router.delete("/cart/:cartId",auth, controller.deleteCart)

router.get("/homePage",controller.homePage);

router.put("/resetPassword",controller.resetPassword);

router.post("/addOrder", auth, controller.addOrder);
router.get("/getOrders",auth,  controller.getOrders);
router.get("/getOrder/:orderId", auth, controller.getOrder);
router.delete("/deleteOrder/:orderId", auth, controller.deleteOrder);


module.exports=router;