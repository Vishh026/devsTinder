const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
         type: String,
    },
    lastName: {
         type: String,
    },
    email: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
    },
    interests: {
        type: [String],
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User;