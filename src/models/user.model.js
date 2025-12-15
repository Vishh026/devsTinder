const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto')

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
      unique:true,
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
      unique:true,
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
    experience: {
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
    resetPasswordToken: {
      type:String
    },
    resetPasswordExpires: {
      type: Date
    }

  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function(){
  
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRETE_KEY, {
        expiresIn: "7d",
      });

    return token;
}

userSchema.methods.validatePassword = async function(userInputPassword){
  
  const isCheckPassword = await bcrypt.compare(userInputPassword, this.password)

  return isCheckPassword
}

userSchema.methods.hashPassword = async function(userPassword){
  const passwordHash = await bcrypt.hash(userPassword, 10);

  return passwordHash
}

userSchema.methods.hashResetToken = async function(){
  // genrate token
  const resetToken = crypto.randomBytes(20).toString("hex")
  // hash the token before saving
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  // expires in 10 min
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000
  // returns token 

  return resetToken
}
userSchema.index({ firstName : 1})

const User = mongoose.model("User", userSchema);

module.exports = User;
