// ---------- ##### Declarations #####---------- //
const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  cookieParser = require("cookie-parser"),
  methodOverride = require('method-override'),
  LocalStrategy = require('passport-local'),
  session = require("express-session"),
  Nightlife = require('./models/nightlife'),
  Comment = require('./models/comment'),
  User = require('./models/user');

const commentsController = require('./controllers/commentsController.js'),
  nightlifeController = require('./controllers/nightlifeController'),
  ratingController = require("./controllers/ratingController"),

  indexController = require('./controllers/indexController.js');


const PORT = process.env.PORT || 3000;

// ---------- ##### Middleware #####---------- //

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('secret'));
app.use(flash());
app.locals.moment = require('moment');
app.set('view engine', 'ejs');

// ---------- ##### Passport Configuration #####---------- //
app.use(
  require('express-session')({
    secret: 'Oliver is the best',
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexController);
app.use('/nightlife', nightlifeController);
app.use("/nightlife/:id/ratings", ratingController);

app.use('/nightlife/:id/comments', commentsController);

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/'+ `YOUR DATABASE NAME`;
//
// // Connect to Mongo
// mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});

// ---------- ##### Database #####---------- //
const mongoURI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/nightGuideX';
mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('Connected to Mongo');
});

// -------------- ##### Listener #####-------------- //
app.listen(PORT, () =>
  console.log(`The NightGuide X Server Is Operational On Port: ${PORT}`)
);
