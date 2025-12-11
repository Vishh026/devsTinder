const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");


const userAuth = async (req, res, next) => {
  try {
    // read the token from req.cookies
    const { token } = req.cookies;
    if (!token) return res.status(401).send("token not valid");

    // validate the token
    const { _id } = await jwt.verify(token, "devtindersercrete");

    // get the user
    const user = await userModel.findById(_id);
    if (!user) throw new Error("user not found");

    req.user = user;

    next();
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  userAuth,
};
