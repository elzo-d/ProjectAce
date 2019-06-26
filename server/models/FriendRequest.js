const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User").schema;

// Define collection and schema for Business
let FriendRequest = new Schema(
  {
    userId: {
      type: String
    },
    friendId: {
      type: String
    }
  },
  {
    collection: "friendrequest"
  }
);

module.exports = mongoose.model("FriendRequest", FriendRequest);
