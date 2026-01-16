import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const studnetSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    classCurrent: {
      type: Number,
      // required:true
    },
    typeOfClass: {
      type: String,
      enum: [
        "Jamiah",
        "Hifz-A",
        "Hifz-B",
        "Hifz-C",
        "Hifz-D",
        "Edadiah-I",
        "Edadiah-II",
        "Edadiah-III",
        "Rapid",
        "",
      ],
    },
    marksheet: {
      type: Schema.Types.ObjectId,
      ref: "Marksheet",
    },
    section: {
      type: String,
    },
    gurdianName: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      // will be given via dob
    },
    fees: {
      jan: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      feb: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      march: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      april: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      may: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      jun: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      july: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      august: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      september: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      october: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      november: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      december: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },

      // extra fees
      admissionFee: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      examinationFee: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      developmentFee: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      miscellaneousFee: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      adittionalFees: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      lateFee: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      dressFee: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
      booksFee: {
        amount: { type: Number, default: 0 },
        isPaid: { type: Boolean, default: false },
      },
    },

    // not giving profile photo as of now , for normal student
  },
  { timestamps: true }
);

studnetSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  //   next();
});

studnetSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studnetSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: "student",
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

studnetSchema.methods.generateRefreshToken = function () {
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

export const Student = mongoose.model("Student", studnetSchema);
