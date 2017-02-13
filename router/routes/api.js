/* ************************************************************************ */
/*
    Server API Routing -


    NOTE: Feel free to modify this file as needed, or replace it, or
    delete it... It is provided as a starting point for creating routes
    that are specific to the application. 

    The module arguments are required. And your code will use them to access
    the Express application object, database object, and the root path of
    the application.

*/
module.exports = function(app, db, approot) {

    var path = require('path');

    var gftdview = require(path.join(approot, '/views/gftd-view.js'));

    var prodquery = {};
    
    // a minium of three matches in is??? for a
    // product to be considere a match.
    var PRODMATCH_MINIMUM = 3;

    /* ******************************************************************** */
    /*
        A common location for aggregating data for rendering. It can be 
        sourced from the database directly, or as the result of some sort of
        operation. The only "rule" is that Handlebars and the key names here
        must match up. It is also possible for specific paths to cause data 
        to be added in. This can be accomplished by using Object.assign().

        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

    */
    var renderdata = {
        unid: {
            id: -1,
            userName: ''
        }, 
        rnid: {
            id: -1,
            recipientName: ''
        },
        products: [],
        gifts: []
    };

    /* ******************************************************************** */
    /*
        GET /api/products - This path is used when submitting 
        questionnaire data
    */
    app.get('/api/products', function(req, res) {

        logQuery(req, res);

        var matches = [];
        // get all products
        db.Product.findAll({
            where: {
                agegroup: req.query.ageGroup
            }
        })
        .then(function(products) {
            // find products that match the questionnaire data and
            // save the results in renderdata.products[]
            findProductMatches(req.query, products);
            // return the matches to the client
            // via a rendered page and beyond
            renderdata.unid.id = req.query.userid;
            renderdata.unid.userName = req.query.userName;
            renderdata.rnid.recipientName = req.query.recipientName;

            // see if the recipient is in the db, of not then
            // create a new row.

            db.Recipient.find({
                where: {
                    recipientName: renderdata.rnid.recipientName
                }
            }).then(function(recip) {
                if (!recip) {
                    db.Recipient.create({
                        recipientName: renderdata.rnid.recipientName
                    }).then(function(dbRecip) {
                        renderdata.rnid.id = dbRecip.id;
                        gftdview.renderResults(res, renderdata);
                    });
                } else {
                    renderdata.rnid.id = recip.id;
                    gftdview.renderResults(res, renderdata);
                }
            });
        });
    });

    app.get('/api/newproduct', function(req, res) {
        logQuery(req, res);
        createProduct(req.query);
        gftdview.renderNewProduct(res);
    });

    app.get('/api/chooseprod', function(req, res) {
        // remove the selected product from the list
        // and move it to rnid.products, then add the
        // gift to the table, unless there's no more
        // products to add
        prodToGift(req.query);
        // render a new view
        gftdview.renderResults(res, renderdata);
    });


    /* ******************************************************************** */
    /*
        Module Utility Functions


    */
    function findProductMatches(query, products) {
        var searchfor = Object.keys(query);
        console.log(getThisFileName()+ ': findProductMatches() - query keys = '+searchfor);
        console.log(query);
        console.log('');
        console.log(products.length);
        // ageGroup,isClose,isLifeOfParty,isUseable,isLuxury,isPriceHigh
        searchfor.shift();
        // isClose,isLifeOfParty,isUseable,isLuxury,isPriceHigh
        prodquery = {
            ageGroup: parseInt(query.ageGroup),
            isClose: stringToBool(query.isClose),
            isLifeOfParty: stringToBool(query.isLifeOfParty),
            isUseable: stringToBool(query.isUseable),
            isLuxury: stringToBool(query.isLuxury),
            isPriceHigh: stringToBool(query.isPriceHigh)
        };
        var matchcount = 0;
        renderdata.products.splice(0, renderdata.products.length);
        for(var prodidx = 0;prodidx < products.length;prodidx++) {
            // this if is necessary for use with the mock data.
            // it can be left in when using real data, it's just
            // that it's likely to be redundant as long as the 
            // product query does a "where" on the age group.
            if(prodquery.ageGroup === products[prodidx].ageGroup) {
                for(var idx = 0;idx < searchfor.length;idx++) {
                    //console.log(searchfor[idx] + ' ' + prodquery[searchfor[idx]]);
                    //console.log(searchfor[idx] + ' ' + products[prodidx][searchfor[idx]]);
                    if(prodquery[searchfor[idx]] === products[prodidx][searchfor[idx]])
                        matchcount += 1;
                }
                if(matchcount >= PRODMATCH_MINIMUM) {
                    renderdata.products.push(products[prodidx]);
                }
                matchcount = 0;
            }
        }
    };

    function createProduct(query) {
        // might need some error checking, query
        // should not be {}
        
        // copy the product data from the form
        newprod = {
            productName: query.productName,
            description: query.description,
            ageGroup: parseInt(query.ageGroup),
            isClose: stringToBool(query.isClose),
            isLifeOfParty: stringToBool(query.isLifeOfParty),
            isUseable: stringToBool(query.isUseable),
            isLuxury: stringToBool(query.isLuxury),
            isPriceHigh: stringToBool(query.isPriceHigh),

            ratingCount: 1,
            ratingValue: parseInt(query.ratingValue)
        };
        db.Product.create(newprod)
        .then(function(dbProd) {
            log('createProduct() - product created');
        });
    };

    function prodToGift(newgift) {
        console.log(newgift);
        
        // first copy the gift out of the
        // product list
        var gift = renderdata.products[newgift.index];
        renderdata.gifts.push(JSON.parse(JSON.stringify(gift)));
        // add the new gift to the table
        db.Gift.create({
            productName: newgift.productName,
            description: newgift.description, 
            recipientName: newgift.recipientName,
            UserId: newgift.userid,
            ProductId: newgift.id,
            RecipientId: newgift.recipid
        })
        .then(function(dbGift) {
            log('prodToGift() - gift created');
        });
        // then delete it from the products
        // list
        renderdata.products.splice(newgift.index, 1);
    };

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
