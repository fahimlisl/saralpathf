import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.models.js"
import { ApiError } from "../utils/ApiError.js"
import { Student } from "../models/student.models.js"
import { Teacher } from "../models/teacher.models.js"

const roleMap = {
    studnet: Student,
    admin: Admin,
    teacher: Teacher
}

export const verifyJWT = async(req,_,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if(!token) throw new ApiError(500, "unauthroize access");
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) throw new ApiError(400, "user not verified")
        const Model = roleMap[decodedToken.role]

        const user = await Model.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user) throw new ApiError(402,"something went wrong while finding user , via verify JWT thing");
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401,error.message || "someting went wrong while encoutirng verifyJWT attempt")
    }
}