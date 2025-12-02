const MONGO_URL = "mongodb+srv://vaishnavidhavan026:75FMIQIKVDjfI6Bs@cluster0.kkp7uen.mongodb.net/devTinder"

const mongoose = require("mongoose")

const connectDb = async() => {
    await mongoose.connect(MONGO_URL)
}

module.exports = connectDb