/* ************************************************************************ */
/*
    Node/Express Server
*/
var express = require('express');
var app = express();

/*
    Handlebars Setup
*/
var exphbs = require('express-handlebars');
// Set Handlebars as the default templating engine.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

/*
    Method Override Setup

    https://www.npmjs.com/package/method-override
*/
var methodOverride = require('method-override');
// override with POST having ?_method=DELETE
// and fire off the app.delete() paths
app.use(methodOverride('_method'));

/*

    NOTE: The "morgan" logging package is somewhat useful,
    but oddly it's output arrives "after the fact". For 
    example, console.log() calls from page rendering occur
    before the morgan output. It should really be seen before
    the render logging.

// HTTP request logger middleware for node.js
// https://www.npmjs.com/package/morgan
var morgan = require('morgan');
app.use(morgan('combined'));

*/

// Body Parser - provides json-ized form data
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

/*
    Allow CORS

    See - http://enable-cors.org/server_expressjs.html
*/
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/*
    NOTE: The following line is necessary, especially if 
    deploying to Heroku. Other platforms may require it
    as well. 
*/
app.set('port', (process.env.PORT || 3000));

// Requiring our models for syncing
var db = require('./models');

// passport
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var MySQLStore = require('express-mysql-session')(session);
var options = {
    host: db.sequelize.config.host,
    port: db.sequelize.config.port,
    user: db.sequelize.config.username,
    password: db.sequelize.config.password,
    database: db.sequelize.config.database
};
var sessionStore = new MySQLStore(options);

app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({ secret: 'super-secret', resave: false, saveUninitialized: true, store: sessionStore }));
app.use(passport.initialize());
app.use(passport.session());
app.set('passport', passport);

passport.use(db.Login.createStrategy());
passport.serializeUser(db.Login.serializeUser());
passport.deserializeUser(db.Login.deserializeUser());

// Routes
var router = require('./router');
router(app, db, __dirname);

/*  
    Sequelize-sync the database and then listen 
    on the port that was configured for us
*/
db.sequelize.sync({}).then(function() {
    console.log('server.js - database has been synced');
    app.listen(app.get('port'), function() {
        console.log('server.js - listening on port ' + app.get('port'));
        console.log('server.js - IDLE - waiting for the first connection');
        console.log('================================================');
    });
});