import { OnlineRegistration } from "../models/onlineRegistration.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const register = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, address, birthDate, city, state ,desiredClass,typeOfClass} =
    req.body;
  if (
    [fullName, address, city, state, phoneNumber, birthDate].some(
      (t) => !t && t !== 0
    )
  ) {
    throw new ApiError(400, "these fields are must required");
  }

  if(!(desiredClass || typeOfClass)){
    throw new ApiError(400,"at least one of these fields either desired class or type of class required or both required")
  }

  const checkAlready = await OnlineRegistration.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (checkAlready)
    throw new ApiError(
      400,
      "studnet is already registarted using the following phone number"
    );

  const photoFilePath = req.files?.photo?.[0];
  const birthphotoFilePath = req.files?.brithCertificate?.[0];

  if (!(photoFilePath && birthphotoFilePath))
    throw new ApiError(
      400,
      "candidate photo and birth Certificate must required"
    );

  const photo = await uploadOnCloudinary(photoFilePath.buffer);
  const brithCertificate = await uploadOnCloudinary(birthphotoFilePath.buffer);

  if (!photo)
    throw new ApiError(400, "faield to upload candidate photo to cloudinary");
  if (!brithCertificate)
    throw new ApiError(400, "failed to upload birth certificate to cloudinary");

  const applicationId = Math.round(Math.random() * 1000000);

  const newOnline = await OnlineRegistration.create({
    fullName,
    email: email || "",
    phoneNumber,
    address,
    birthDate:new Date(birthDate),
    city,
    state,
    photo: photo.secure_url,
    brithCertificate: brithCertificate.secure_url,
    application_Id: applicationId,
    desiredClass : desiredClass || null,
    typeOfClass : typeOfClass || "",
  });
  if (!newOnline)
    throw new ApiError(500, "internal server error ,failed to register");
  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        newOnline,
        "studnet successfully registered"
    )
  )
});


// fee payment thing left here

export { register };
