// express is an server-side web framework for node.js which execute our code on the web
const express = require("express");
//body parser is a middleware, used to process data sent through an HTTP request body.
const bodyParser = require("body-parser");
const route = require("./route/route"); //imported route
const mongoose = require("mongoose"); //ODM library for mongoDB
const app = express(); //Assign express in app variable


app.use(bodyParser.json()); //transforms the text-based JSON input into JS-accessible variables


//a framework that helps to establish a connection b/w node and mongoDB
mongoose
  .connect(
    "mongodb+srv://spandey6395:R43s8If0R4EpfraA@cluster0.mknlo.mongodb.net/Saurabh5678",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("mongoDB Connected")) //return fullfiled promise
  .catch((err) => console.log(err)); //return rejected promise

app.use("/", route);

//port is two-way communication link between two programs running on the network
app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});