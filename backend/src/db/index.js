import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"
const connectDB = async () => {
    try {
        const connection = mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`mongodb connection successful`)
    } catch (error) {
        console.log(`got error while connecting to datbase ${error}`)
        process.exit(1)
    }
}

export {connectDB}