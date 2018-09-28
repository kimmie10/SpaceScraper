const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

//Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize Express
const express = require("express");
const app = express();

//express handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Require all models
const db = require("./models");

//Set up PORT
const PORT = process.env.PORT || 3000;

//configure middleware

//morgan logger for logging requests
app.use(logger("dev"));
//body-parser for form submissions
app.use(bodyParser.urlencoded({ extended: true }));
//express.static to serve public folder as static directory
app.use(express.static("public"));

// // Database configuration with mongoose
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// // test mlab connection
// // mongoose.connect("mongodb://heroku_7zjjd6hl:Mateo123!@ds113873.mlab.com:13873/heroku_7zjjd6hl");

//Connect to the Mongo DB
mongoose.connect("mongodb://localhost/SpaceScraper", {
    useNewUrlParser: true
});

//Routes

//Get route for scraping NASA.gov
app.get("/scrape", function (req, res) {
    axios.get("https://blogs.nasa.gov/")
        .then(function (response) {
            console.log(response);
            let $ = cheerio.load(response.data);

            $("article h2").each(function (i, element) {
                let result = {};

                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });
            res.send("Scrape Complete");
        });
});

app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })

        .populate("comment")
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {

    console.log(req.body);
    db.Comment.create(req.body)
        .then(function (dbComment) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {

            res.json(dbArticle)
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log(`App running on port ${PORT} ! `)
});