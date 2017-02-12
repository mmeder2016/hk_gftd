

module.exports = function(app, db, approot) {
    var path = require('path');

    var gftdview = require(path.join(approot, '/views/gftd-view.js'));

    app.get('/survey', function(req, res) {
        if (req.isAuthenticated()) {
            log('user is authenticated!');

            // Check if user exists in the users database, if not, add the
            // username to users db.
            var unid = { userName: "", id: -1 };
            db.User.find({
                where: {
                    userName: req.user.dataValues.username
                }
            }).then(function(user) {
                if (!user) {
                    db.User.create({
                        userName: req.user.dataValues.username
                    }).then(function(dbUser) {
                        unid.id = dbUser.id;
                        unid.userName = dbUser.userName;
                        log('Created new user');
                        var renderData = {
                            unid: {
                                id: unid.id,
                                userName: unid.userName
                            }
                        };
                        gftdview.renderSurvey(res, renderData);
                    });
                } else {
                    unid.id = user.id;
                    unid.userName = user.userName;
                    log('User exists in users db.');
                    var renderData = {
                        unid: {
                            id: unid.id,
                            userName: unid.userName
                        }
                    };
                    gftdview.renderSurvey(res, renderData);
                }
            });

        } else {
            log('user is NOT authenticated!');
            res.redirect('/');
        }
    });


    app.get('/newproduct', function(req, res) {
        if (req.isAuthenticated()) {
            log('user is authenticated!');
            gftdview.renderNewProduct(res);
        } else {
            log('user is NOT authenticated!');
            res.redirect('/');
        }
    });

    /* ***************************** */
    /*
        Utility functions
    */
    /*
        Logs info for a POST path
    */
    function logPost(req, res) {
        console.log(getThisFileName()+ ': '+getInfoStr(req)+' body = '+JSON.parse(req.body));
    };

    /*
        Logs info for a POST path
    */
    function logParams(req, res) {
        console.log(getThisFileName()+ ': '+getInfoStr(req)+' params = '+JSON.parse(req.params));
    };

    /*
        Logs info for a POST path
    */
    function logQuery(req, res) {
        console.log(getThisFileName()+ ': '+getInfoStr(req)+' query = '+JSON.stringify(req.query));
    };

    /*
        Logs a string
    */
    function log(text) {
        console.log(getThisFileName()+ ': '+text);
    };

    /*
        String ("true" or "false") conversion to a boolean
        data type. This is necessary for reading the value
        of HTML input tags, including select. 

        This is necessary because the Handlebars package
        will render boolean values as "true" & "false". And
        body-parser will return it as a string that won't 
        change types even if parsed as json.
    */
    function stringToBool(bStr) {
        var bRet = false;
        
        switch(bStr.toLowerCase()) {
            case 'true':
                bRet = true;
                break;

            case 'false':
                bRet = false;
                break;
        }
        return bRet;
    };

    /*
        Assembles some info used in development only.

        Modify as needed.
    */
    function getInfoStr(req) {
        return req.method + ' - ' + req.route.path;
    };

    /*
        Get just the file name of this file and return it
    */
    function getThisFileName() {
        var name = __filename;
        var idx  = name.lastIndexOf('/') + 1;
        if(idx === 0) idx = name.lastIndexOf('\\') + 1;
        var file = name.substring(idx, name.length);
        return file;
    };
};

