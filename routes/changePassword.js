const express = require("express");
const router = express.Router();
const {sendOtp , verifyPassChangeOtp , changePass ,resendOtp} = require("../controllers/changePassword");
// const {Register , Login ,Logout} = require("../controllers/auth");
const {deserializeUser} = require("../middlewares/deserializeUser");
const {wrapAsync} = require("../utils/asyncError.js")

router.post("/sendPassChangeOtp" , wrapAsync(sendOtp))
router.post("/verifyPassChangeOtp" , wrapAsync(verifyPassChangeOtp))
router.post("/changePass" , wrapAsync(changePass));
router.post("/resendPassChange" , wrapAsync(resendOtp));


//Below is the example of a protected route
// router.get('/s', deserializeUser , (req , res) => {
//     if(!req.user) return res.send({error : "No user logged In"});
//     res.send({data : req.user});
// })


module.exports = router;