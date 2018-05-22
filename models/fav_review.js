var userfavs = require("./userfavs");

module.exports = function (sequelize, DataTypes) {
    var Favorite = sequelize.define("Favorite", {
        fav: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        recipe_img: {
            type: DataTypes.STRING,
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        foreignKey: {
            type:DataTypes.STRING
        },
        recipe_id: {
            type: DataTypes.STRING
        }
        // recipe_title: {
        //     type: DataTypes.TEXT
        // }
    });

    Favorite.associate = function (models) {
        Favorite.belongsTo(models.User, {
            // through: {
            //     model: userfavs
            // }
            foreignKey: {
                allowNull: false
            }
        });
    }
    return Favorite;
};