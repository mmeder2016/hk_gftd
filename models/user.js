// User models


module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Recipient);
            }
        },
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Gift);
            }
        }
    });
    return User;
};