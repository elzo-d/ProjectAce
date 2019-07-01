const express = require("express");
const gameRoutes = express.Router();
const {PestenHandler} = require("../games/pestenhandler");

let User = require("../models/User");

let pestenHandler = new PestenHandler();

gameRoutes.route("/pesten").post((req, res) => {
  // console.log("Post for pesten-API - req: " + JSON.stringify(req.body));

  switch(req.body.type) {
    case 0: {
      // starting game
      pestenHandler.newGame(req.body.userId, +req.body.players, req.body.name, e => res.json(e));
      break;
    }
    case 1: {
      // move
      pestenHandler.doMove(req.body.userId, req.body.card, req.body.moveType, e => res.json(e));
      break;
    }
    case 2: {
      // joining game
      pestenHandler.joinGame(req.body.gameHash, req.body.userId, e => res.json(e));
      break;
    }
    case 3: {
      // leaving game, called when done
      pestenHandler.leaveGame(req.body.userId, e => res.json(e));
      break;
    }
    default: {
      // unknown command
      res.json({error: "unknown command type"});
      break;
    }
  }
});

gameRoutes.route("/list").post((req, res) => {
  // console.log("Post for game-list API - req: " + JSON.stringify(req.body));
  // get the list for each game and combine them
  let ret = pestenHandler.getList();
  let games = findInWhichGame(req.body.userId);
  res.json({
    error: "success",
    data: {games: ret, inGames: games}
  });
});

function findInWhichGame(userId) {
  // go through all games to find the game we might be in
  let ret = [];
  if(pestenHandler.isUserInGame(userId)) {
    ret.push("Pesten");
  }
  return ret;

}

module.exports = gameRoutes;
