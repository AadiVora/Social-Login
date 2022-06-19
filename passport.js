const passport = require('passport');
const googleStartegy = require('passport-google-oauth2').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');

passport.use(new googleStartegy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    profileFields : ['id', 'displayName', 'name', 'picture.type(large)', 'email'],
    passReqToCallback: true
},function(request,accessToken,refreshToken,profile,done){
    process.nextTick(function() {
        User.findOne({email: profile.emails[0].value}, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                newUser = new User({
                    name: profile.name.givenName + ' ' + profile.name.familyName,
                    email: profile.emails[0].value,
                    pic: profile.photos[0].value
                });
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(err, newUser);
                });
            } 
            else {
                console.log("User found")
                console.log(user)
                return done(err, user);
            }
        });
    })
}));

passport.use(new facebookStrategy({
    clientID : process.env.FACEBOOK_CLIENT_ID,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL : process.env.FACEBOOK_CALLBACK_URL,
    profileFields : ['id', 'displayName', 'name', 'picture.type(large)', 'email']
},
function(token, refreshToken, profile, done) {
    process.nextTick(function() {
        User.findOne({email: profile.emails[0].value}, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                newUser = new User({
                    name: profile.name.givenName + ' ' + profile.name.familyName,
                    email: profile.emails[0].value,
                    pic: profile.photos[0].value
                });
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(err, newUser);
                });
            } 
            else {
                console.log("User found")
                console.log(user)
                return done(err, user);
            }
        });
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    // done(null, user);
    User.findById(id, function(err, user) {
        console.log(user)
        if(!err) {
            done(err, user);
        }
        else {
            done(err, null)
        }
    });
});

