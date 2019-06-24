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
    console.log(res.json(user))
    res.json(user);

  });
});


userRoutes.route("/update/:id").post(function(req, res) {
  console.log(req.body.password)
  let password = req.body.password;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    console.log(`hash: ${hash}`);
    if (err) {
      res.status(400).send("unable to save password");
      return;
    } else {
      req.body.password = hash;
      console.log(">> password hashed to", hash);
      User.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        {new: true}, 
        (err, user) => {
        console.log(req.body)
        if(!user){
          return console.log("!user")
        }
        if (err) {
          res.status(400).send("Dikke probleem");
          return;
        }
        return res.send(user)
      });
    }
  })

});

userRoutes.route("/delete/:id").get(function(req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function(err, user) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = userRoutes;
