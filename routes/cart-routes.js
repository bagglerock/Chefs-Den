var db = require("../models");
var express = require("express");

module.exports = function (app) {

    app.post("/api/cart/", function (req, res) {
        var user = req.user;
        var newCartItem = {
            recipeId: req.body.id,
            ingredientName: req.body.name,
            qty: req.body.qty,
            UserId: user.id
        }
        db.Cart.create(newCartItem).then(function (newItem) {
            res.json(newItem);
            console.log(newItem);
        })
    })

};