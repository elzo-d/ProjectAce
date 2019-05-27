const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const loginRoute = require("./routes/login.route");
const hiddenRoute = require("./routes/hidden.route");

// Express
const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, function() {
  console.log("Express starting listening on port " + PORT);
});
