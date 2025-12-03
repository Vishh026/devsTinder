const mongoose = require("mongoose");
const validator = require('validator'); 

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required:true,
    trim: true
  },
  email: {
    type: String,
    required:true,
    lowercase:true,
    validate : (value) => {
      if(!validator.isEmail(value)){
        throw new Error("Invalid E-Mail")
      }
    }
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    validate(value){
        if(!["male","female","other"].includes(value)){
            throw new error("Gender can be invalid")
        }
    }
  },
  skills: {
    type: [String],
  },
  bio: {
    type: String,
    default: "write your bio briefly"
  },
  phone: {
    type: Number,
    min:12,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    min: 18,
    validate: (value) => {
      if(!validator.isStrongPassword(value)){
        throw new Error("Password is to easy to break")
      }
    }
  },
  experince: {
    type: Number,
    min: 0
  },
  githubUrl: {
    type: String
  },
  profile: {
    type: String,
    required:true,
    validate: (value) => {
      if(!validator.isURL(value)){
        throw new Error("Invalid Url")
      }
    }
  }
},{timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
