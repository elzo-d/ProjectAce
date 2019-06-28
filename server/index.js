const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./DB");
const bodyParser = require("body-parser");
const webpush = require('web-push');

const loginRoute = require("./routes/login.route");
const hiddenRoute = require("./routes/hidden.route");
const userRoute = require("./routes/user.route");
const pestenRoute = require("./routes/pesten.route");
const friendRoute = require("./routes/friend.route");
const statsRoute = require("./routes/stats.route");

let app = express();

let http = require("http");
let server = http.Server(app);

// Socket.io
let socketIO = require("socket.io");
let io = socketIO(server);

const port = process.env.PORT || 5000;

// Chat socket
io.on("connection", socket => {
  console.log("User connected to chatbox");

  socket.on("new-message", message => {
    console.log("Message:" + message);
    io.emit("new-message", message);
  });
});

// Parse usual forms
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Cors
const cors = require("cors");
const whitelist = ["http://localhost:4200", "http://127.0.0.1:4200"];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  }
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api/login", loginRoute);
app.use("/api/hidden", hiddenRoute);
app.use("/api/user", userRoute);
app.use("/api/pesten", pestenRoute);
app.use("/api/friend", friendRoute);
app.use("/api/stats", statsRoute);

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.DB, {useNewUrlParser: true}).then(
  () => {
    console.log("Database is connected");
  },
  err => {
    console.log("Can not connect to the database" + err);
  }
);

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});


// Add subscriber for notifications
let USER_SUBSCRIPTIONS = [];

app.route('/api/notifications').post((req, res) => {
  const sub = req.body;
  console.log('Received Subscription on the server: ', sub);

  USER_SUBSCRIPTIONS.push(sub);
  res.status(200).json({message: "Subscription added successfully."});
})


// Push notifications
const vapidKeys = {
  "publicKey": "BOeUCIce-rGD5dA9g6qT455oAnvKU1AFzQU8eixLWlGVuHzFZSHjqymYIzjYN7Sh7Kqxk9AoHoCBgpSgM9Tes60",
  "privateKey": "GY2AuRfljx1iHcj1FuXCa8Nc9cJOOkEp3a_ekqY6S_A"
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.route('/api/newsletter').post((req, res) => {
  const allSubscriptions = USER_SUBSCRIPTIONS

  console.log('Total subscriptions', allSubscriptions.length);

  const notificationPayload = {
    "notification": {
      "title": "Angular News",
      "body": "Newsletter Available!",
      // "icon": "assets/main-page-logo-small-hat.png",
      "vibrate": [100, 50, 100],
      "data": {
        "dateOfArrival": Date.now(),
        "primaryKey": 1
      },
      "actions": [{
        "action": "explore",
        "title": "Go to the site"
      }]
    }
  };

  Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
    sub, JSON.stringify(notificationPayload))))
    .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
    .catch(err => {
      console.error("Error sending notification, reason: ", err);
      res.sendStatus(500);
    });
})