const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  let newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    image: req.body.image
  });
  if(req.body.adminCode === 'secretcode123') {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome to Night Guide X ' + user.username);
      res.redirect('/nightlife');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/nightlife',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome to Night Guide X!'
  }),
  (req, res) => {}
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/nightlife');
});

router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      req.flash('error', 'Houston...we have a problem');
      return res.redirect('/');
    }
    res.render('users/show', {user: foundUser});
    // LostPet.find().where('author.id').equals(foundUser._id).exec((err, lostPets) => {
    //   if (err) {
    //     req.flash('error', 'Houston...we have a problem');
    //     return res.redirect("/");
    //   }
    //   res.render("users/show", {user: foundUser, lostPets: lostPets});
    // })
  });
});


module.exports = router;
