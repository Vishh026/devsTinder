const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require("../middlewares/auth.middleware")

profileRouter.get("/getUser", async (req, res) => {
  try {
    const singleUser = await User.findOne({ email: req.body.email });
    if (!singleUser) {
      return res.status(404).send("user not found");
    } else {
      return res.status(201).send(singleUser, "user found successfully");
    }
  } catch (err) {
    return res.status(401).json("server error: " + err.message);
  }
})

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("user not found");
    res.status(201).json({ user: user, message: "cookies etfch suucessfuly" });
  } catch (err) {
    return res.status(401).json("error: " + err.message);
  }
});

module.exports = profileRouter