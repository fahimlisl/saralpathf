import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan"


const app = express();

app.use(morgan("combined"))
app.use(cookieParser());
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb",extended:true}));
app.use(express.static("public"));


// routes
import adminRouter from "./routes/admin.routes.js"
import generalRouter from "./routes/general.routes.js"
import teacherRouter from "./routes/teacher.routes.js"

app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/general",generalRouter)
app.use("/api/v1/teacher",teacherRouter)

export {app}