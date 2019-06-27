const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Stats = new Schema(
  {
    game: {
      type: String
    },
    userId: {
      type: String
    },
    wins: {
      type: Number
    },
    draws: {
      type: Number
    },
    losses: {
      type: Number
    }
  },
  {
    collection: "stats"
  }
);

module.exports = mongoose.model("Stats", Stats);
