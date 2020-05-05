const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserInterestModel = new Schema(
  {
    interest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
    },
    value: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const UserInterest = mongoose.model("UserInterest", UserInterestModel);

module.exports = UserInterest;
