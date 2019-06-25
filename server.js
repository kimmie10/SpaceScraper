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

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
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
app.use(express.static(__dirname + "/public"));

// Database configuration with mongoose
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/SpaceScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//mongoose.connect('mongodb://localhost:27017/spacescraper', {useNewUrlParser: true});

// test mlab connection
//mongoose.connect("mongodb://");

//Routes
//redirect to scrap on load
app.get("/", function (req, res) {

    res.redirect("/scrape")
});

//Get route for scraping NASA.gov
app.get("/scrape", function (req, res) {
    //  db.Article.remove({}, function (err) {
    //      if (err) {
    //          console.log(err);
    //      }
    // });
    axios.get("https://blogs.nasa.gov/")
        .then((response) => {
            console.log(response.data);
            const $ = cheerio.load(response.data);

            $("article.header.h2").each(function (/*i, element*/) {
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
            res.redirect("/articles");
        });
        // .catch(error => {
        //     console.log(error);
        // });
});

//Get all articles from db and render
app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {

            res.render("index", { data: dbArticle });
        })
        .catch(function (err) {

            res.json(err);
        });
});

//Get one article id and populate comment based on id
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.ObjectId })

        .populate("comment")
        .then(function (dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);
            //res.render("index", { data: dbArticle });
        })
        .catch(function (err) {

            res.json(err);
        });
});

//Create and update comment
app.post("/articles/:id", function (req, res) {

    console.log(req.body);
    db.Comment.create(req.body)
        .then(function (dbComment) {

            return db.Article.findOneAndUpdate({ _id: req.params.ObjectId }, { comment: dbComment.ObjectId }, { new: true });
        })
        .then(function (dbArticle) {
            //res.render("index", { data: dbArticle });
            res.json(dbArticle)
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log(`App running on port ${PORT} ! `)
});