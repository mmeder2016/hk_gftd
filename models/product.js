//  product model
// ratingcount and ratingvalue are used for rating
//   a product   

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ageGroup: {
      type: DataTypes.INTEGER,
      defaultalue: 1
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ratingValue: {
      type: DataTypes.FLOAT(5,2),
      defaultValue: 0
    }, 
    isClose: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }, 
    isLifeOfParty: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }, 
    isUseable: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }, 
    isLuxury: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }, 
    isPriceHigh: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }
},
    {
        classMethods: {
            associate: function(models) {
                Product.hasMany(models.Gift);
            }
        }
    });
  return Product;
};
// relation to this table in other tables
// this table is part of the gifts table
