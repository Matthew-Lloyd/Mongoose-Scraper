//npm package requirements
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const axios = require('axios');
const cheerio = require('cheerio');

//database variable pointing to all mongoose models & listener port
const db = require('./models');
const PORT = 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Handlebars Initializer
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/MongooseScraper");


require("./routes/apiRoutes.js")(app);
// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
