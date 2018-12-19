const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware= require("../middleware");

// CREATE NEW COMMENT
router.get("/new", middleware.isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Error, Something Went Wrong!");
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           req.flash("error", "Error, Something Went Wrong!");
           console.log(err);
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Error, Something Went Wrong!");
               console.log(err);
           } else {
            //   add username & ID to comments
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
            //   save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Successfully Created Comment");
               res.redirect("/campgrounds/" + campground._id);
           }
        });
       }
   }); 
});

// EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            req.flash("error", "Error, Something Went Wrong!");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           req.flash("error", "Error, Something Went Wrong!");
           res.redirect("back");
       } else{
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Error, Something Went Wrong!");
            res.redirect("back");
        } else{
            req.flash("success", "Comment Deleted!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    }); 
});


module.exports = router;