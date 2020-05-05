const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const interestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ["Active", "Pending", "Deprecated"],
    },
    description: {
      type: String,
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

const Interest = mongoose.model("Interest", interestSchema);

module.exports = Interest;
