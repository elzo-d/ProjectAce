const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcryptjs");
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
  User.find(null, "name", (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

userRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  User.findOne({ _id: id }, "name", (err, user) => {
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

userRoutes.route("/update/:id").post(function(req, res) {
  let password = req.body.password;
  let currentPassword = req.body.currentPassword;
  if (password == undefined) {
    console.log("No password changed");
    User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, user) => {
        if (!user) {
          return console.log("!user");
        }
        if (err) {
          res.status(400).json("Unable to update user");
          return;
        }
        return res.send(user);
      }
    );
  } else {
    //Password comparison
    User.findById(req.params.id, (err, user) => {
      bcrypt.compare(currentPassword, user.password, function(
        err,
        passCorrect
      ) {
        if (passCorrect) {
          bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
              res.status(400).send("Unable to save password");
              return;
            } else {
              req.body.password = hash;
              User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true },
                (err, user) => {
                  if (!user) {
                    return console.log("!user");
                  }
                  if (err) {
                    res.status(400).send("Unable to update user");
                    return;
                  }
                  return res.send(user);
                }
              );
            }
          });
        } else {
          res.status(401).json({ message: "Password did not match" });
        }
      });
    });
  }
});

userRoutes.route("/delete/:id").get(function(req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function(err, user) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = userRoutes;
