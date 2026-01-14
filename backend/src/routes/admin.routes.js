import { Router } from "express";
import { loginAdmin, logOutUser, registerAdmin } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { collectFee, registerStudent } from "../controllers/student.controllers.js";
import { registerTeacher } from "../controllers/teacher.controllers.js";

const rotuer = Router();

rotuer.route("/register").post(registerAdmin)
rotuer.route("/login").post(loginAdmin)
rotuer.route("/logout").post(verifyJWT,logOutUser)


// studnet routes
rotuer.route("/register-student").post(verifyJWT,registerStudent)
rotuer.route("/collect-fee/:id").patch(verifyJWT,collectFee)

// teacher
rotuer.route("/register-teacher").post(verifyJWT,registerTeacher)

export default rotuer; 