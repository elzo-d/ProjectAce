const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./DB");
const bodyParser = require("body-parser");

const loginRoute = require("./routes/login.route");
const hiddenRoute = require("./routes/hidden.route");
const userRoute = require("./routes/user.route");

// Express
const app = express();
const PORT = process.env.PORT || 5000;

let http = require("http");
let server = http.Server(app);

// Socket.io
let socketIO = require("socket.io");
let io = socketIO(server);

//parse usual forms
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Cors
const cors = require("cors");
const whitelist = ["http://localhost:4200"];
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

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.DB, { useNewUrlParser: true }).then(
  () => {
    console.log("Database is connected");
  },
  err => {
    console.log("Can not connect to the database" + err);
  }
);

// Chat socket
io.on("connection", socket => {
  console.log("User connected to chatbox");

  socket.on("new-message", message => {
    console.log("Message:" + message);
    io.emit(message);
  });
});

app.listen(PORT, () => {
  console.log("Express starting listening on port " + PORT);
});
