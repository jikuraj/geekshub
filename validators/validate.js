const {check,validationResult}=require("express-validator");

exports.validateSingupRequest=[
    check('email')
    .isEmail()
    .withMessage("valid email is required"),
    check('password')
    .isLength({min:6})
    .withMessage("password must be atleast 6 character long"),
    check('username')
    .notEmpty()
    .withMessage("username required")
];

exports.validateSinginRequest=[
    check('username')
    .notEmpty()
    .withMessage("username is required"),
    check('password')
    .isLength({min:6})
    .withMessage("invalid password !")
];
exports.validateProfile=[
    check('firstName')
    .notEmpty()
    .withMessage("firstName is required"),
    check('lastName')
    .notEmpty()
    .withMessage("lastName is required")
];



exports.addAddress = [
    
]


exports.isRequestValidated=(req,res,next)=>{
 const errors=validationResult(req);
//  console.log(errors);
 if(errors && errors.errors.length>0){
    return  res.status(400).json({error:errors.errors[0].msg});
}
 next();
}