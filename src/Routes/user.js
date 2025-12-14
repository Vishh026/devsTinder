const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.middleware");
const connectionRequestModel = require("../models/connectionRequest.model");

const SAFE_DATA_PARAMETERS = "firstName lastName";

// ================= PENDING REQUESTS =================
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

// ================= ACCEPTED CONNECTIONS =================
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

    const otherPersonsData = connectionRequests.map(raw => {
      const fromId = raw.fromUserId._id.toString();

      return fromId === loggedInUserId
        ? raw.toUserId
        : raw.fromUserId;
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      data: otherPersonsData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
