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


    

    return cart;
};