var Topic = require("../models/topic");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkTopicOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Topic.findById(req.params.id, function(err, foundTopic){
           if(err || !foundTopic){
               req.flash("error", "Topic Not Found");
               res.redirect("back");
           } else {
            // does user own topic?
            if(foundTopic.author.id.equals(req.user._id) || req.user.isAdmin){
               next(); 
            } else {
              req.flash("error", "You Are Not Authorized To Do That");
              res.redirect("back");  
            }
           }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
           if(err || !foundComment){
            req.flash("error", "Comment Not Found");
            res.redirect("back");
           } else {
            // does user own comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
               next(); 
            } else {
              req.flash("error", "You Don't Have Permission To Do That!");    
              res.redirect("back");  
            }
           }
        });
    } else {
        req.flash("error", "You Need To Be Logged In To Do That");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need To Be Logged In To Do That");
    res.redirect("/login");
};


module.exports = middlewareObj;