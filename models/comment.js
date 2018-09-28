const mongoose = require("mongoose");

//Reference to Schema constructor
const Schema = mongoose.Schema;

//Create CommentSchema using constructor
const CommentSchema = new Schema({
    title: String,
    body: String,
    //date: {type: Date, default: Date.now}
});

//Create model using schema and model method
const Comment = mongoose.model("Comment", CommentSchema);

//Export the Comment model
module.exports = Comment;