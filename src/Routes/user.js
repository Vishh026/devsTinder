const express = require('express')
const userRouter = express.Router()
const User = require("../models/user.model")

userRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.send(401).json("Users not found");
    } else {
      res.status(201).send(users, "Fetch all users successfully");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
})
userRouter.delete("/deleteuser/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    if (!userid) {
      return res.status(401).send("user id required");
    }
    const deletedUser = await User.findByIdAndDelete(userid);
    if (!deletedUser) {
      return res.status(404).send("user not found");
    }

    res
      .status(201)
      .json({ message: "User deleted successfully", userId: userId });
  } catch (err) {
     return res.status(400).send(`ERR: ${err.message}`);
  }
})
userRouter.patch("/updateUser/:userid",  async (req, res) => {
  const userid = req.params.userid;
  const updates = req.body;
  try {
    const allowed_Updates = ["age", "bio", "skills", "experience"];
    const updatedAllowed = Object.keys(updates).every((k) =>
      allowed_Updates.includes(k)
    );
    if (!updatedAllowed) {
      throw new Error("Updates are not allowed");
    }

    if (updates.skills && updates.skills.length >= 8) {
      throw new Error("only 8 skills you'll abole to add");
    }
    

    const updateduser = await User.findByIdAndUpdate(userid, updates,{
      new:true,
      runValidators: true
    });

    res
      .status(201)
      .json({ message: "user updated successfully", user: updateduser });
  } catch (err) {
    return res.status(400).send(`ERR: ${err.message}`);
  }
})


module.exports = userRouter