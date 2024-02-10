const express = require("express");
const router = express.Router();
const {Register , Login ,Logout , otpVerification , resendRegisterOtp} = require("../controllers/authentication");
// const {Register , Login ,Logout} = require("../controllers/auth");
const {deserializeUser} = require("../middlewares/deserializeUser");
const {wrapAsync} = require("../utils/asyncError.js")


router.post('/register' , wrapAsync(Register));
router.post('/login' , wrapAsync(Login));
router.post('/logout', Logout);

router.post('/verifyOtp' , wrapAsync(otpVerification));
router.post('/resendRegistrationOtp' , wrapAsync(resendRegisterOtp));
router.post("/pr" , deserializeUser , (req , res) => {
    res.send({user : req.user});
});

    

//Below is the example of a protected route
// router.get('/s', deserializeUser , (req , res) => {
//     if(!req.user) return res.send({error : "No user logged In"});
//     res.send({data : req.user});
// });


module.exports = router;