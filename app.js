require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const changePassword = require("./routes/changePassword.js");
const eventTeamRegistrationRoute = require("./routes/eventTeamRegistrationRoutes");

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL;

const app = express();
app.use(cors({
  origin: true,
  methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
  credentials: true
}));


async function main() {
  try {
    await mongoose.connect(DB_URL).then(() => {
      console.log("connected to database");
    });
  } catch (err) {
    console.log(err);
    console.log("error connecting to database");
  }
}
main();



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

app.use("/api", auth);
app.use("/api", changePassword);
app.use("/api", eventTeamRegistrationRoute);

app.get("/", (req, res) => {
  res.send("test");
});

app.use((err, req, res, next) => {
  const { statusCode = 400, message, name } = err;
  if (name == "ValidationError") return next(createError(400, message));
  res.status(statusCode).send({ error: message })
})

app.use((err, req, res, next) => {
  const { message, statusCode } = err;
  res.status(statusCode).send({ error: message })
})


app.listen(PORT, () => {
  console.log(`Listening on PORT : ${PORT}`)
})