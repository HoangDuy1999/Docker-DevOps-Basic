const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, "title must be require" ]
    },
    body: {
        type: String,
        required: [true, "body must be require"]
    },
}, { timestamps: true })


module.exports = mongoose.model("posts", postSchema);