require('dotenv').config();
// server.js

// set up ======================================================================
// get all the tools we need
let express  = require('express');
let multer= require('multer');
let app      = express();
let port     = process.env.PORT || 1111;
const MongoClient = require('mongodb').MongoClient
let mongoose = require('mongoose');
let passport = require('passport');
let flash    = require('connect-flash');

let morgan       = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let session      = require('express-session');

let configDB = require('./config/database.js');

// configuration ===============================================================
MongoClient.connect(process.env.DB_STRING, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db(process.env.DB_NAME);
    
    require('./app/routes.js')(app, passport, db);
    
    app.listen(port, () => {
      console.log('The magic happens on port ' + port);
    });
  })
  .catch(error => {
    console.error('Database Connection Error:', error);
  });
//mongoose.connect(configDB.url, (err, database) => {
//  if (err) return console.log(err)
//  db = database
//  require('./app/routes.js')(app, passport, db);
//}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

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

// Add after your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: err.message || 'Internal Server Error'
    });
});