var express = require("express");
var router  = express.Router({mergeParams: true});
var Topic   = require("../models/topic");
var Comment   = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find topic by id
    console.log(req.params.id);
    Topic.findById(req.params.id, function(err, topic){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {topic: topic});
        }
    });
});

// Comments Create 
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup topic using ID
   Topic.findById(req.params.id, function(err, topic){
       if(err){
           console.log(err);
           res.redirect("/topics");
       } else {
           //create new comments
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                  res.flash("error", "Something Went Wrong!");
                  console.log(err);
              } else {
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  //connect new comment to the topic
                  topic.comments.push(comment);
                  topic.save();
                  console.log(comment);
                  req.flash("success", "Successfully Added Comment!");
                  //redirect to topic show page
                  res.redirect("/topics/" + topic._id);
              }
           });
       }
   });
});


// Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // find campground by id
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {topic_id: req.params.id, comment: foundComment});
        }
    });
});


// Comment Update
router.put("/:comment_id/", middleware.checkCommentOwnership, function(req, res){
    // find topic by id
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
             req.flash("success", "Comment updated");
             res.redirect("/topics/" + req.params.id );
        }
    });
});


// Comment Destroy Route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
             res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/topics/" + req.params.id);
        }
    });
});


module.exports = router;
