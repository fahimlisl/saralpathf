import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { register } from "../controllers/onlineRegistration.controllers.js";

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

export default router