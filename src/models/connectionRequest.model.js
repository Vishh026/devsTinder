const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored"],
        message: `{VALUE} is not valid type of status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  // validated the sender or receiver same ,if same throw an error
  const connectionRequest = this;
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You can't send connection request to yourself");
  }
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

const connectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequestModel;
