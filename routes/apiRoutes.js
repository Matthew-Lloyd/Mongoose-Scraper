//Routes
var db = require("../models")
const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = function (app) {
    // A GET route for scraping the subreddit ShowerThoughts website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with request
        axios.get("https://www.reddit.com/r/Showerthoughts/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            let $ = cheerio.load(response.data);

            // Now, we grab every paragraph with a title tag, and do the following:
            $("p.title").each(function (i, element) {
                // Save an empty result object
                let result = {};


                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

                console.log(result);

                // Create a new Thought using the `result` object built from scraping
                db.Thought.create(result)
                    .then(function (dbThought) {
                        // View the added result in the console
                        console.log(dbThought);
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });
            });

            // If we were able to successfully scrape and save a Thought, send a message to the client
            res.send("Scrape Complete");
        });
    });

    app.get("/", function (req, res) {
        res.render('index');
    });

    // Route for getting all Thoughts from the db
    app.get("/thoughts", function (req, res) {
        // Grab every document in the Thoughts collection
        db.Thought.find({})
            .then(function (dbThought) {
                // If we were able to successfully find Thoughts, send them back to the client
                res.json(dbThought);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Thought by id, populate it with it's note
    app.get("/thoughts/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Thought.findOne({ _id: req.params.id })
            .then(function (dbThought) {
                // If we were able to successfully find a Thought with the given id, send it back to the client
                res.json(dbThought);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating a Thought's associated Note
    app.post("/thoughts/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Thought with an `_id` equal to `req.params.id`. Update the Thought to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Thought.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbThought) {
                // If we were able to successfully update an Thought, send it back to the client
                res.json(dbThought);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};