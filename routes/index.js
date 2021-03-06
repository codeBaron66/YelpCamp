const express  = require("express"),
      router   = express.Router(),
      passport = require("passport"),
      User     = require("../models/user");


router.get("/", function(req, res){
   res.render("landing");  
});

router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome To YelpCamp " + req.body.username);
            res.redirect("campgrounds");
        });
    });
});

// ======
// LOGIN
// ======

router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "login"
    }), function(req, res){
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You Logged Out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;