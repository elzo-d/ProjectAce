const express = require("express");
const friendRoutes = express.Router();

const User = require("../models/User");

friendRoutes.route("/:id/request").post((req, res) => {
  let senderId = req.params.id;
  let receiverId = req.body.friendId;

  let error = false,
    a = false,
    b = false;
  // Add request to sender's table
  User.findOne({ _id: senderId }, (err, user) => {
    if (err) {
      a = true;
      error = true;

      if (!b) {
        res.status(404).json("user not found");
      }
    }

    let friendsList = user.friends;
    if (friendsList.includes(receiverId)) {
      err = true;
    } else {
      let currentList = user.sentRequests;
      if (!currentList.includes(receiverId)) {
        user.sentRequests.push(receiverId);
        user.save();
      } else {
        console.log("user already requested");
      }
    }

    if (a && b) {
      if (error) {
        res.status(400).json("error");
      } else {
        res.status(200).json("ok");
      }
    }
  });

  User.findOne({ _id: receiverId }, (err, user) => {
    if (err) {
      b = true;
      error = true;

      if (!a) {
        res.status(404).json("user not found");
      }
    }

    let friendsList = user.friends;
    if (friendsList.includes(senderId)) {
      err = true;
    } else {
      let currentList = user.receivedRequests;
      if (!currentList.includes(senderId)) {
        user.receivedRequests.push(senderId);
        user.save();
      } else {
        console.log("user already has request from the requester");
      }
    }

    if (a && b) {
      if (error) {
        res.status(400).json("error");
      } else {
        res.status(200).json("ok");
      }
    }
  });

  res.status(200).json("request handled");
});

friendRoutes.route("/:id/request").get((req, res) => {
  const id = req.params.id;
  User.findById(id, "receivedRequests", (err, user) => {
    if (err) {
      res.status(400).json(err);
    }
    res.status(200).json(user.receivedRequests);
  });
});

friendRoutes.route("/:id/request/accept").post((req, res) => {
  receiverId = req.params.id;
  senderId = req.body.userId;

  let err = false,
    a = false,
    b = false;

  User.findById(receiverId, (err, user) => {
    let receivedRequests = user.receivedRequests;
    if (receivedRequests.includes(senderId)) {
      user.friends.push(senderId);
      user.receivedRequests.pull(senderId);
      user.save();
    } else {
      err = true;
    }
    a = true;

    if (a && b) {
      if (err) {
        res.status(400).json("error");
      } else {
        res.status(200).json("ok");
      }
    }
  });

  User.findById(senderId, (err, user) => {
    let sentRequests = user.sentRequests;
    if (sentRequests.includes(receiverId)) {
      user.friends.push(receiverId);
      user.sentRequests.pull(receiverId);
      user.save();
    } else {
      err = true;
    }
    b = true;

    if (a && b) {
      if (err) {
        res.status(400).json("error");
      } else {
        res.status(200).json("ok");
      }
    }
  });
});

friendRoutes.route("/:id/request/decline").post((req, res) => {
  receiverId = req.params.id;
  senderId = req.body.userId;

  let err = false,
    a = false,
    b = false;

  User.findById(receiverId, (err, user) => {
    let receivedRequests = user.receivedRequests;
    if (receivedRequests.includes(senderId)) {
      user.receivedRequests.pull(senderId);
      user.save();
    } else {
      err = true;
    }
    a = true;

    if (a && b) {
      if (err) {
        res.status(400).json("error");
      } else {
        res.status(200).json("ok");
      }
    }
  });

  User.findById(senderId, (err, user) => {
    let sentRequests = user.sentRequests;
    if (sentRequests.includes(receiverId)) {
      user.sentRequests.pull(senderId);
      user.save();
    } else {
      err = true;
    }
    b = true;

    if (a && b) {
      if (err) {
        res.status(400).json("error");
      } else {
        res.status(200).json("ok");
      }
    }
  });
});

friendRoutes.route("/:id").get((req, res) => {
  let userId = req.params.id;

  User.findById(userId, "friends", (err, user) => {
    if (err) {
      res.status(404).json("could not find user");
    } else {
      res.status(200).json(user.friends);
    }
  });
});

module.exports = friendRoutes;
