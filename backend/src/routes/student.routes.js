import {Router} from "express"
import { 
    generateMarksheet, 
    previewMarksheet, 
    generateMultipleMarksheets 
} from '../controllers/marksheet.controllers.js';

const router = Router();


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