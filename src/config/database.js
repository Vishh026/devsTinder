const { MONGO_URL } = require("../constants")
const mongoose = require("mongoose")

const connectDb = async() => {
    await mongoose.connect(MONGO_URL)
}

module.exports = connectDb