const express = require("express");
const fs = require("fs");
const _ = require("lodash");
const loginRoutes = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

let User = require("../models/User");

const signOptions = {
  expiresIn: "30d",
  algorithm: "ES256"
};

const privateKey = fs.readFileSync("private.pem", "utf8");

loginRoutes.route("/").post((req, res) => {
  let name, password;

  if (req.body.name && req.body.password) {
    name = req.body.name;
    password = req.body.password;
  } else {
    res
      .status(400)
      .json({ message: "request did not contain username and password" });
    return;
  }

  User.findOne({ name: name }, "name password id email", (err, user) => {
    //Error handling
    if (err || !user) {
      res.status(401).json({ message: `no user found with username ${name}` });
      return;
    }

    //Password comparison
    bcrypt.compare(password, user.password, function(err, passCorrect) {
      if (passCorrect) {
        console.log(`User logged in: ${name}`);
        let payload = { name: user.name, id: user.id, email: user.email };
        let token = jwt.sign(payload, privateKey, signOptions);
        console.log(payload)
        res.json({
          message: "ok",
          token: token,
          expiresIn: jwt.decode(token).exp,
          user: user.name,
          email: user.email,
          id: user.id
        });
      } else {
        res.status(401).json({ message: "password did not match" });
      }
    });
  });
});

module.exports = loginRoutes;
