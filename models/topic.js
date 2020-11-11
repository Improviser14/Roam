var mongoose = require("mongoose");

var topicSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    description: String,
    // url: {
    //     work: {type: mongoose.SchemaTypes.Url, required: true},
    //     profile: {type: mongoose.SchemaTypes.Url, required: true},
    // },
    createdAt: { type: Date, default: Date.now},
    author: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
    },
    comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("Topic", topicSchema);