

module.exports = function(app, db, approot) {
    var path = require('path');

    var gftdview = require(path.join(approot, '/views/gftd-view.js'));

    var currentSession = {
        unid: {
            id: -1,
            userName: ''
        }
    };

    app.get('/survey', function(req, res) {
        if (req.isAuthenticated()) {
            log('user is authenticated!');
            var renderData = {
                unid: {
                    id: currentSession.unid.id,
                    userName: currentSession.unid.userName
                }
            };
            gftdview.renderSurvey(res, renderData);
        } else {
            log('user is NOT authenticated!');
            res.redirect('/');
        }
    });

    app.get('/surveyfirst', function(req, res) {
        if (req.isAuthenticated()) {
            log('user is authenticated!');

            // Check if user exists in the users database, if not, add the
            // username to users db.

            // first clear our session data
            currentSession.unid.userName = '';
            currentSession.unid.id = -1;

            db.User.find({
                where: {
                    userName: req.user.dataValues.username
                }
            }).then(function(user) {
                if (!user) {
                    db.User.create({
                        userName: req.user.dataValues.username
                    }).then(function(dbUser) {
                        currentSession.unid.id = dbUser.id;
                        currentSession.unid.userName = dbUser.userName;
                        log('Created new user');
                        var renderData = {
                            unid: {
                                id: currentSession.unid.id,
                                userName: currentSession.unid.userName
                            }
                        };
                        gftdview.renderSurvey(res, renderData);
                    });
                } else {
                    currentSession.unid.id = user.id;
                    currentSession.unid.userName = user.userName;
                    log('User exists in users db.');
                    var renderData = {
                        unid: {
                            id: currentSession.unid.id,
                            userName: currentSession.unid.userName
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


    app.get('/pastsearches', function(req, res) {
        if (req.isAuthenticated()) {
            log('user is authenticated!');

            var renderData = {
                unid: {
                    id: currentSession.unid.id,
                    userName: currentSession.unid.userName
                },
                gifts: []
            };
/*
            var gift = {
                recipientName: '',
                productName: '',
                description: '',
                recipId: -1,
                prodId: -1
            };
*/
            db.Gift.findAll({
                where: {
                    UserId: renderData.unid.id
                },
                order: 'RecipientId ASC'
            })
            .then(function(gifts) {
                renderData.gifts = JSON.parse(JSON.stringify(gifts));
                console.log(renderData.gifts);
                gftdview.renderPastSearches(res, renderData);
            });

/* ********
        var gfts = [];
        var uID = 1;
        db.sequelize.query("SELECT ProductId, RecipientId from `gifts` WHERE UserId = ?", { replacements: [uID], type: db.sequelize.QueryTypes.SELECT })
            .then(function(_gifts) {
                console.log(_gifts);
                _gifts.forEach(function(element) {
                    db.sequelize.query("SELECT recipientName FROM `recipients` WHERE id = ?", { replacements: [element.RecipientId], type: db.sequelize.QueryTypes.SELECT })
                        .then(function(_recipientName) {
                            console.log(_recipientName);

                            db.sequelize.query("SELECT productName, description FROM `products` WHERE id = ?", { replacements: [element.ProductId], type: db.sequelize.QueryTypes.SELECT })
                                .then(function(_product) {
                                    console.log(_product);

                                    //gfts.push({ _recipientName, _product: productName, _product: description });
                                    gfts.push({
                                        recipientName: _recipientName[0].recipientName,
                                        productName: _product[0].productName,
                                        description: _product[0].description
                                    });
                                    console.log('GFTS');
                                    console.log(gfts);
                                });
                        });
                }, this);
                console.log('are we done?');
            });
***** */


/*
            // first find all recipients for the current user
            db.Gift.findAll({
                where: {
                    UserId: renderData.unid.id
                },
                include: [
                    {
                        model: db.Recipient,
                        where: {
                            RecipientId: this.RecipientId
                        } 
                    }
                ],
                order: 'RecipientId ASC',
            })
            .then(function(gifts) {
                var allgifts = JSON.parse(JSON.stringify(gifts));
                console.log(allgifts);

                console.log('hereiam');
            });

            // put the recipient name in
            

//            gftdview.renderPastSearches(res, renderData);
*/



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

