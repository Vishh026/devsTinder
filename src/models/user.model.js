const mongoose = require("mongoose");

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
    min: 18
  },
  experince: {
    type: Number,
    min: 0
  },
  githubUrl: {
    type: String
  },
},{timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
