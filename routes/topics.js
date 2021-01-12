var express = require("express");
var router = express.Router();
var Topic = require("../models/topic");
var middleware = require("../middleware/index.js");
var request = require("request");
var Comment = require("../models/comment");
var multer = require('multer');



var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});


var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'digi9mjbp',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// Index Route
router.get("/", function (req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    // Topic.find({}).sort({"_id": -1}).limit(5).exec(function(err, campgrounds) { .... }); 

    //get all topics from DB
    Topic.find({}).sort({ "_id": -1 }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allTopics) {
        if (err) {
            console.log(err);
        }
        var countDocuments = allTopics.length;
        Topic.countDocuments().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("topics/index", {
                    topics: allTopics,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });

});

// Create Route
router.post("/", middleware.isLoggedIn, upload.single('image'), function (req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        // add cloudinary url for the image to the topic object under image property
        req.body.topic.image = result.secure_url;
        //add image's public_id to topic object
        req.body.topic.imageId = result.public_id;
        // add author to topic
        req.body.topic.author = {
            id: req.user._id,
            username: req.user.username
        };
        Topic.create(req.body.topic, function (err, topic) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            res.redirect('/topics/' + topic.id);
        });
    });
});

// New Route - show form to create new topic
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("topics/new");
});

// Show Route - show more info about topic
router.get("/:id", function (req, res) {
    //find the topic with provided ID
    Topic.findById(req.params.id).populate("comments").exec(function (err, foundTopic) {
        if (err || !foundTopic) {
            console.log("error", "Topic Not Found");
            res.redirect("back");
        } else {
            console.log("foundTopic");
            //render the show template with the ID
            res.render("topics/show", { topic: foundTopic });
        }
    });
});

// Edit Topic Route
router.get("/:id/edit", middleware.checkTopicOwnership, function (req, res) {
    Topic.findById(req.params.id, function (err, foundTopic) {
        if (err) {
            req.flash("error", "There was a problem");
            res.redirect("back");
        }
        res.render("topics/edit", { topic: foundTopic });
    });
});

// Update Topic Route
router.put("/:id", upload.single('image'), function (req, res) {
    Topic.findById(req.params.id, async function (err, topic) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(topic.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    topic.imageId = result.public_id;
                    topic.image = result.secure_url;
                } catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            topic.name = req.body.topic.name;
            topic.description = req.body.topic.description;
            topic.save();
            req.flash("success", "Successfully Updated!");
            res.redirect("/topics/" + topic._id);
        }
    });
});


// Destroy topic route
router.delete('/:id', function (req, res) {
    Topic.findById(req.params.id, async function (err, topic) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(topic.imageId);
            topic.remove();
            req.flash("success", "Topic deleted successfully!");
            res.redirect("/topics");
        } catch (err) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    });
});


module.exports = router;