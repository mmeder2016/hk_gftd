/* ************************************************************************ */
/*
    Sequelize Database Connection and Model Management                                   
*/
'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];

/*
    Contains Sequelize references to each of the tables. For each
    file within the folder a database reference will be created.
*/
var db = {};

/*
    Based on our run-time environment choose the appropriate 
    parameters for connecting to the database
*/
if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/*
    Find every model definiition that shares a folder with this
    file and save the model to our table list
*/
fs.readdirSync(__dirname).filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

/*
*/
Object.keys(db).forEach(function(modelName) {
    console.log('------- modelName = ' + modelName);
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
