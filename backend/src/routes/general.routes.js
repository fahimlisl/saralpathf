import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { downloadAdmitCard, previewAdmitCard, register } from "../controllers/onlineRegistration.controllers.js";
import { generateAdmitCard,generateMultipleAdmitCards} from "../controllers/onlineRegistration.controllers.js";
const router = Router();

router.route("/online-registration").post(upload.fields([
    {
        name:"photo",
        maxCount:1
    },
    {
        name:"brithCertificate",
        maxCount:1
    }
]),register)


// admit cards routes
router.get('/admit-card/:studentId', generateAdmitCard); // stream to browser
router.get('/admit-card/download/:studentId', downloadAdmitCard); // forces download
router.get('/admit-card/preview/:studentId', previewAdmitCard); // HTML preview in browser
router.post('/admit-card/batch', generateMultipleAdmitCards); // batch download as ZIP


export default router