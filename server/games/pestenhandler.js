
const {Pesten, Card} = require("./pesten");

const {getUsername} = require("../useractions");

class PestenHandler {

  constructor() {
    this.pestenGames = {}; // indexed on hash
    this.pestenHashes = [];
    this.pestenMap = {}; // indexed on userId
  }

  newGame(userId, playerCount, name, cb) {
    if(this.isUserInGame(userId)) {
      cb({error: "user already in game"});
      return;
    }
    let hash = this.getHash();
    this.pestenGames[hash] = new Pesten(playerCount, name);
    this.pestenHashes.push(hash);
    console.log("Created pesten game");
    this.joinGame(hash, userId, cb);
  }

  joinGame(hash, userId, cb) {
    if(this.isUserInGame(userId)) {
      cb({error: "user already in game"});
      return;
    }

    let players = this.pestenGames[hash].players;
    if(this.pestenGames[hash].joinedUsers.length === players) {
      cb({error: "game is full"});
      return;
    }

    getUsername(userId, name => {
      this.pestenMap[userId] = [hash, this.pestenGames[hash].joinedUsers.length];
      this.pestenGames[hash].joinedUsers.push(name);
      cb({
        error: "success",
        data: {
          waiting: true,
          players: players,
          joinedUsers: this.pestenGames[hash].joinedUsers
        }
      });
    });
  }

  doMove(userId, card, moveType, cb) {
    if(!this.isUserInGame(userId)) {
      cb({error: "user not in game"});
      return;
    }
    let map = this.pestenMap[userId];
    let players = this.pestenGames[map[0]].players;
    if(this.pestenGames[map[0]].joinedUsers.length !== players) {
      cb({
        error: "success",
        data: {
          waiting: true,
          players: players,
          joinedUsers: this.pestenGames[map[0]].joinedUsers
        }
      });
      return;
    }
    let c = new Card(1, 1);
    c.setFromArray(card);
    this.pestenGames[map[0]].doUpdate(moveType, c, map[1]);
    cb({
      error: "success",
      data: this.pestenGames[map[0]].getState(map[1])
    });
  }

  leaveGame(userId, cb) {
    if(!this.isUserInGame(userId)) {
      cb({error: "user not in game"});
      return;
    }
    let map = this.pestenMap[userId];
    this.pestenMap[userId] = undefined;
    this.pestenGames[map[0]].leftPlayers++;
    let players = this.pestenGames[map[0]].players;
    if(this.pestenGames[map[0]].leftPlayers === players) {
      this.pestenGames[map[0]] = undefined;
      this.removeHash(map[0]);
      console.log("Removed pesten gane, all players finished");
    }
    cb({
      error: "success",
      data: {}
    });
  }

  getHash() {
    let num = Math.floor(Math.random() * 0x1000000);
    return ("00000" + num.toString(16)).slice(-6);
  }

  removeHash(hash) {
    let i;
    for(i = 0; i < this.pestenHashes.length; i++) {
      if(this.pestenHashes[i] === hash) {
        break;
      }
    }
    if(i < this.pestenHashes.length) {
      this.pestenHashes.splice(i, 1);
    }
  }

  isUserInGame(userId) {
    if(this.pestenMap[userId] !== undefined) {
      return true;
    }
    return false;
  }

  getList() {
    let result = [];
    for(let hash of this.pestenHashes) {
      let players = this.pestenGames[hash].players;
      if(this.pestenGames[hash].joinedUsers.length < players) {
        result.push({
          game: "Pesten",
          hash: hash,
          name: this.pestenGames[hash].name,
          players: players,
          joined: this.pestenGames[hash].joinedUsers.length
        });
      }
    }
    return result;
  }
}

module.exports = {PestenHandler: PestenHandler}
