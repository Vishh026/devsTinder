const { validateProfileEditData } = require("../utilities/ValidatingData");
const {
  validatePassword,
  hashResetToken,
  hashPassword,
} = require("../models/user.model");
const { userAuth } = require("../middlewares/auth.middleware");
const User = require("../models/user.model");
const crypto  = require('crypto')

const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("user not found");
    res.status(201).json({ user: user, message: "cookies etfch suucessfuly" });
  } catch (err) {
    return res.status(401).json("error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // get loggedinuser
    const loggedInUser = req.user;

    // loop through the updates
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName},Your Profile Updated successfully`,
      user: loggedInUser,
    });
  } catch (error) {
    return res.status(401).send(error.message);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    // get the current user email and pass
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Provide old & new password" });
    }
    if (newPassword) {
    }
    const isValid = await user.validatePassword(oldPassword);
    if (!isValid) {
      return res.status(401).json({ message: "Old password incorrect" });
    }

    user.password = await user.hashPassword(newPassword);

    // 3. Save user
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.send(err.message);
  }
});

profileRouter.post("/profile/forgetPassword", async (req, res) => {
  try {
    // get the email from user
    const { email } = req.body;

    const user = await User.findOne({ email });

    // reset token or generate token => valid for sec only
    const resetToken = await user.hashResetToken();
    console.log(resetToken);
    // validateBrowserSave ==> every time we use user.save(),mongoose validate all fieilds everytime ,so by doing it false it only validate resettoken() and resetExpire() ,other fields validation skipped
    await user.save({ validateBeforeSave: false });

    //send email suing SMTP rules
    const sendResetURL = `http://localhost:7777/profile/resetPassword/${resetToken}`;

    res.status(201).json({
      message: "Password reset Successfully",
      sendResetURL,
    });
  } catch (err) {
    res.status(401).send(`ERR: ${err.message}`);
  }
});

profileRouter.post("/profile/resetPassword/:token", async (req, res) => {
  try {
    const resetToken = req.params.token
    // token hash again => req.params.resettoken
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // find sameuser with expirey and resettoken
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // if found => update and make resettoken expired/undefined
    if (!user) throw new Error("User not found");

    // hash new password => replacing the old pass with new one
    user.password = await user.hashPassword(req.body.newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(201).json("Password updated succesfully");
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = profileRouter;
