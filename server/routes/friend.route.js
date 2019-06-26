const express = require("express");
const friendRoutes = express.Router();

const FriendRequest = require("../models/FriendRequest");

friendRoutes.route("/:id/request").post((req, res) => {
  let userId = req.params.id;
  let friendId = req.body.friendId;
  let request = new FriendRequest({
    userId: userId,
    friendId: friendId
  });
  request
    .save()
    .then(request => {
      console.log("Request added to database");
      res.status(200).json({ request: "request is added succesfully" });
    })
    .catch(err => {
      console.log("Unable to add req: \n", err);
      res.status(400).send("unable to save to database");
    });
});

friendRoutes.route("/:id/request").get((req, res) => {
  const id = req.params.id;
  FriendRequest.find({ friendId: id }, (err, requests) => {
    if (err) {
      console.log(err);
    } else {
      res.json(requests);
    }
  });
});

module.exports = friendRoutes;
