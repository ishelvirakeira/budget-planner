//use the passport.js template from savage-auth

const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user'); // adjust the path if needed
const bcrypt = require('bcryptjs');

module.exports = function(passport) {

    //used to serialize the user for session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user for session
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    //local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        User.findOne({ email: email.toLowerCase() })
            .then(user => {
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already registered.'));
                }

                // Create new user
                const newUser = new User();
                newUser.name = req.body.name;
                newUser.email = email.toLowerCase();
                newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

                return newUser.save();
            })
            .then(savedUser => {
                if (savedUser) return done(null, savedUser);
            })
            .catch(err => done(err));
    }));

    //local login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        User.findOne({ email: email.toLowerCase() })
            .then(user => {
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                return done(null, user);
            })
            .catch(err => done(err));
    }));
};
