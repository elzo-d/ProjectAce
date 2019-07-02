const express = require("express");
const statsRoutes = express.Router();

let Stats = require("../models/Stats");

statsRoutes.route("/:id").get((req, res) => {
  const id = req.params.id;
  Stats.find({ userId: id }, "game wins draws losses", function(err, stats) {
    if (err) {
      res.status(400).send("Could not find stats for player");
    } else {
      //console.log(req);
      res.status(200).json(stats);
    }
  });
});

statsRoutes.route("/game/:game").get((req, res) => {
  const game = req.params.game;
  Stats.find({ game: game }, "userId game wins draws losses", function(
    err,
    stats
  ) {
    if (err) {
      res.status(400).send("Could not find stats for player");
    } else {
      //console.log(req);
      res.status(200).json(stats);
    }
  });
});

statsRoutes.route("/random/:id").post((req, res) => {
  const id = req.params.id;
  newStats = {
    userId: id,
    game: "dingen",
    wins: Math.floor(Math.random() * 200),
    draws: Math.floor(Math.random() * 200),
    losses: Math.floor(Math.random() * 200)
  };
  let stats = new Stats(newStats);
  stats
    .save()
    .then(stats => {
      res.status(200).json(stats);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

statsRoutes;

module.exports = statsRoutes;
