const { number, bool, boolean } = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const jwt = require("jsonwebtoken");
const createError = require('http-errors');
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    email : {
      type : String,
      required : true
    },
    verified : {
      type : Boolean,
      default : false
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String ,
        required : true
    },
    otp : {
      type : ObjectId , 
      ref : "Otp"
    },
    changePassOtp : {
      type : ObjectId,
      ref : "Otp"
    }
})

userSchema.pre("save", async function (next) {
    try {
      if (this.isModified("password") || this.isNew) {
        console.log("Pass : ", this.password);
        const hashed = await bcrypt.hash(this.password, 10);
        console.log("hashed : ", hashed);
        this.password = hashed;
      }
      next();
    } catch (e) {
      next(e);
    }
  });

module.exports = mongoose.model("User" , userSchema);