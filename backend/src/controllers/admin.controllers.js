import { Admin } from "../models/admin.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import { options } from "../utils/options.js";

const registerAdmin = asyncHandler(async (req, res) => {
  const { username, phoneNumber, password, email } = req.body;
  if ([username, phoneNumber, password, email].some((t) => !t && t !== 0)) {
    throw new ApiError(400, "All fileds are requuired");
  }

  const existedUserC = await Admin.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (existedUserC) {
    throw new ApiError(401, "user already exits");
  }

  const data = await Admin.create({
    username,
    phoneNumber,
    email,
    password,
  });

  if (!data) {
    throw new ApiError(400, "error while crating user ");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, data, "user created successflly"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  const foundUser = await Admin.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!foundUser) throw new ApiError(400, "wasn't able to find user");
  if (!password) throw new ApiError(400, "password must required");
  const comparePassword = await foundUser.checkPassword(password);
  if (!comparePassword) throw new ApiError(400, "password is error");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    foundUser._id,
    Admin
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        foundUser,
        "Admin logged In successfully!"
      )
    );
});



const logOutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const users = await Admin.findByIdAndUpdate(
    userId,
    {
      $unset: { refreshToken: "" },
    },
    {
      new: true,
    }
  );

  if (!users) throw new ApiError(400, "somthing went wrong ");

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "usr logged out successfully"));
});


export {logOutUser,loginAdmin,registerAdmin}