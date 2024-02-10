const { verifyJWT, signJWT } = require("../utils/jwtUtils");
const userSchema = require("../models/users.js");
const createError = require("http-errors");
module.exports = {
  deserializeUser: async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = req.cookies;
      const { payload, expired } = await verifyJWT(accessToken, 0);
      if (payload && !expired) {
        const userData = await userSchema.findById({ _id: payload._id });
        req.user = userData;
        return next();
      }
      if (expired && !refreshToken)
        return next(createError.Unauthorized("Please Login!!"));
      const refreshTokenData = await verifyJWT(refreshToken, 1);
      const newAccesToken = await signJWT(refreshTokenData.payload._id, 0);
      res.cookie("accessToken", newAccesToken, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      const user = await userSchema.findById({ _id: refreshTokenData.payload._id });
      req.user = user;
      return next();
    } catch (e) {
      next(e);
    }
  },
};
