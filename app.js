require('dotenv').config()
const express = require('express');
var path = require('path');
const app = express();
const session = require('express-session');
const passport = require('passport');
const User = require('./models/user');
require('./passport')

app.set("view engine","ejs");

app.use(session({secret: "secretkey", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res) => {
    res.render("index.ejs")
});

app.get('/auth/google', passport.authenticate('google',{scope: ['profile','email']}));

app.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/failed',
    function (req, res) {
        res.redirect('/');
    }
}));

app.get('/auth/facebook', passport.authenticate('facebook',{ scope: 'email', authType: 'reauthenticate'}));

app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/failed',
    function (req, res) {
        res.redirect('/');
    }
}));

app.get('/profile', (req,res) => {
    console.log(req.user)
    res.render('profile',{user: req.user})
});

app.get('/failed', (req,res) => {
    res.send("You are an invalid user");
});

app.get('/logout', function(req,res,next) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.use(express.static(path.join(__dirname,"public")));
app.listen(8000, () => {
    console.log("App is running on Port 8000")
});