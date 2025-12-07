const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate(value){
        if (!validator.isEmail(value)) {
          throw new Error("Invalid E-Mail");
        }
      },
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender can be invalid");
        }
      },
    },
    skills: {
      type: [String],
    },
    bio: {
      type: String,
      default: "write your bio briefly",
      maxlength: 200,
    },
    phone: {
      type: String,
      validate: {
        validator(value) {
          if (!value) return true; // allow empty phone
          return validator.isMobilePhone(value, "en-IN");
        },
        message: "Invalid Indian phone number",
      },
    },
    password: {
      type: String,
      required: true,
      validate(val){
        if (!validator.isStrongPassword(val)) {
          throw new Error("Password is to easy to break");
        }
      },
    },
    experince: {
      type: Number,
      min: 0,
    },
    githubUrl: {
      type: String,
    },
    profile: {
      type: String,
      required: true,
      validate(value){
        if (!validator.isURL(value)) {
          throw new Error("Invalid Url");
        }
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
