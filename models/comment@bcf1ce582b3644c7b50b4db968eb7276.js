const mongoose = require("mongoose");

//Reference to Schema constructor
let Schema = mongoose.Schema;

//Create CommentSchema using onstructor
let CommentSchema = new Schema({
    title: String,
    body: String,
    date: {type: Date, default: Date.now}
});

//Create model using schema and model method
let Comments = mongoose.model("Comment", CommentSchema);

//Export the Comment model
module.exports = Comments;