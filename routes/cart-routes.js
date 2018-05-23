var db = require("../models");
var express = require("express");
var request = require("request");

module.exports = function (app) {

    app.post("/api/cart/", function (req, res) {
        var user = req.user;
        console.log(user);
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