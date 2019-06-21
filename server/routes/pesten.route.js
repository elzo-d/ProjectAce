const express = require("express");
const pestenRoutes = express.Router();

pestenRoutes.route("/").post((req, res) => {
  console.log("Post for pesten-API: req: " + JSON.stringify(req.body));
  res.json({
    error: "success",
    message: "test"
  });
});

module.exports = pestenRoutes;
