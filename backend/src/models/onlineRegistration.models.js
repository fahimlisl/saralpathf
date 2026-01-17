import mongoose from "mongoose";

const onlineRegistrationSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        // will be required as per requiremets 
    },
    phoneNumber:{
        type:Number,
        required:true
        // will be unique as ture , as per the futher requirements
    },
    address:{
        type:String,
        required:true
    },
    birthDate:{
        type:Date,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    application_Id:{
        type:Number,
        required:true
    },
    brithCertificate:{
        type:String,
        required:true
    },
    desiredClass:{
        type:Number
    },
    typeOfClass:{
        type:String,
        enum:["Jamiah","Hifz-A","Hifz-B","Hifz-C","Hifz-D","Edadiah-I","Edadiah-II","Edadiah-III",""]
    } // AT LEAST TYPEOF CLASS OR DESIRED CLASS ONE OF THE FIELDS REQUIRED ALSO A FEW CHECKPOINTS WILL BE DONE IN FORNTEND , GUESSING MOST PROBABLY
},{timestamps:true})


// will be deleted docemts after a time interval 

export const OnlineRegistration = mongoose.model("OnlineRegistration",onlineRegistrationSchema)