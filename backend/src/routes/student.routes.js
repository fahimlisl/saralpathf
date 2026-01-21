import {Router} from "express"
import { 
    generateMarksheet, 
    previewMarksheet, 
    generateMultipleMarksheets 
} from '../controllers/marksheet.controllers.js';
import { fetchParticularStudent, loginStudent, logOutStudent } from "../controllers/student.controllers.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();


router.route("/login").post(loginStudent)
router.route("/logout").post(verifyJWT,logOutStudent)
router.route("/profile/:id").get(verifyJWT, fetchParticularStudent)


// Marksheet routes
// router.route("/marksheet/:studentId/:examType")
router.route("/marksheet/:studentId")
    .get(
        // verifyJWT,
         generateMarksheet);

router.route("/marksheet/preview/:studentId")
    .get(
        // verifyJWT, // will be needing to uncomment before putting to production
         previewMarksheet);

// router.route("/marksheet/batch")
//     .post
//     (verifyJWT, 
//         generateMultipleMarksheets);

export default router;