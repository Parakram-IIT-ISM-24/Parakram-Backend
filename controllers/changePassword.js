const userSchema = require("../models/users");
const createError = require("http-errors");
const otpSchema = require("../models/otpVerification.js");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const {
  signJWT,
  encryptData,
  encryptUserData,
  verifyData,
} = require("../utils/jwtUtils.js");
// const bcrypt = require("bcrypt");
const { decrypt } = require("dotenv");
const { sendPassChangeOtp } = require("../utils/smtp.js");

module.exports = {
  sendOtp: async function (req, res, next) {
    try {
      const { email } = req.body;
      const doesExist = await userSchema.find({ email });
      if (!doesExist)
        throw new createError(
          401,
          "No such user with exists , please register!!"
        );
      //The below case when user has not verified , just redirect them to reverify rather than giving an error
      const { verified } = doesExist[0];
      console.log(doesExist)
      if (!verified)
        throw new createError(401, "User not verified , please Re-register!!");
      const otpVal = Math.floor(Math.random() * Math.pow(10, 4));
      const registerOtp = await encryptData(otpVal);
      const changePassOtp = new otpSchema({ otp: registerOtp });
      const savedOtp = await changePassOtp.save();
      const userData = await userSchema.findOneAndUpdate(
          { email },
          { $set: { changePassOtp: savedOtp._id } }
          );
          const { success, info, err } = await sendPassChangeOtp(
              userData.username,
              userData.email,
              otpVal
              );
              if (!success) return next(err);
              res.send({ success: true, message: "Otp sent !!!", user: userData ,otp:otpVal });
            } catch (e) {
                next(e);
            }
        },
        verifyPassChangeOtp: async function (req, res, next) {
            try {
                const { Otp, userId } = req.body;
                const { changePassOtp } = await userSchema
                .findById({ _id: userId })
                .populate("changePassOtp");
                console.log("here" , changePassOtp.otp)
                const {payload} = await verifyData(changePassOtp.otp);
                console.log(payload)
                const { data } = payload;
                console.log(data);
    console.log(data);
    if (!data)
    throw new createError(
401,
"The OTP has expired , please try resending it !!"
);
if (data != Otp) throw new createError(401, "Wrong Otp");
const hashedUserId = await encryptData(userId);
res.send({success : true , token : hashedUserId , message: "Otp correct!!"});
} catch (e) {
    next(e);
}
},
changePass : async function(req , res ,next) {
    try{
        const {hashedUserId , newPass} = req.body;
        const {payload} = await verifyData(hashedUserId);
        if(!payload) throw new createError(401 , "Connection Timed Out , Retry cahnging the password !!");
        const {data} = payload;
        const hashedPass = await bcrypt.hash(newPass, 10);
        const updatedUser = await userSchema.findByIdAndUpdate({_id : data} , {$set : {password : hashedPass}});
        res.send({success : true , message : "Password Changed , relogin please"})
    }catch(e){
        next(e);
    }
},
resendOtp : async function(req  , res , next) {
    try{
        const {email , userId} = req.body;
        const otpVal = Math.floor(Math.random() * Math.pow(10, 4));
        const registerOtp = await encryptData(otpVal);
        const newOtp = new otpSchema({otp : registerOtp});
        const savedNewOtp = await newOtp.save();
        const {username , changePassOtp} = await userSchema.findByIdAndUpdate({_id : userId} , {$set : {changePassOtp : savedNewOtp._id}});
        const deletedOtp = await  otpSchema.findByIdAndDelete({_id : changePassOtp});
        const { success, info, err } = await sendPassChangeOtp(
            username,
            email,
            otpVal
            );
            if (!success) return next(err);
        res.send({success : true , message : "Otp Sent !!" , otp : otpVal});
    }
    catch(e){
        next(e);
    }
}
};
