import { Router } from "express";
import { loginTeacher, logOutTeacher } from "../controllers/teacher.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/login").post(loginTeacher)
router.route("/logout").post(verifyJWT,logOutTeacher)

export default router;