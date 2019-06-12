const bodyParser = require("body-parser");
const cors = require("cors");

const loginRoute = require("./routes/login.route");
const hiddenRoute = require("./routes/hidden.route");

let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

// Socket.io
let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 5000;

// Chat socket
io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('new-message', (message) => {
    io.emit('new-message', message);
  });
});

// Parse usual forms
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use("/api/login", loginRoute);
app.use("/api/hidden", hiddenRoute);

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
