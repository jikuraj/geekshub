const {check,validationResult}=require("express-validator");

exports.validateSingupRequest=[
    check('firstName')
    .notEmpty()
    .withMessage("firstName is required"),
    check('lastName')
    .notEmpty()
    .withMessage("lastName is required"),
    check('email')
    .isEmail()
    .withMessage("valid email is required"),
    check('password')
    .isLength({min:6})
    .withMessage("password must be atleast 6 character long")
];

exports.validateSinginRequest=[
    check('email')
    .isEmail()
    .withMessage("valid email is required"),
    check('password')
    .isLength({min:6})
    .withMessage("password must be atleast 6 character long")
];

exports.isRequestValidated=(req,res,next)=>{
    const errors=validationResult(req);
   //  console.log(errors);
    if(errors && errors.errors.length>0){
       return  res.status(400).json({error:errors.errors[0].msg});
   }
    next();
   }