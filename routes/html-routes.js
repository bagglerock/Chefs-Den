var db = require("../models");
var express = require("express");

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
    if(user){
      res.render("index", styleT);
    } else {
      res.render("index", styleF);
    }
  });

  app.get("/profile/", function (req, res) {
    //set variable to the current user
    var userSession = req.user;
    //if current user exists then send to the correct page, otherwise send user back to index page for now
    if (userSession){
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
    } else {
      res.redirect("/");
    }
  });

  app.get("/cart/", function (req, res) {
    //set variable to the current user
    var userSession = req.user;
    //if current user exists then send to the correct page, otherwise send user back to index page for now
    if (userSession){
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

    } else {
      res.render("index");
    }
  });

};