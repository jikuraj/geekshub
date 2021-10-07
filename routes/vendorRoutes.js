const router=require("express").Router();
const multer=require("multer");
const shortid=require("shortid");
const path=require("path");
const auth = require("../middleware/index.js").authVendor;
const {validateSingupRequest,validateSinginRequest, isRequestValidated}=require("../validators/vendorValidate")
const controller = require("../controller/vendorController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, shortid.generate()+ '-' + file.originalname)
    }
  })

  
 const upload=multer({storage});

router.post("/signup",validateSingupRequest,isRequestValidated,controller.singup );
router.post("/signin",validateSinginRequest,isRequestValidated,controller.singin);
router.post("/logout",auth,controller.logout);
router.post("/forgotPassword",controller.forgotPassword);
router.put("/resetPassword",controller.resetPassword);
router.post('/product',auth,upload.array('image'),controller.createProduct);
router.get("/productList",auth,controller.getProduct);
router.get("/productDetail/:productId",controller.productDetail);

router.get("/getOrders",auth,  controller.getOrders);
router.get("/getOrder/:orderId", auth, controller.getOrder);


module.exports=router;