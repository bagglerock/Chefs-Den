module.exports = function (sequelize, DataTypes) {
    var userfavs = sequelize.define("userfavs", {
        isInCart: {
            type: DataTypes.BOOLEAN,
            default: false
        }
    });
    return userfavs;
};