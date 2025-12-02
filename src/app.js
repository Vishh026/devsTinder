const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user.model");

const app = express();


// app.use("/user1",[rh1,rh2,rh3],rh4,rh5)

app.get("/user",(req,res,next) => {
    console.log("User route working fine");
    // res.status(200).json({
    //     message: "response 1"
    // })
    next()
},
[(req,res,next)=> {
    console.log("User route working fine 2");
    res.status(200).json({
        message: "response 2"
    })
    next()
},
(req,res) => {
    console.log("User route working fine 3");
    res.status(200).json({
        message: "response 3"
    })
    next()
}]
)





app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "vaishnavi",
    lastName: "dhavan",
    email: "vaish@gmail.com",
    dateOfBirth: "2004-04-26",
    gender: "female",
    interests: ["alone", "sports"],
    bio: "Hello! I am Rahul, a music and sports enthusiast.",
    password: "securepassword123",
  };
  try {
    // saving instance of obj in model
    const updatedUser = new User(userObj);

    // Saving data in db
    await updatedUser.save();

    res.status(201).json({
      message: "User created successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json("Error in creating user", err);
  }
});

app.get("/login", (Req, res) => {
  res.status(200).json({
    message: "Login route working fine",
  });
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
