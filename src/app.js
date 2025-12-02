const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user.model");

const app = express();

app.use(express.json())
app.post("/signup",async(req,res)=> {

   try {
    const newUser = new User(req.body)

    await newUser.save()

   res.status(201).send("succesfully signup")
   } catch (error) {
    res.status(401).send(error.message)
   }


})


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
