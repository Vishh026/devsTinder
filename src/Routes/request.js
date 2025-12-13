const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware");
const connectionRequestModel = require("../models/connectionRequest.model");
const User = require("../models/user.model");

requestRouter.post(
  "/request/send/:status/:userid",
  userAuth,
  async (req, res) => {
    try {
      // get the data
      const status = req.params.status;
      const fromUserId = req.user._id;
      const toUserId = req.params.userid;

      // VALIDATIONS
      const allowedTypeStatus = ["interested", "ignored"];
      if (!allowedTypeStatus.includes(status))
        throw new Error("Invalid Status type");

      // if once a send req to b again  a unable to send req to b nad same for b => a
      const existingConnection = await connectionRequestModel.findOne({
        $or: [
          { toUserId, fromUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });
      if (existingConnection) {
        throw new Error("Already sent connection request");
      }
      const toUser = await User.findById(toUserId).select("firstName lastName")
      if (!toUser) {
        throw new Error("User not found");
      }
      // create the struction to save in db
      const connectionRequests = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      })
      // save to db
      const data = await connectionRequests.save();

      res.status(200).json({ message: `${req.user.firstName} ${status} connection to ${toUser.firstName}`, data });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:reqId",
  userAuth,
  async (req, res) => {
    try {
      // req => accepted,rejected
      const loggedInUser = req.user;
      const { status, reqId } = req.params;

      const allowedTypeStatus = ["accepted", "rejected"];
      if (!allowedTypeStatus.includes(status))
        throw new Error("Invalid status type");

      const connectionRequest = await connectionRequestModel.findOne({
        _id: reqId,
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId","firstName lastName").populate("toUserId","firstName lastName")


      if (!connectionRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (connectionRequest.status !== "interested") {
        return res.status(400).json({ message: "Request already reviewed" });
      }

      // update status interested  => accepted
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).send({
        message: `${loggedInUser.firstName} ${status} ${connectionRequest.fromUserId.firstName}'s request.`,
        data,
      });
    } catch (err) {
      res.status(401).send(err.message);
    }
  }
);

module.exports = requestRouter;
