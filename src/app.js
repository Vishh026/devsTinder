const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user.model");

const app = express();

app.use(express.json());

app.patch("/updateUser/:userid", async (req, res) => {
  const userid = req.params.userid;
  const data = req.body;
  try {
    const allowed_Updates = [ "age", "bio", "skills", "experience"];
    const updatedAllowed = Object.keys(data).every((k) =>
      allowed_Updates.includes(k)
    );
    if (!updatedAllowed) {
      throw new error("Updates are not allowed")
    }

    if(data?.skills.length >= 8){
      throw new Error("only 8 skills you'll abole to add")
    }

    const updateduser = await User.findByIdAndUpdate(userid, data, {
      returnDocument: "after",
    });
    res.status(201).json(updateduser, "user updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/deleteuser", async (req, res) => {
  try {
    const userid = req.body.userId;
    await User.findByIdAndDelete(userid);

    res.status(201).send("user deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);

    await newUser.save();

    res.status(201).send("succesfully signup");
  } catch (error) {
    res.status(401).send(error.message);
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
      res.status(404).send("user not found");
    } else {
      res.status(201).send(singleUser, "user found successfully");
    }
  } catch (err) {
    res.send(401, "server error");
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
