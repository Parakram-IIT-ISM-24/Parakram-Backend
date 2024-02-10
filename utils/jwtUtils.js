const jwt = require("jsonwebtoken");
const createError = require("http-errors");
module.exports = {
  verifyJWT: async (token, type) => {
    try {
      const publicKey = type == 1 ? process.env.RTS : process.env.ATS;
      const decoded = await jwt.verify(token, publicKey);
      return { payload: decoded, expired: false };
    } catch (error) {
      return { payload: null, expired: true };
    }
  },
  signJWT: async function (userId, type) {
    try {
      const secret = type == 1 ? process.env.RTS : process.env.ATS;
      const expiry = type == 1 ? "60s" : "10s";
      const payload = {
        _id: userId,
        login: Date.now(),
      };
      const options = {
        expiresIn: expiry,
      };
      const token = jwt.sign(payload, secret, options);
      return token;
    } catch (e) {
      return next(e);
    }
  },
  encryptUserData: async function (userId) {
    try {
      const secret = process.env.UD;
      const payload = {
        _id: userId,
        timestamp: Date.now(),
      };
      const options = {
        expiresIn: "180s",
      };
    } catch (e) {
      return next(e);
    }
  },
  decryptUserData: async function (token) {
    try {
      const publicKey = process.env.UD;
      const decoded = await jwt.verify(token, publicKey);
      return { payload: decoded, expired: false };
    } catch (error) {
      return { payload: null, expired: true };
    }
  },
  encryptData: async function (data) {
    try {
      const secret = process.env.UD;
      const payload = {
        data: data,
        timestamp: Date.now(),
      };
      const options = {
        expiresIn: "180s",
      };
      const encyptedFinalData = jwt.sign(payload, secret, options);
      return encyptedFinalData;
    } catch (e) {
      throw new createError(409, "JWT ISSUE");
    }
  },
  verifyData: async function (token) {
    try {
      const publicKey = process.env.UD;
      const decoded = await jwt.verify(token, publicKey);
      console.log(decoded)
      return { payload: decoded, expired: false };
    } catch (error) {
      return { payload: null, expired: true };
    }
  },
};
