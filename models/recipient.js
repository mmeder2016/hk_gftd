// Recipient model
//  Used to associate names with lists of gifts


module.exports = function(sequelize, DataTypes) {
    var Recipient = sequelize.define("Recipient", {
        recipientName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        classMethods: {
            associate: function(models) {
                Recipient.hasMany(models.Gift);
            }
        }
    });
    return Recipient;
};