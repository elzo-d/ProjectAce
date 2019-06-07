const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const loginRoute = require("./routes/login.route");
const hiddenRoute = require("./routes/hidden.route");

// Express
const app = express();
const PORT = process.env.PORT || 5000;

let http = require('http');
let server = http.Server(app);

// Socket.io
let socketIO = require('socket.io');
let io = socketIO(server);

//parse usual forms
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use("/api/login", loginRoute);
app.use("/api/hidden", hiddenRoute);

// Chat socket
io.on('connection', (socket) => {
  console.log('User connected to chatbox');

  socket.on('new-message', (message) => {
    console.log("Message:" + message);
    io.emit(message);
  });
});

app.listen(PORT, () => {
  console.log("Express starting listening on port " + PORT);
});
