const { schema } = require("../utils/schema.js");
const userSchema = require("../models/users.js");
const otpSchema = require("../models/otpVerification.js");
const createError = require("http-errors");
const {
  signJWT,
  encryptData,
  encryptUserData,
  verifyData,
} = require("../utils/jwtUtils.js");
const bcrypt = require("bcrypt");
const { decrypt } = require("dotenv");
const { sendRegisterOtp } = require("../utils/smtp.js");
module.exports = {
  Register: async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      // const isJoiValid = await schema.validateAsync({ username, password });
      console.log(req.body);
      const doesExist = await userSchema.findOne({ email });
      if (doesExist){
        const {verified} = doesExist;
        if(verified){
          return next(
            createError.Conflict("User with same username already exists !!")
          );
        }
      }

      console.log("H");
      const otpVal = Math.floor(Math.random() * Math.pow(10, 4));
      const registerOtp = await encryptData(otpVal);
      // const registerOtp = Math.floor(Math.random() * Math.pow(10 ,4));
      const thisOtp = new otpSchema({ otp: registerOtp });
      const { _id } = await thisOtp.save();
      
      const user = new userSchema({ email, username, password, otp: _id });
      const userData = await user.save();
      
      const { success, info, err } = await sendRegisterOtp(
        userData.username,
        userData.email,
        otpVal
        );
        if (!success) return next(err);
        
        // const userId = encryptUserData(userData._id);
        //Send the email
        
        res.status(200).send({ user: userData, otp: otpVal });
      } catch (e) {
        if (e.isJoi) {
          e.message = "Pass or email wrong!!";
        }
        next(e);
      }
    },
    resendRegisterOtp : async function(req , res , next) {
      try{
        const {userId} = req.body;
        const otpVal = Math.floor(Math.random() * Math.pow(10, 4));
        const registerOtp = await encryptData(otpVal);
        const newOtp = new otpSchema({otp : registerOtp});
        const saveOtp = await newOtp.save();
        const updatedUser = await userSchema.findByIdAndUpdate({_id: userId} , {$set : {otp : saveOtp._id}});
        // console.log(updatedUser)
        //updatedUser has old properties
        //Remove the old Otp
        const deleteOldOtp = await otpSchema.findByIdAndDelete({_id : updatedUser.otp});
        res.send({success : true , message : "New Otp Sent !!" , otp : otpVal});
      }
      catch(e){
        next(e);
      }
    },
  otpVerification: async function (req, res, next) {
    try {
      //Otp ==> sent from clientside
      //otp ==> the otp object populated from mongo
      //OTP ==> actual encrypted otp
      const { Otp, userId } = req.body;
      const { username, email, otp, _id } = await userSchema
        .findById({ _id: userId })
        .populate("otp");
      console.log(otp.otp);
      const { payload } = await verifyData(otp.otp);
      const { data } = payload;
      console.log(data);
      if (!data)
        throw new createError(
          401,
          "The OTP has expired , please try resending it !!"
        );
      // console.log("THis is adata" ,data);
      if (data != Otp) throw new createError(401, "Wrong Otp");
      const updatedUser = await userSchema.findByIdAndUpdate({_id : userId} , {$set : {verified  : true}} , {new : true});
      const AT = await signJWT(_id, 0);
      const RT = await signJWT(_id, 1);

      res.cookie("accessToken", AT, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.cookie("refreshToken", RT, {
        expires: new Date(Date.now() + 60 * 1000),
        httpOnly: true,
      });
      res.send({ success: true, message: `Welcome , ${username}` });
    } catch (e) {
      next(e);
    }
  },
  Login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // const isJoiValid = await schema.validateAsync({ username, password });
      const userData = await userSchema.findOne({ email });
      const isCorr = await bcrypt.compare(password, userData.password);
      if (!isCorr)
        throw createError.BadRequest("Wrong username or password !!");

      const AT = await signJWT(userData._id, 0);
      const RT = await signJWT(userData._id, 1);

      res.cookie("accessToken", AT, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.cookie("refreshToken", RT, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.send({ user: userData });
    } catch (e) {
      if (e.isJoi) {
        e.message = "Pass or email wrong!!";
      }
      next(e);
    }
  },
  Logout: (req, res, next) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.send({ data: "Logged Out Successfully !!" });
    } catch (e) {
      next(e);
    }
  },
};
