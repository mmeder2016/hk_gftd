// Gifts models  gifts are products that are chosen
//    for a recipient
module.exports = function(sequelize, DataTypes) {
    var Gift = sequelize.define("Gift", {
    },
    {
        classMethods: {
            associate: function(models) {
                Gift.belongsTo(models.Product);
            }
        },
        classMethods: {
            associate: function(models) {
                Gift.belongsTo(models.Recipient);
            }
        },
        classMethods: {
            associate: function(models) {
                Gift.belongsTo(models.User);
            }
        }
    });
  return Gift;
};