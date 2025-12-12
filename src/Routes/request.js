const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware");
const connectionRequestModel = require("../models/connectionRequest.model");
const userModel = require("../models/user.model");

requestRouter.post("/request/:status/:userid", userAuth, async (req, res) => {
  try {
    // get the data
    const status = req.params.status;
    const fromUserId = req.user._id;
    const toUserId = req.params.userid;


    // VALIDATIONS
    const allowedTypeStatus = ["interested","ignored"]
    if(!allowedTypeStatus.includes(status)) throw new Error("Invalid Status type")

    const toUserIdExists = await userModel.findById(toUserId);
    if (!toUserIdExists) {
      throw new Error("User not found");
    }

    // if once a send req to b again  a unable to send req to b nad same for b => a
    const existingConnection = connectionRequestModel.findOne({
        $or : [
            {toUserId,fromUserId},
            {toUserId: fromUserId, fromUserId:toUserId}
        ]
    })
    if(existingConnection){
        throw new Error(`alredy sends connection`)
    }
    // create the struction to save in db
    const connectionRequests = new connectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    // save to db
    const data = await connectionRequests.save();
    
    res.status(200).json({ message: "sends connection request!!", data });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = requestRouter;
