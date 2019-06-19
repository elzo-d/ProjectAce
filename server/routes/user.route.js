const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

let User = require("../models/User");

userRoutes.route("/add").post((req, res) => {
  let user = new User(req.body);
  User.findOne({ name: user.name }, "name password", (err, dbUser) => {
    if (dbUser) {
      res.status(400).send("user already exists");
      console.log("duplicate username");
      return;
    } else {
      bcrypt.hash(user.password, saltRounds, (err, hash) => {
        console.log(`hash: ${hash}`);
        if (err) {
          res.status(400).send("unable to save to database");
          return;
        } else {
          user.password = hash;
          console.log(">> password hashed to", hash);
          console.log(`${user}`);

          console.log(`Adding ${user}`);
          user
            .save()
            .then(user => {
              console.log("User is added to database");
              res.status(200).json({ user: "user is added succesfully" });
            })
            .catch(err => {
              console.log("Unable to add user: \n", err);
              res.status(400).send("unable to save to database");
            });
        }
      });
    }
  });
});

userRoutes.route("/").get(function(req, res) {
  User.find(function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

// Defined edit route
userRoutes.route("/edit/:id").get(function(req, res) {
  let id = req.params.id;
  User.findById(id, function(err, user) {
    res.json(user);
  });
});

//  Defined update route
userRoutes.route("/update/:id").post(function(req, res) {
  User.findById(req.params.id, function(err, next, user) {
    if (!user) return next(new Error("Could not load Document"));
    else {
      user.name = req.body.name;
      user.pasword = req.body.password;
      user.email = req.body.email;

      user
        .save()
        .then(user => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

userRoutes.route("/delete/:id").get(function(req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function(err, user) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = userRoutes;
