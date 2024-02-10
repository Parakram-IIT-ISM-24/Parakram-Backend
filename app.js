require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const changePassword = require("./routes/changePassword.js");

const app = express();



main().catch(e => console.log(e)).then(() => console.log("Database connected !!!"));
async function main(){
  await mongoose.connect('mongodb+srv://barmanayush2980:AyushBarman1@cluster0.mll8ahb.mongodb.net/?retryWrites=true&w=majority');
}



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

app.use("/api" ,auth );
app.use("/api" , changePassword)

app.use((err ,req , res , next) => {
    const {statusCode= 400 , message , name} = err;
    if(name == "ValidationError") return next(createError(400 , message));
    res.status(statusCode).send({error : message})
})

app.use((err , req , res , next) => {
  const {message , statusCode} = err;
  res.status(statusCode).send({error : message})
})


app.listen(PORT , () => {
    console.log(`Listening on PORT : ${PORT}`)
})