var userfavs = require("./userfavs");

module.exports = function (sequelize, DataTypes) {
    var Favorite = sequelize.define("Favorite", {
        recipe_img: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        recipe_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recipe_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Favorite.associate = function (models) {
        Favorite.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Favorite;
};