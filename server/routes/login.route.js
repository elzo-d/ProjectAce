const express = require("express");
const fs = require("fs");
const _ = require("lodash");
const loginRoutes = express.Router();
const jwt = require("jsonwebtoken");
let User = require("../models/User");

const users = [
  { id: 1, name: "bart", password: "henker" },
  { id: 2, name: "test", password: "test" },
  { id: 3, name: "user", password: "user" },
  { id: 4, name: "Thom", password: "Thom123" }
];

const signOptions = {
  expiresIn: "30d",
  algorithm: "ES256"
};

const privateKey = fs.readFileSync("private.pem", "utf8");

loginRoutes.route("/").post(function(req, res) {
  console.log("login attempt");
  if (req.body.name && req.body.password) {
    var name = req.body.name;
  }
  console.log(`Login attempt with username: ${name}`);

  User.findOne({ name: name }, "name password", (err, user) => {
    //Handle error
    if (err) {
      res.status(401).json({ message: "no such user found" });
      return;
    }

    console.log(user);

    if (user && user.password === req.body.password) {
      console.log("password match");
      let payload = { name, id: user.id };
      let token = jwt.sign(payload, privateKey, signOptions);
      console.log(`>>> ${token}`);
      res.json({
        message: "ok",
        token: token,
        expiresIn: jwt.decode(token).exp,
        user: user.name
      });
    } else {
      console.log("no password match");
      res.status(401).json({ message: "password did not match" });
    }
  });

  // var user = users[_.findIndex(users, { name: name })];

  // if (!user) {
  //   console.log("user not found");
  //   res.status(401).json({ message: "no such user found" });
  //   return;
  // }
});

module.exports = loginRoutes;
