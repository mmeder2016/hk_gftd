/* ************************************************************************ */
/*
    Gftd View - survey and survey-match results are rendered here.                                          
*/
//exports.gftdview = (function() {
module.exports = (function() {

    // get the name of this file, used for logging
    var srcFile = getThisFileName();

    gftdview = {};

    /* ******************************************************************** */
    /*
        Render and respond with an index page with the list of gifts
    */
    gftdview.renderSurvey = function(res, appdata) {
        console.log(srcFile+' - renderSurvey() - rendering page now');
        console.log(srcFile+' - renderSurvey() - user name  = '+appdata.unid.userName);
        console.log(srcFile+' - renderSurvey() - user rowid = '+appdata.unid.id);
        var renderData = {
            data: JSON.parse(JSON.stringify(appdata))
        };
        res.render('survey', renderData);
    };

    /* ******************************************************************** */
    /*
        Render and respond with an index page with the list of gifts
    */
    gftdview.renderResults = function(res, appdata) {
        console.log(srcFile+' - renderResults() - rendering page now');
        console.log(srcFile+' - renderResults() - user name  = '+appdata.unid.userName);
        console.log(srcFile+' - renderResults() - user rowid = '+appdata.unid.userid);
        var renderData = {
            data: JSON.parse(JSON.stringify(appdata))
        };
        res.render('results', renderData);
    };

    /*
        Render the product data entry form
    */
    gftdview.renderNewProduct = function(res) {
        console.log(srcFile+' - renderNewProduct() - rendering page now');
        res.render('newproduct', {});
    };


    /* ******************************************************************** */
    /*
        "Fix" the value of a variable to 0 if it's undefined
    */
    function render_var(avar) {
        if(avar === undefined) return 0;
        else return avar;
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

    return gftdview;
})();


