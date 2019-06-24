const express = require("express");
const pestenRoutes = express.Router();
const {Pesten, Card, SUITS, MOVE_TYPES} = require("../games/pesten");

let pesten;

pestenRoutes.route("/").post((req, res) => {
  console.log("Post for pesten-API: req: " + JSON.stringify(req.body));

  switch(req.body.type) {
    case 0: {
      // starting game
      pesten = new Pesten();
      console.log("Started new 'pesten'-game");
      res.json({
        error: "success",
        data: pesten.getState(req.body.user)
      })
      break;
    }
    case 1: {
      // move
      let c = new Card(1, 1);
      c.setFromArray(req.body.card);
      pesten.doUpdate(req.body.moveType, c, req.body.user);
      console.log("Did update for 'pesten'-game");
      res.json({
        error: "success",
        data: pesten.getState(req.body.user)
      });
      break;
    }
  }

});

module.exports = pestenRoutes;
