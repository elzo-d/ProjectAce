const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let StatsSchema = new Schema({
  game: {
    type: String
  },
  wins: {
    type: Number
  },
  losses: {
    type: Number
  }
});

// Define collection and schema for Business
let UserSchema = new Schema(
  {
    name: {
      type: String
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    stats: [{ type: StatsSchema }]
  },
  {
    collection: "user"
  }
);

module.exports = mongoose.model("User", UserSchema);
