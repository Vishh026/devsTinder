const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware");
const connectionRequestModel = require("../models/connectionRequest.model");
const User = require("../models/user.model");
const SAFE_DATA_PARAMETERS = "firstName lastName";

userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequest = await connectionRequestModel
      .find({
        toUserId: loggedInUserId,
        status: "interested",
      })
      .populate("fromUserId", SAFE_DATA_PARAMETERS);

    if (connectionRequest.length === 0) {
      return res.status(200).json({
        message: "No pending requests",
        data: [],
      });
    }

    res.status(200).json({
      message: "Pending requests fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();

    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          { fromUserId: req.user._id, status: "accepted" },
          { toUserId: req.user._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", SAFE_DATA_PARAMETERS)
      .populate("toUserId", SAFE_DATA_PARAMETERS);

    const otherPersonsData = connectionRequests.map((raw) => {
      const fromId = raw.fromUserId._id.toString();

      return fromId === loggedInUserId ? raw.toUserId : raw.fromUserId;
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      data: otherPersonsData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit >50 ? 50 : limit

    const skip = (page - 1) * limit;

    // Find all request (send + received) => we don't want this requests
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [
          { fromUserId: loggedInUser._id }, 
          { toUserId: loggedInUser._id }
        ],
      })
      .select("fromUserId toUserId status");

    const hiddenRequestFromFeed = new Set();
    connectionRequest.forEach((request) => {
      hiddenRequestFromFeed.add(request.fromUserId.toString());
      hiddenRequestFromFeed.add(request.toUserId.toString());
    });

    // Reverse query => not ftech this id's came from hiddenrequest
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenRequestFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_DATA_PARAMETERS)
      .skip(skip)
      .limit(limit);

    return res
      .status(201)
      .json({ message: "Fetch connections Successfully", users });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

module.exports = userRouter;
