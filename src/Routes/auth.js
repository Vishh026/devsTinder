const express = require("express");
const User = require("../models/user.model");
const authRouter = express.Router();
const { validatePassword, getJWT } = require("../models/user.model");
const validator = require("validator");
const { validatingSignUpData } = require("../utilities/ValidatingData");
const bcrypt = require("bcrypt");

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check email is valid or not
    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) return res.status(401).send("invalid email");

    // check email present in db or not
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).send("Invalid Crendentials");

    // check password is correct or not => bcrypt.compare()
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // crete the jwt token => jwt.sign()
      const token = await user.getJWT();
      if (!token) return res.send("token not found");
      // sending the cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.status(201).json({
        message: `${user.firstName} Login successfully`,
      });
    } else {
      return res.status(400).send("Invalid Crendentials");
    }
  } catch (error) {
    return res.status(401).send(error.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const user = req.body;

    const { firstName, lastName, password, email, profile, dateOfBirth } = user;

    // validating the user
    const errmsg = validatingSignUpData(req, res);
    if (errmsg) {
      return res.status(400).json({ error: errmsg });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    const newUser = new User({
      firstName,
      lastName,
      dateOfBirth,
      email,
      profile,
      password: hashedPassword,
    });

    // save the user
    await newUser.save();

    return res.status(201).json({ message: "succesfully signup" });
  } catch (error) {
    return res.status(401).send(error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .status(201)
    .send("Logout Successfull");
});

module.exports = authRouter;
