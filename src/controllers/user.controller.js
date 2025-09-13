const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const User = require("../models/user.model.js");
const uploadToCloudinary = require("../config/cloudinary.js");

const registerUser = asyncHandler ( async(req, res) => {
   //receive data from frontend
   const { userName, email, fullName, password } = req.body;

   //check all fields are available or not
   if(!(userName, email, fullName, password)){
    throw new apiError (409, "All fields are required..");
   }

   //check an user with the email or userName already exists or not
   const existingUser = await User.findOne({$or: [{ userName }, { email }]});
   if(existingUser){
    throw new apiError(409, "User with this username of email already exists..");
   }
   //check the avatar is available or not
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

module.exports = registerUser;