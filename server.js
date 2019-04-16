require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const mongoose = require("./db-config");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//require('events').EventEmitter.defaultMaxListeners = 15;

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "50mb",
    parameterLimit: 1000000
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Authentication
app.use(passport.initialize());
require("./config/passport")(passport);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const server = {
  host: "http://localhost",
  port: 5000
};

const port = process.env.PORT || server.port;
app.listen(port, () => {
  console.log(`Listening on ${server.host}:${port} ..`);
});
