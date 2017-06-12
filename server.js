/* Web Scraper Server.js
 * ==================== */

// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var request = require('request')
var mongoose = require('mongoose');
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');
var handlebars = require('express-handlebars');
var cheerio = require('cheerio');

// Set Mongoose Promise to ES6 Promise
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Set port for server
var PORT = process.env.PORT || 3000;

// Configure app with morgan and body parser
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Configure app to use handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Static file support using the public folder
app.use(express.static('public'));

// Routes
require('./controllers/html-routes.js')(app, request, cheerio);


// Database configuration with mongoose
mongoose.connect('mongodb://localhost/web-scraper');
var db = mongoose.connection;

// Show any errors with mongoose
db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
});

// Logs a message when the Mongoose connection is complete
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Listen on port 3000
app.listen(PORT, function() {
  console.log('App running on port :'+ PORT);
});
