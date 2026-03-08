const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
  comment: {
    type: String,
    required: [true, "Comment cannot be empty"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Rating is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Review", reviewsSchema);
