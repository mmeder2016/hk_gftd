// Gifts models  gifts are products that are chosen
//    for a recipient
module.exports = function(sequelize, DataTypes) {
    var Gift = sequelize.define("Gift", {
        productName: {
        type: DataTypes.STRING,
        allowNull: false
        },
        description: {
        type: DataTypes.STRING,
        allowNull: false
        },
        recipientName: {
            type: DataTypes.STRING,
            allowNull: false
        }
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
        }    });
  return Gift;
};