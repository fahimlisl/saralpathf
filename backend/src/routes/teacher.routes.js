import { Router } from "express";
import { assignMarksToStudent, fetchAssignedStudents, loginTeacher, logOutTeacher } from "../controllers/teacher.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/login").post(loginTeacher)
router.route("/logout").post(verifyJWT,logOutTeacher)

// marks 
router.route("/updateMarks/:id").patch(
    verifyJWT,
    assignMarksToStudent)
router.route("/fetchAssignedStudents").get(
    verifyJWT,
    fetchAssignedStudents
)

export default router;