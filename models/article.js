const mongoose = require("mongoose");

//Reference to Schema constructor
const Schema = mongoose.Schema;

//Create ArticleSchema
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

//Create model from schema using model method
const Article = mongoose.model("Article", ArticleSchema);

//Export model
module.exports = Article;