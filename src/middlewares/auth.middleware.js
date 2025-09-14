const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //check the token
    if (!token) {
      throw new apiError(404, "Unauthorized user..");
    }

    //verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    //find the user
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new apiError(401, "Invalid Token..");
    }
    
    //add user in req
    req.user = user;
    next();

  } catch (error) {
    throw new apiError(401, "Invalid access token..");
  }
});

module.exports = verifyJWT;
