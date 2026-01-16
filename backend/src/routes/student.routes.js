import {Router} from "express"
import { 
    generateMarksheet, 
    previewMarksheet, 
    generateMultipleMarksheets 
} from '../controllers/marksheet.controllers.js';
import { loginStudent, logOutStudent } from "../controllers/student.controllers.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();


router.route("/login").post(loginStudent)
router.route("/logout").post(verifyJWT,logOutStudent)


// Marksheet routes
// router.route("/marksheet/:studentId/:examType")
router.route("/marksheet/:studentId")
    .get(
        // verifyJWT,
         generateMarksheet);

router.route("/marksheet/preview/:studentId")
    .get(
        // verifyJWT,
         previewMarksheet);

// router.route("/marksheet/batch")
//     .post
//     (verifyJWT, 
//         generateMultipleMarksheets);

export default router;