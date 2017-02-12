var passportLocalSequelize = require('passport-local-sequelize');

module.exports = function(sequelize, DataTypes) {
    var Login = sequelize.define('Login', {
        username: DataTypes.STRING,
        hash: {
            type: DataTypes.TEXT
        },
        salt: {
            type: DataTypes.STRING
        }
    });

    passportLocalSequelize.attachToUser(Login, {
        usernameField: 'username',
        hashField: 'hash',
        saltField: 'salt'
    });

    return Login;
}