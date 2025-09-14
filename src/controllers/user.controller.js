const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const User = require("../models/user.model.js");
const uploadToCloudinary = require("../config/cloudinary.js");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshToken = async(userId) => {
   const user = await User.findById(userId);
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();

   user.refreshToken = refreshToken;
   await user.save({validateBeforeSave: false});
   return { accessToken, refreshToken };
} 

const registerUser = asyncHandler ( async(req, res) => {
   //receive data from frontend
   const { userName, email, fullName, password } = req.body;

   //check all fields are available or not
   if(!userName || !email || !fullName || !password){
    throw new apiError (400, "All fields are required..");
   }

   //check an user with the email or userName already exists or not
   const existingUser = await User.findOne({$or: [{ userName }, { email }]});
   if(existingUser){
    throw new apiError(409, "User with this username of email already exists..");
   }
   //check the avatar is available or not
   // console.log(req.files);
   const avatarLocalPath = req.files?.avatar[0]?.path;
   if(!avatarLocalPath){
      throw new apiError(409, "Avatar is required..");
   }

   //upload avatar file in cloudinary
   const avatar = await uploadToCloudinary(avatarLocalPath);
   if(!avatar){
      throw new apiError(409, "Avatar file is required..");
   }

   //create an object and save it is Db
   const user = await User.create({
      fullName,
      email,
      avatar: avatar.url,
      userName,
      password
   });

   //remove password and refresh token field from response
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   //check the user created or not
   if(!createdUser){
      throw new apiError(500, "Something went wrong during the registration process..");
   }

   //send response
   return res.status(201).json(
      new apiResponse(200, createdUser, "User registered successfully..")
   );
})

const login = asyncHandler( async(req, res) => {
   //receive data from frontend
   const { userName, email, password} = req.body;
   
   //check Username or email
   if (!userName && !email) {
      throw new apiError(400, "Username or email is required..");
   }

   //find the user
   const user = await User.findOne({$or: [{userName}, {email}]});
   if(!user){
      throw new apiError(404, "User does not exists.. Register first..");
   }

   //check the password
   const isPasswordValid = await user.isPasswordCorrect(password);
   if(!isPasswordValid){
      throw new apiError(401, "Incorrect password..");
   }

   //generate accessToken and refreshToken
   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

   //send cookie
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
   const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
   };

   res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(
      new apiResponse(
         200,
         {
            user: loggedInUser, accessToken, refreshToken
         },
         "User logged in successfully.."
      )
   )
});

const logout = asyncHandler(async(req, res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: { refreshToken: undefined }
      },
      { new: true }
   )
   const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
   };

   return res
   .status(200)
   .clearCookie("accessToken", option)
   .clearCookie("refreshToken", option)
   .json(new apiResponse(200, "", "User logged out successfully.."));
});

const refreshAccessToken = asyncHandler(async(req, res) => {
   const iscomingAccessToken = req.cookies.refreshToken || req.body.refreshToken;
   if (!iscomingAccessToken) {
      throw new apiError(401, "Unauthorized request..");
   }

  try {
    const decodedToken = jwt.verify(iscomingAccessToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
       throw new apiError(404, "Invlaid token..");
    }
 
    if (iscomingAccessToken !== user?.refreshAccessToken) {
       throw new apiError(401, "Refresh token is expired or invalid..");
    }
 
    const options = {
       httpOnly: true,
       secure: true
    };
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
 
    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
       new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed.."
       )
    )
  } catch (error) {
   throw new apiError(500, error.message);
  }

})

module.exports = {
   registerUser,
   login,
   logout,
   refreshAccessToken
};