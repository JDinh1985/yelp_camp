var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user'),
    Campground = require('../models/campground');

// ==========================================
// ROUTES
// ==========================================

router.get('/', function(req, res){
    res.render("landing");    
});



// ---------------------------
// AUTH ROUTES
// ---------------------------

// SHOW - sign up form
router.get('/register', function(req,res){
   res.render('register', {page: 'register'}); 
});

// Handle sign up logic
router.post('/register', function(req, res){
    // User.register() method provided by passport local mongoose in User model
    var newUser = new User({
            username: req.body.username, 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar
        });
    if(req.body.adminCode == 'secretcode123'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err.message);
           return res.render("register", {error: err.message});
       }
       passport.authenticate('local')(req, res, function(){
          req.flash('success', "Welcome to YelpCamp " + user.username);
          res.redirect('/campgrounds'); 
       });
    });
});

// SHOW - login form
router.get('/login', function(req, res){
   res.render('login', {page: 'login'}); 
});

// Handle login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res){
});

// Handle logout logic
router.get('/logout', function(req, res){
    // logout method included in passport packages installed 
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

// User Profile Route
router.get('/users/:id', function(req, res){
    // find user 
    User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", "Something went wrong.");
           res.redirect('/');
       }
       Campground.find().where('author.id').equals(foundUser.id).exec(function(err, campgrounds){
            if(err){
                req.flash("error", "Something went wrong.");
                res.redirect('/');
            }
            res.render('users/show', {user: foundUser, campgrounds: campgrounds});  
       });
    });
});

module.exports = router;