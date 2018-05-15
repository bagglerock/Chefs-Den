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
        }, 
        recipeId: {
            type: DataTypes.INTEGER
        }, 
        ingredientName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        qty: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    cart.associate = function (models) {
        cart.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

  return cart;  
};