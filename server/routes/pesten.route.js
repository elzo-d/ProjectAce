const express = require("express");
const pestenRoutes = express.Router();
const {Pesten, Card, SUITS, MOVE_TYPES, PLAYERS } = require("../games/pesten");

let User = require("../models/User");

let pestenGames = {}; // indexed on hash

let pestenHashes = [];

let pestenMap = {}; // indexed on userId

pestenRoutes.route("/").post((req, res) => {
  console.log("Post for pesten-API - req: " + JSON.stringify(req.body));

  switch(req.body.type) {
    case 0: {
      // starting game
      if(checkIfInGame(req.body.userId)) {
        res.json({
          error: "already in game"
        });
        return;
      }
      let hash = getHash();
      pestenGames[hash] = new Pesten();
      pestenHashes.push(hash);
      console.log("Started new 'pesten'-game, hash: " + hash);
      joinGame(hash, req.body.userId, res);
      break;
    }
    case 1: {
      // move
      let map = pestenMap[req.body.userId];
      if(map === undefined) {
        res.json({
          error: "not in a game"
        });
        return;
      }
      console.log("Did update for 'pesten'-game, hash: " + map[0] + ", user: " + map[1]);
      if(pestenGames[map[0]].joinedUsers.length !== PLAYERS) {
        res.json({
          error: "success",
          data: {
            waiting: true,
            players: pestenGames[map[0]].joinedUsers.length,
            joinedUsers: pestenGames[map[0]].joinedUsers
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
      if(checkIfInGame(req.body.userId)) {
        res.json({
          error: "already in game"
        });
        return;
      }
      joinGame(req.body.gameHash, req.body.userId, res);
      break;
    }
    case 3: {
      // leaving game, called when done
      let map = pestenMap[req.body.userId];
      if(map === undefined) {
        res.json({
          error: "not in a game"
        });
        return;
      }
      pestenMap[req.body.userId] = undefined;
      pestenGames[map[0]].leftPlayers++;
      console.log("Removed user from 'pesten'-game - hash: " + map[0] + ", user: " + map[1]);
      if(pestenGames[map[0]].leftPlayers === PLAYERS) {
        console.log("'Pesten'-game has all users finished, removing. - hash: " + map[0]);
        pestenGames[map[0]] = undefined;
        removeHash(map[0]);
      }
      res.json({
        error: "success",
        data: {}
      });
      break;
    }
  }

});

function removeHash(hash) {
  let i;
  for(i = 0; i < pestenHashes.length; i++) {
    if(pestenHashes[i] === hash) {
      break;
    }
  }
  if(i < pestenHashes.length) {
    pestenHashes.splice(i, 1);
  }
}

function joinGame(hash, userId, res) {
  pestenMap[userId] = [hash, pestenGames[hash].joinedUsers.length];
  console.log("Joined 'pesten'-game, hash: " + hash);

  User.findById(userId, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      let name = user.name;
      pestenGames[hash].joinedUsers.push(name);
      console.log("Added user to 'pesten'-game - name: " + name);
      res.json({
        error: "success",
        data: {
          waiting: true,
          players: pestenGames[hash].joinedUsers.length,
          joinedUsers: pestenGames[hash].joinedUsers
        }
      });
    }
  });

}

pestenRoutes.route("/list").post((req, res) => {
  console.log("Post for pesten-list API - req: " + JSON.stringify(req.body));
  let ret = [];
  for(let hash of pestenHashes) {
    if(pestenGames[hash].joinedUsers.length < PLAYERS) {
      ret.push({
        game: "Pesten",
        hash: hash,
        players: pestenGames[hash].joinedUsers.length
      });
    }
  }
  res.json({
    error: "success",
    data: {games: ret, inGame: checkIfInGame(req.body.userId)}
  });
});

function checkIfInGame(userId) {
  if(pestenMap[userId] !== undefined) {
    return true;
  }
  return false;
}

function getHash() {
  let num = Math.floor(Math.random() * 0x1000000);
  return ("00000" + num.toString(16)).slice(-6);
}

module.exports = pestenRoutes;
