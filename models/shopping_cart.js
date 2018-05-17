module.exports = function (sequelize, DataTypes) {
    var cart = sequelize.define("Cart", {

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

    /*cart.associate = function (models) {
        cart.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
        cart.hasMany(models.Favorite, {
            foreignKey: {
                allowNull: false
            }
        });
    };*/

    return cart;
};