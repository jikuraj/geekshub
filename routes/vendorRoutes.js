const router=require("express").Router();
const auth = require("../middleware/index.js").authVendor;
const {validateSingupRequest,validateSinginRequest, isRequestValidated}=require("../validators/vendorValidate")
const controller = require("../controller/vendorController");

router.post("/signup",validateSingupRequest,isRequestValidated,controller.singup );
router.post("/signin",validateSinginRequest,isRequestValidated,controller.singin);
router.post("/logout",auth,controller.logout);
router.post("/forgotPassword",controller.forgotPassword);


module.exports=router;