import { Router } from "express";
import { loginAdmin, logOutUser, registerAdmin } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { collectFee, countStudent, downloadInvoice, fetchAllStudents, fetchParticularStudent, previewInvoice, registerStudent } from "../controllers/student.controllers.js";
import { countTeacher, editTeacher, fetchAllTeacher, fetchParticularTeacher, registerTeacher } from "../controllers/teacher.controllers.js";
import { generateMarksheet } from "../controllers/marksheet.controllers.js";


const router = Router();

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyJWT,logOutUser)


// studnet routes
router.route("/register-student").post(verifyJWT,registerStudent)
router.route("/fetchAllStudents").get(verifyJWT,fetchAllStudents)
router.route("/fetchParticularStudent/:id").get(verifyJWT,fetchParticularStudent)
router.route("/countStudent").get(verifyJWT,countStudent)


// fee routes
router.route("/collect-fee/:id").patch(verifyJWT,collectFee)
router.route("/invoice/:studentId/:month")
  .get(verifyJWT, downloadInvoice); // downloads/streams PDF

router.route("/invoice/preview/:studentId/:month")
  .get(verifyJWT, previewInvoice); // HTML preview

// teacher
router.route("/register-teacher").post(verifyJWT,registerTeacher)
router.route("/countTeacher").get(verifyJWT,countTeacher)
router.route("/fetchAllTeacher").get(verifyJWT,fetchAllTeacher)
router.route("/editTeacher").patch(verifyJWT,editTeacher)
router.route("/fetchParticularTeacher").get(verifyJWT,fetchParticularTeacher)

// marksheet 
router.route("/marksheet/:studentId")
    .get(
        verifyJWT,
         generateMarksheet);

export default router; 