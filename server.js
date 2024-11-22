require('dotenv').config();

const express  = require('express');
const multer= require('multer');
const app      = express();
const port     = process.env.PORT || 1111;
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const configDB = require('./config/database.js');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./config/passport')(passport); // pass passport for configuration


// configuration ===============================================================
mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Mongoose connected');
})
.catch(err => {
  console.error('Mongoose Connection Error:', err);
});

MongoClient.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(client => {
  console.log('Connected to Database');
  const db = client.db(process.env.DB_NAME);
  
  // Pass app, passport, and db to routes
  require('./app/routes.js')(app, passport, db);
  
  // Start server after DB connection
  app.listen(port, () => {
      console.log('Server running on port ' + port);
  });
})
.catch(error => {
  console.error('Database Connection Error:', error);
});

// Add after your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: err.message || 'Internal Server Error'
    });
});