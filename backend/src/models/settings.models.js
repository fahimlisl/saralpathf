import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    onlineAdmission:{
        type:Boolean,
        default:true
    },
},
{
    timestamps:false
})


export const Settings = mongoose.model("Settings",settingsSchema)