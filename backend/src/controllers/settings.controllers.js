import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Settings } from "../models/settings.models.js";

const fetchSettingsStatus = asyncHandler(async (req, res) => {
  const settings = await Settings.find();
  if (settings.length === 0) {
    console.log("in if block");
    await Settings.create({
      onlineAdmission: true,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        settings,
        "fetched site settings status successfully",
      ),
    );
});

const toggleAdmissionStatus = asyncHandler(async (req, res) => {
  const { onlineAdmission } = req.body;

  if (typeof onlineAdmission !== "boolean")
    throw new ApiError(
      400,
      "value of response as online admission must be boolean",
    );
  let s = await Settings.find();
  if (s[0].onlineAdmission === onlineAdmission) {
    throw new ApiError(400, "input is same as the previous default value");
  }
  let settings = await Settings.findByIdAndUpdate(
    s[0]._id,
    {
      $set: {
        onlineAdmission,
      },
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, settings, "response have been successfully updated"),
    );
});

export { toggleAdmissionStatus, fetchSettingsStatus };
