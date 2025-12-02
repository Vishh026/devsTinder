const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
         type: String,
        required: true,
    },
    lastName: {
         type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    interests: {
        type: [String],
        required: true,
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User;