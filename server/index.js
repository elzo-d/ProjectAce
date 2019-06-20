const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./DB");
const bodyParser = require("body-parser");

const loginRoute = require("./routes/login.route");
const hiddenRoute = require("./routes/hidden.route");
const userRoute = require("./routes/user.route");

let app = express();

let http = require("http");
let server = http.Server(app);

// Socket.io
let socketIO = require("socket.io");
let io = socketIO(server);

const port = process.env.PORT || 5000;

// Chat socket
io.on("connection", socket => {
  console.log("user connected");

  socket.on("new-message", message => {
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

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
