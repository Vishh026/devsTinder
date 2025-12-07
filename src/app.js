const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const { validatingSignUpData } = require("./utilities/ValidatingData");
const app = express();

app.use(express.json());

app.patch("/updateUser/:userid", async (req, res) => {
  const userid = req.params.userid;
  const data = req.body;
  try {
    const allowed_Updates = ["age", "bio", "skills", "experience"];
    const updatedAllowed = Object.keys(data).every((k) =>
      allowed_Updates.includes(k)
    );
    if (!updatedAllowed) {
      throw new Error("Updates are not allowed");
    }

    if (data.skills && data.skills.length >= 8) {
      throw new Error("only 8 skills you'll abole to add");
    }

    const updateduser = await User.findByIdAndUpdate(userid, data, {
      new: true,
    });
    res
      .status(201)
      .json({ message: "user updated successfully", user: updateduser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/deleteuser/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    if(!userid){
      return res.status(401).send("user id required")
    }
    const deletedUser  = await User.findByIdAndDelete(userid)
    if(!deletedUser){
      return res.status(404).send("user not found")
    }

    res.status(201).json({message: "User deleted successfully",userId: userId});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/signup", async (req, res) => {
  try {
    const {firstName,lastName,password,email,profile,dateOfBirth} = req.body;

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

    return res.status(201).json({message: "succesfully signup"});
  } catch (error) {
    return res.status(401).send(error.message);
  }
});

app.get("/feed", async (req, res) => {
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
});

app.get("/getUser", async (req, res) => {
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
});

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
