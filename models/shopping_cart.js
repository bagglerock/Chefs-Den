var userfavs = require("./userfavs");

module.exports = function (sequelize, DataTypes) {
    var Cart = sequelize.define("Cart", {
        recipeId: {
            type: DataTypes.STRING
        }, 
        ingredientName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        qty: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    Cart.associate = function (models) {
        Cart.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Cart;
};