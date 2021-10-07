const router=require("express").Router();
const multer=require("multer");
const shortid=require("shortid");
const path=require("path");
const auth=require("../middleware/index").authAdmin;
const controller=require("../controller/adminController");
const {validateSinginRequest, isRequestValidated } = require("../validators/adminValidate");


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

router.post('/product',auth,upload.array('image'),controller.createProduct);
router.post("/signin",validateSinginRequest,isRequestValidated,controller.singin)
router.post("/logout",auth,controller.logout);
router.get("/productList",auth,controller.getProduct);
router.get("/productDetail/:productId",controller.productDetail);
router.post("/poster",auth,upload.array('image'),controller.poster)

router.get("/getOrders",auth,  controller.getOrders);
router.get("/getOrder/:orderId", auth, controller.getOrder);
router.post("/brand",auth,upload.array('image'),controller.addBrand)
router.post("/category",auth,upload.array('image'),controller.addCategory)



module.exports=router;