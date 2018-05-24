var db = require("../models");
var express = require("express");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads the home page with search item
  app.get("/", function (req, res) {
    var user = req.user;
    var style = "style=" + "\"" + "display:block;" + "\"";
    var styleT = {
      userTrue: style
    }
    var styleF = {
      userFalse: style
    }
    if (user) {
      res.render("index", styleT);
    } else {
      res.render("index", styleF);
    }
  });

  app.get("/profile/", isAuthenticated, function (req, res) {
    //set variable to the current user
    var userSession = req.user;
    var user = {
      where: {
        id: userSession.id
      },
      include: [db.Favorite]
    }
    db.User.findOne(user).then(function (data) {
      var hbsObject = {
        data: data.dataValues,
        favoritesData: data.Favorites
      }
      res.render("profile", hbsObject);
    })
  });

  app.get("/cart/", isAuthenticated, function (req, res) {
    //set variable to the current user
    var userSession = req.user;

      var user = {
        where: {
          id: userSession.id
        },
        include: [db.Cart]
      }
      db.User.findOne(user).then(function (data) {
        console.log(data);
        var hbsObject = {
          cartItems: data.Carts
        };
        res.render("cart", hbsObject);
      })
  });

};