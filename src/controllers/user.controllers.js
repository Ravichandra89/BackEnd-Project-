// Write the Logic for to Register the User
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store the refresh token at database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while genrating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Steps to create the User
  /*
 1. Get the User data from Frontend
 2. validate the UserData
 3. Check if User Already Exist or not (username, email)
 4. check for images
 5. Upload them  on cloudinary 
 6. Create the User Object to send (MongoDB)
 7. Remove password and refresh token from response data
 8. Send the response to frontend for user Register
 */

  const { fullName, email, username, password } = req.body;
  console.log(email);

  // Apply the validation step
  if (
    [fullName, password, username, email].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All Fields are Required");
  }

  // Check that user exist or not
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (!existedUser) {
    throw new ApiError(409, "User is Already exist");
  }

  // Taking the avatar filepath
  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Upload the Avatar and CoverImage on cloudinary
  const avatarResponse = await uploadOnCloudinary(avatarLocalPath);
  const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath);

  //  Again check for Avatar because it's required field
  if (!avatar) {
    throw new ApiError(400, "Avatar is Required");
  }

  // Step to create the User Object in MongoDB
  const userObject = await User.create({
    // Write here all the required fields
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Last Step give the response
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // 1. Get the Data From the frontend
  const { password, username, email } = req.body;
  // console.log(email);

  // 2. validate username and email
  if (!username && !email) {
    throw new ApiError(401, "Username and Password are Required");
  }

  // step 3: Find the user from MongoDB
  const user = User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User Does not exist");
  }

  // Step 4: Check the password
  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  // Step5 : Generate if Password and user has valid

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);

  // Step6 : remove the passowrd and refreshtoken
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Return the response
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("AccessCookie", accessToken, options)
    .cookie("RefreshCookie", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "Login Successfully"
      )
    );
});

const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Access the refresh Toekn from the cookies
  // Verify with the DataBase refresh token
  // If both match than generate new Access token

  const incomingToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  // Verify the Incoming Token
  try {
    const decodedToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = User.findById(decodedToken?._id);
  
    if(!user){
      throw new ApiError(401, "Unauthorized Refresh Token ");
    }
  
    if(incomingToken !== user?.refreshToken){
      throw new ApiError(401, "Refresh token is expired or used ");
    }
  
    const options = {
      httpOnly: true,
      secure: true
    }
    // Than generate Access token
    const {accessToken, newRefreshToken}  = await generateAccessAndRefreshToken(user._id);
  
    return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", newRefreshToken)
    .json( new ApiResponse(
      200,
      {
        accessToken, refreshToken: newRefreshToken
      },
      "Access Token Refreshed"
    ))
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh token")
  }
});

export { registerUser, loginUser, userLogout, refreshAccessToken };
