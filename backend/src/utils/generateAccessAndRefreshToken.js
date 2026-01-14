import { Admin } from "../models/admin.models.js";
import { Student } from "../models/student.models.js";


const generateAccessAndRefreshToken = async(userId,Model) => {
  const user = await Model.findById(userId)
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  
  await Model.findByIdAndUpdate(user._id,
    {
      $set:{
        refreshToken:refreshToken
      }
    }
  )
  return {accessToken,refreshToken}
}

export {generateAccessAndRefreshToken}