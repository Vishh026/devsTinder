const MONGO_URL = "mongodb+srv://radhey-026:3kTsjwK0FnVmzTIx@namstenode.mvehoz5.mongodb.net/devTinder"

const mongoose = require("mongoose")

const connectDb = async() => {
    await mongoose.connect(MONGO_URL)
}

module.exports = connectDb