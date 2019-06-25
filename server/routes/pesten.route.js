const express = require("express");
const pestenRoutes = express.Router();
const {Pesten, Card, SUITS, MOVE_TYPES, PLAYERS } = require("../games/pesten");

let pestenGames = {}; // indexed on hash

let pestenPlayerCounts = {}; // indexed on hash

let pestenHashes = [];

let pestenMap = {}; // indexed on userId

pestenRoutes.route("/").post((req, res) => {
  console.log("Post for pesten-API - req: " + JSON.stringify(req.body));

  switch(req.body.type) {
    case 0: {
      // starting game
      let hash = getHash();
      pestenGames[hash] = new Pesten();
      pestenHashes.push(hash);
      pestenMap[req.body.userId] = [hash, 0];
      pestenPlayerCounts[hash] = 1;
      console.log("Started new 'pesten'-game, hash: " + hash);
      res.json({
        error: "success",
        data: {
          waiting: true,
          players: 1
        }
      });
      break;
    }
    case 1: {
      // move
      let map = pestenMap[req.body.userId];
      console.log("Did update for 'pesten'-game, hash: " + map[0] + ", user: " + map[1]);
      if(pestenPlayerCounts[map[0]] !== PLAYERS) {
        res.json({
          error: "success",
          data: {
            waiting: true,
            players: pestenPlayerCounts[map[0]]
          }
        });
        return;
      }
      let c = new Card(1, 1);
      c.setFromArray(req.body.card);
      pestenGames[map[0]].doUpdate(req.body.moveType, c, map[1]);
      res.json({
        error: "success",
        data: pestenGames[map[0]].getState(map[1])
      });
      break;
    }
    case 2: {
      // joining game
      let hash = req.body.gameHash;
      pestenMap[req.body.userId] = [hash, pestenPlayerCounts[hash]++];
      console.log("Joined 'pesten'-game, hash: " + hash);
      if(pestenPlayerCounts[hash] === PLAYERS) {
        res.json({
          error: "success",
          data: {
            waiting: true,
            players: PLAYERS
          }
        });
      } else {
        res.json({
          error: "success",
          data: {
            waiting: true,
            players: pestenPlayerCounts[hash]
          }
        });
      }
    }
  }

});

pestenRoutes.route("/list").post((req, res) => {
  console.log("Post for pesten-list API - req: " + JSON.stringify(req.body));
  let ret = [];
  for(let hash of pestenHashes) {
    if(pestenPlayerCounts[hash] < PLAYERS) {
      ret.push({
        game: "Pesten",
        hash: hash,
        players: pestenPlayerCounts[hash]
      });
    }
  }
  res.json({
    error: "success",
    data: {games: ret}
  });
});

function getHash() {
  let num = Math.floor(Math.random() * 0x1000000);
  return ("00000" + num.toString(16)).slice(-6);
}

module.exports = pestenRoutes;
