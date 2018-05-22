var db = require("../models");
var express = require("express");
var request = require("request");

module.exports = function (app) {

    app.post("/api/cart/", function (req, res) {
        var newCartItem = {
            recipeId: req.body.id,
            ingredientName: req.body.name,
            qty: req.body.qty
        }
        db.Cart.create(newCartItem).then(function (newItem) {
            res.json(newItem);
        })
    })

};