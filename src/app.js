const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/user");
const profileRouter = require("./Routes/profile");
const authRouter = require("./Routes/auth");
const requestRouter = require("./Routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/",userRouter)
app.use("/",profileRouter)
app.use("/",authRouter)
app.use("/",requestRouter)

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
