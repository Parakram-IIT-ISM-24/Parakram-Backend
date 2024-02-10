const { number, bool, boolean } = require('joi');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const jwt = require("jsonwebtoken");
const createError = require('http-errors');
const bcrypt = require("bcrypt")

const otpSchema = new mongoose.Schema({
    otp : {
        type : String,
    }
})

module.exports = mongoose.model("Otp" , otpSchema);