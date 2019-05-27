const express = require("express");
const expressJwt = require("express-jwt");
const fs = require("fs");

const hiddenRoutes = express.Router();

const publicKey = fs.readFileSync("public.pem", "utf8");

const checkIfAuthenticated = expressJwt({
  secret: publicKey
});

hiddenRoutes.route("/").get(checkIfAuthenticated, function(req, res) {
  res.json({ message: "Success! You can not see this without a token" });
});

module.exports = hiddenRoutes;
