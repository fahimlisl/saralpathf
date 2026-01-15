import { Router } from "express";
import { loginAdmin, logOutUser, registerAdmin } from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { collectFee, downloadInvoice, previewInvoice, registerStudent } from "../controllers/student.controllers.js";
import { registerTeacher } from "../controllers/teacher.controllers.js";


const router = Router();

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyJWT,logOutUser)


// studnet routes
router.route("/register-student").post(verifyJWT,registerStudent)


// fee routes
router.route("/collect-fee/:id").patch(verifyJWT,collectFee)
router.route("/invoice/:studentId/:month")
  .get(verifyJWT, downloadInvoice); // downloads/streams PDF

router.route("/invoice/preview/:studentId/:month")
  .get(verifyJWT, previewInvoice); // HTML preview

// teacher
router.route("/register-teacher").post(verifyJWT,registerTeacher)

export default router; 