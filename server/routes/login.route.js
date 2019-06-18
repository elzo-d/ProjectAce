const express = require("express");
const fs = require("fs");
const _ = require("lodash");
const loginRoutes = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

loginRoutes.route("/").post((req, res) => {
  console.log("login attempt");

  let name, password;

  if (req.body.name && req.body.password) {
    name = req.body.name;
    password = req.body.password;
  } else {
    res
      .status(400)
      .json({ message: "Username or password not entered correctly" });
    return;
  }
  console.log(`Login attempt with username: ${name}`);

  //!Testaccount
  if (name == "user" && password == "user") {
    console.log("Testaccount logging in");
    let payload = { name, id: 1111 };
    let token = jwt.sign(payload, privateKey, signOptions);
    console.log(`>>> ${token}`);
    res.json({
      message: "ok",
      token: token,
      expiresIn: jwt.decode(token).exp,
      user: "user"
    });
    return;
  }
  //!End Testaccount

  User.findOne({ name: name }, "name password", (err, user) => {
    //Error handling
    if (err) {
      res.status(401).json({ message: "no such user found" });
      return;
    }

    //Password comparison
    bcrypt.compare(password, user.password, function(err, passCorrect) {
      if (passCorrect) {
        let payload = { name, id: user.id };
        let token = jwt.sign(payload, privateKey, signOptions);
        res.json({
          message: "ok",
          token: token,
          expiresIn: jwt.decode(token).exp,
          user: user.name
        });
      } else {
        res.status(401).json({ message: "password did not match" });
      }
    });
  });
});

module.exports = loginRoutes;
