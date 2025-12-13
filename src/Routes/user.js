const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.model");
const { userAuth } = require("../middlewares/auth.middleware");
const connectionRequestModel = require("../models/connectionRequest.model");
// pending all requeest = pending

userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if(!loggedInUser || !loggedInUser._id){
        return res.status(401).send("Unauthorized user")
    }

    const connectionRequest = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");
    console.log(connectionRequest);
    if (connectionRequest.length === 0) {
      throw new Error("No request exists");
    }

    res.status(201).json({
      message: "fetch all pending request successfully",
      connectionRequest,
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});



//  => get the loggedinuser
//  => find =>  1.ttouserID === loggedinuser  2.status= "interested"
//  => we get all data but we got id's => for showing data in the frontend what we need
//     => all user's data ?? how to fetch the data ??
//         1) findeach user and get teh data from database  (poor way)
//         2) fromUserId : { ref : 'UseraModel'},
//             .populate("fromUserId" ,["firstname lastname age gender"])

// get all connection => (1:1)
//  => get the logginuser
//  => findout  => fromuserid and touserid (accepted) => or  => populate
// [removing id,update at and other stuff ] map on fromuserid info which is taken from the populate

module.exports = userRouter;
