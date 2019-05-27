const express = require("express");
const fs = require("fs");
const _ = require("lodash");
const loginRoutes = express.Router();
const jwt = require("jsonwebtoken");

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

  var user = users[_.findIndex(users, { name: name })];

  if (!user) {
    console.log("user not found");
    res.status(401).json({ message: "no such user found" });
  }

  if (user.password === req.body.password) {
    console.log("password match");
    let payload = { name, id: user.id };
    let token = jwt.sign(payload, privateKey, signOptions);
    console.log(`>>> ${token}`);
    res.json({
      message: "ok",
      token: token,
      expiresIn: jwt.decode(token).exp
    });
  } else {
    console.log("no password match");
    res.status(401).json({ message: "password did not match" });
  }
});

module.exports = loginRoutes;
