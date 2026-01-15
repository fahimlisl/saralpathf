import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const teacherSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    subject: [
      {
        type: String,
        required: true,
        //   lowercase:true
        // enum:["Hifzul Qur'an","Tafseer","Hadith","Arabic Literature","Nahu","Sarf","Islamic History","Sirat","Aqeedah","Fiqh","Faraiz","Bengali","English","Mathematics","Physical Science","Life Science","History","Geography","Environmental Science","Urdu","Dua","Diniyat","Fiqh + U.Fiqh","U.Tafseer","Durusul Lugah","Arabic-I (Minhaj)","Arabic-II (Durusul Lugatil Arabiyyah)","An Nahul Wazeh","Insha","Bakura","Quran Tarjuma","Mantiq","Balagah","Azharul Arab","Hadith + Usule Hadith","Arabic Lt + Insha","Qirat","Majmua","Kalilah wa Dimnah","Qasasun nabiyyen","Taisirul Arabiyyah+Insha","Islamic History","Tajweed"]
        enum: [
          "Hifzul Qur'an 3",
          "Hadith 3",
          "Arabic Literature 3",
          "English 3",
          "Bengali 3",
          "Mathematics 3",
          "Environmental Science 3",
          "Urdu 3",
          "Dua 3",

          // starts 4

          "Hifzul Qur'an 4",
          "Hadith 4",
          "Arabic Literature 4",
          "English 4",
          "Bengali 4",
          "Mathematics 4",
          "Environmental Science 4",
          "Urdu 4",
          "Dua 4",
          "Diniyat 4",
          "Qirat 4",

          // starts 5

          "Hifzul Qur'an 5",
          "Hadith 5",
          "Arabic Literature 5",
          "English 5",
          "Bengali 5",
          "Mathematics 5",
          "Environmental Science 5",
          "Urdu 5",
          "Dua 5",
          "Diniyat 5",
          "Qirat 5",

          // starts 6
          "Hifzul Qur'an 6",
          "Hadith 6",
          "Arabic Literature 6",
          "English 6",
          "Bengali 6",
          "Mathematics 6",
          "Environmental Science 6",
          "Urdu 6",
          "Diniyat 6",
          "Qirat 6",
          "Geography 6",
          "History 6",
          "Sarf 6",
          "Nahu 6",

          // starts 7
          "Hifzul Qur'an 7",
          "Hadith 7",
          "Tafseer 7",
          "Aqeedah 7",
          "English 7",
          "Bengali 7",
          "Mathematics 7",
          "History 7",
          "Environmental Science 7",
          "Qirat 7",
          "Geography 7",

          // stars 71
          "Hifzul Qur'an 71",
          "Hadith 71",
          "Nahu 71",
          "Sarf 71",
          "Sirat 71",
          "Aqeedah 71",
          "English 71",
          "Bengali 71",
          "Mathematics 71",
          "History 71",
          "Environmental Science 71",
          "Durusul Lugah 71",
          "Geography 71",
          "Arabic Lt + Insha 71",

          // stars 8
          "Hifzul Qur'an 8",
          "Hadith 8",
          "Tafseer 8",
          "Aqeedah 8",
          "English 8",
          "Bengali 8",
          "Mathematics 8",
          "History 8",
          "Environmental Science 8",
          "Qirat 8",
          "Geography 8",

          // starts 81 jamiah
          "Hifzul Qur'an 81",
          "Nahu 81",
          "Sarf 81",
          "Sirat 81",
          "Tafseer 81",
          "Aqeedah 81",
          "English 81",
          "Bengali 81",
          "Mathematics 81",
          "History 81",
          "Environmental Science 81",
          "Durusul Lugah 81",
          "Geography 81",
          "Arabic Lt + Insha 81",
          "Hadith + Usule Hadith 81",

          // starts 9
          "Hifzul Qur'an 9",
          "Hadith 9",
          "Tafseer 9",
          "Fiq 9",
          "English 9",
          "Bengali 9",
          "Mathematics 9",
          "History 9",
          "Physical Science 9",
          "Life Science 9",
          "Qirat 9",
          "Geography 9",

          // starts 91

          "Hifzul Qur'an 91",
          "Nahu 91",
          "Sirat 91",
          "Sarf 91",
          "Aqeedah 91",
          "English 91",
          "Bengali 91",
          "Mathematics 91",
          "History 91",
          "Physical Science 91",
          "Life Science 91",
          "Islamic History 91",
          "Geography 91",
          "Arabic Lt + Insha 91",
          "Hadith + Usule Hadith 91",
          "Fiqh + U.Fiqh 91",
          "Durusul Lugah 91",

          // starts rapid

          "Hifzul Qur'an 22",
          "Hadith 22",
          "Nahu 22",
          "Sarf 22",
          "Sirat 22",
          "Aqeedah 22",
          "English 22",
          "Bengali 22",
          "Mathematics 22",
          "History 22",
          "Environmental Science 22",
          "Durusul Lugah 22",
          "Geography 22",
          "Arabic Lt + Insha 22",

          // edadiah - 11 (code)
          "Hifzul Qur'an 11",
          "Hadith 11",
          "Nahu 11",
          "Sarf 11",
          "Sirat 11",
          "Aqeedah 11",
          "Durusul Lugah 11",
          "Dua 11",
          "Qasasun nabiyyen 11",
          "Taisirul Arabiyyah+Insha 11",
          "An Nahul Wazeh 11",

          // edadiah-II 12(code)
          "Hifzul Qur'an 12",
          "Tafseer 12",
          "Hadith 12",
          "Nahu 12",
          "Sarf 12",
          "Sirat 12",
          "Aqeedah 12",
          "Durusul Lugah 12",
          "Islamic History 12",
          "An Nahul Wazeh 12",
          "Quran Tarjuma 12",
          "Taisirul Arabiyyah+Insha 12",
          "Mantiq 12",
          "Balagah 12",
          "Azharul Arab 12",
          "Hadith + Usule Hadith 12",

          // edadiah-III (code)
          "Hifzul Qur'an 13",
          "Tafseer 13",
          "Hadith 13",
          "Nahu 13",
          "Sarf 13",
          "Sirat 13",
          "Aqeedah 13",
          "Fiq 13",
          "Fiq + U.Fiq 13",
          "U.Tafseer 13",
          "Faraiz 13",
          "Islamic History 13",
          "An Nahul Wazeh 13",
          "Insha 13",
          "Balagah 13",
          "Hadith + Usule Hadith 13",

          // hifz-A 15 (code)
          "Hifzul Qur'an 15",
          "Bengali 15",
          "English 15",
          "Mathematics 15",
          "Arabic Literature 15",
          "Tajweed 15",
          "Urdu 15",

        ],
      },
    ],
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  //   next();
});

teacherSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

teacherSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      phoneNumber: this.phoneNumber,
      role: "teacher",
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

teacherSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Teacher = mongoose.model("Teacher", teacherSchema);
