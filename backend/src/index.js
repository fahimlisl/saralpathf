import { app } from "./app.js";

import dotnev from "dotenv";
import { connectDB } from "./db/index.js";

dotnev.config({
    path:"./.env"
})



connectDB()
.then( () => {
    app.listen(process.env.PORT || 3000 , () => {
        console.log(`app is listening on port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log(`got error while conencting to database and app running ${error}`)
    process.exit(1);
})