var db = require("../models");
var express = require("express");
var request = require("request");

module.exports = function (app) {

    app.post("/api/favorites/", function (req, res) {
        var newFavorite = {
            
            recipe_img: req.body.image,
            recipe_name: req.body.name,
            recipe_id: req.body.id,
            UserId: req.user.id
        }
        db.Favorite.create(newFavorite).then(function (response) {
            res.json(response);
        })
    })

};