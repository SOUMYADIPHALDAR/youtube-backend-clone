const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiError.js");
const apiResponse = require("../utils/apiResponse.js");
const User = require("../models/user.model.js");
const uploadToCloudinary = require("../config/cloudinary.js");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

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
      secure: true
   };

   return res
   .status(200)
   .cookie("accessToken", accessToken, option)
   .cookie("refreshToken", refreshToken, option)
   .json(
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
      secure: true
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
 
    if (iscomingAccessToken !== user?.refreshToken) {
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

const changePassword = asyncHandler(async(req, res) => {
   const { oldPassword, newPassword, confirmPassword } = req.body;

   const user = await User.findById(req.user?._id);
   const correctPassword = user.isPasswordCorrect(oldPassword);
   if(!correctPassword){
      throw new apiError(400, "Invalid password..");
   }

   if(newPassword !== confirmPassword){
      throw new apiError(400, "Your new password and confirm password must be same..");
   }

   user.password = newPassword;
   await user.save({validateBeforeSave: false});

   return res
   .status(200)
   .json(
      new apiResponse(200, "Password changed successfully..")
   )
});

const getExistingUser = asyncHandler(async(req, res) => {
   return res
   .status(200)
   .json(
      new apiResponse(200, req.user, "This is your user profile..")
   )
});

const updateAccountDetails = asyncHandler(async(req,res) => {
   const {fullName, email} = req.body;
   if(!fullName || !email){
      throw new apiError(400, "All fields are required..");
   }
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            fullName,
            email
         }
      },
      {new: true}
   ).select("-password")

   return res
   .status(200)
   .json(new apiResponse(200, user, "Update your account details successfully.."));
});

const updateAvatar = asyncHandler(async(req, res) => {
   const avatarLocalPath = req.file?.path;
   if (!avatarLocalPath) {
      throw new apiError(400, "Avatar file is missing..");
   }

   const avatar = await uploadToCloudinary(avatarLocalPath);
   if(!avatar.url){
      throw new apiError(400, "Error happend during uploading avatar..");
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            avatar: avatar.url
         }
      },
      {new: true}
   ).select("-password");

   return res
   .status(200)
   .json(
      new apiResponse(200, user, "Avatat updated successfully..")
   )
});

const getUserChannelDetails = asyncHandler(async(req, res) => {
   const { userName } = req.params;
   if (!userName) {
      throw new apiError(400, "User name is missing..");
   }

   const channel = await User.aggregate([
      {
         $match: {
            userName
         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
         }
      },
      {
         $lookup: {
            from: "subscriber",
            localField: "_id",
            foreignField: "channel",
            as: "subscribedTo"
         }
      },
      {
         $addFields: {
            subscribersCount: {
               $size: "$subscribers"
            },
            channelSubscribedToCount: {
               $size: "$subscribedTo"
            },
            isSubscribed: {
              $cond: {
               if: {$in: [req.user?._id, "$subscribers.subscriber"]},
               then: true,
               else: false
              }
            }
         }
      },
      {
         $project: {
            fullName: 1,
            userName: 1,
            subscribersCount: 1,
            channelSubscribedToCount: 1,
            isSubscribed: 1,
            email: 1,
            avatar: 1
         }
      }
   ]);

   if (!channel?.length) {
      throw new apiError(400, "channel does not exists..");
   }

   return res
   .status(200)
   .json(
      new apiResponse(200, channel[0], "User channel fetched successfully..")
   )
});

const getWatchHistory = asyncHandler(async(req, res) => {
   const user = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
         }
      },
      {
         $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
            pipeline: [
               {
                  $lookup: {
                     from: "user",
                     localField: "owner",
                     foreignField: "_id",
                     as: "owner",
                     pipeline: [
                        {
                           $project: {
                              fullName: 1,
                              userName: 1,
                              avatar: 1
                           }
                        }
                     ]
                  }
               },
               {
                  $addFields: {
                     owner: {
                        $first: "$owner"
                     }
                  }
               }
            ]
         }
      }
   ])

   return res
   .status(200)
   .json(
      new apiResponse(200, user[0].watchHistory, "Watch history fetched successfully..")
   )
});

module.exports = {
   registerUser,
   login,
   logout,
   refreshAccessToken,
   changePassword,
   getExistingUser,
   updateAccountDetails,
   updateAvatar,
   getUserChannelDetails,
   getWatchHistory
};