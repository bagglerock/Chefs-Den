module.exports = function(sequelize, DataTypes) {
    var cart = sequelize.define("Cart", {
        shopping: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        }
    });

    cart.associate = function (models) {
        cart.hasMany(models.Cart, {
            onDelete: "cascade"
        });
        cart.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

  return cart;  
};