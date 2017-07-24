'use strict';

const path = require('path');
const log = require('debug')('notes:router-users');
const error = require('debug')('notes:error');
const express = require('express');
const router = express.Router();
exports.router = router;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usersModel = require(process.env.USERS_MODEL
    ? path.join('..', process.env.USERS_MODEL)
    : '../models/users-rest');

exports.initPassport = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());
};

exports.ensureAuthenticated = function(req, res, next) {
    if (req.user) next();
    else res.redirect('/users/login');
};

router.get('/login', function(req, res, next) {
    // log(util.inspect(req));
    res.render('login', {
        title: 'Login to Notes',
        user: req.user
    });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/', // Success: Go to home page
        failureRedirect: '/users/login', // Fail: Got to /user/login
    })
);

router.get('/logout', function(req, res, next) {
    req.session.destroy(function (err) {
        if (err) next(err);
        else res.redirect('/');
    });
});

passport.use(new LocalStrategy(
  function(username, passport, done) {
      usersModel.userPasswordCheck(username, passport)
        .then(check => {
            if (check.check) {
                done(null, {id: check.username,
                username: check.username});
            } else {
                done(null, false, check.message);
            }
            return check;
        })
        .catch(err => done(err));
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.username)
});

passport.deserializeUser(function(username, done) {
    usersModel.find(username)
      .then(user => done(null, user))
      .catch(err => done(err));
});