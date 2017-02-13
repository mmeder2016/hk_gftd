var path = require("path");

// 1.) The user starts at '/' (login.html)
//     a.) The user enters username and password and  clicks on Login
//         button and POSTS '/authenticate'.
//         - Success - redirects to '/homepage'
//         - Fail - back to '/' (login.html)
//     b.) The user enters username and password and  clicks on Sign Up
//         button and POSTS '/signup'.
//         - Success - redirects to '/homepage'
//         - Fail - back to '/' (login.html)

module.exports = function(app, db, approot) {

    // 5 GETS

    // GET 1.) This is the login page were you start. This page can POST a
    // '/authenticate' if the 'Login' button is clicked, or GET the '/signup'
    // page if the 'Register' button is clicked
    app.get("/", function(req, res) {
        console.log('app.get("/", function(req, res) {');
        var msg = 'Users may Login. Others need to Sign Up to open new account';
        res.render("login", { headerMessage: msg, layout: 'mainlogin' });
    });

    // GET 2.) Getting here is the goal. If you have successfully logged in or 
    // successfully registered, you get to go to homepage.
    app.get("/homepage", function(req, res) {
        console.log('app.get("/", function(req, res) {');
        res.sendFile(path.join(approot, '/public/homepage.html'));
    });

    // GET 3.) If you are on the login page and you choose to register as a new
    // user, you need to get this new page. (So it can post a '/register')
    app.get("/signup", function(req, res) {
        console.log('app.get("/signup", function(req, res) {');
        res.render("signup", { headerMessage: 'New Sign Up' , layout: 'mainlogin'});
    });
    // GET 4.) Logging out and redirecting to the login page
    app.get('/logout', function(req, res) {
        console.log('app.get("/logout", function(req, res) {');
        req.logout();
        res.redirect('/');
    });
    // GET 5.) Return to login page with failure message in panel header
    app.get('/loginFailure', function(req, res, next) {
        console.log('app.get("/loginFailure", function(req, res, next) {');
        var msg = 'Failed to authenticate';
        res.render("login", { headerMessage: msg , layout: 'mainlogin'});
    });

    // 2 POSTS

    // POST 1.) Attempt to register a new user. If the register succeeds, the 
    // user is re-directed to the '/homepage'. If the registration fails, the
    // user is given an error message. THIS NEEDS IMPROVEMENT FOR A FAILURE
    app.post('/register', function(req, res) {
        console.log('app.post("/register", function(req, res) {');
        console.log(req.body);
        db.Login.register(req.body.username, req.body.password, function(err, account) {
            if (err) {
                console.log(err);
                res.render("signup", { headerMessage: err.message , layout: 'mainlogin'});
                return;
            }
            var msg = 'Now you will need to login wtih your new credentials';
            res.render("login", { headerMessage: msg , layout: 'mainlogin'});
        });
    });

    // POST 2.) Authenticate a login for a user. The only action taken at this
    // time is re-direction to appropriate pages for success and failure.
    app.post('/login', app.get('passport').authenticate('local', {
        successRedirect: '/surveyfirst',
        failureRedirect: '/loginFailure'
    }));
};