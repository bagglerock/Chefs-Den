require("dotenv").config();

var db = require("../models");
var request = require("request");
var keys = require("../keys");

var app_id = keys.yummly.app_id;
var app_key = keys.yummly.app_key;


function fixImage(resObject) {
  if(resObject){
      for (var i = 0; i < resObject.matches.length; i++) {
        if (resObject.matches[i].smallImageUrls) {
          var img = resObject.matches[i].smallImageUrls[0];
          resObject.matches[i].smallImageUrls = img.slice(0, -2) + "300";
          resObject.matches[i].totalTimeInSeconds = resObject.matches[i].totalTimeInSeconds / 60;
        }
      }
      return resObject;
  } else {
    return null;
  }
}

module.exports = function (app) {

  //route for creating a user and adding the user to the database
  app.post("/api/user", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      img_url: req.body.img_url,
      created_at: req.body.created_at
    }).then(function (results) {
      // `results` here would be the newly created user
      console.log("added user");
    });
  });

  app.post("/recipes/", function (req, res) {
    //String
    var query = req.body.query;
    var ingredients = req.body.ingredients;
    var cuisines = req.body.cuisines;
    var diets = req.body.diets;
    var intolerances = req.body.intolerances;

    var queryURL = "http://api.yummly.com/v1/api/recipes?&maxResult=20";

    queryURL += "&_app_id=" + app_id;
    queryURL += "&_app_key=" + app_key;

    if (query) {
      queryURL += "&q=" + query;
    }

    if (ingredients && ingredients.length > 0) {
      var ingredientsString = "";
      for (var i = 0; i < ingredients.length; i++) {
        ingredientsString += "&allowedIngredient[]=" + ingredients[i];
      }
      queryURL += ingredientsString;
    }

    if (cuisines && cuisines.length > 0) {
      var cuisinesString = "";
      for (var i = 0; i < cuisines.length; i++) {
        cuisinesString += "&allowedCuisine[]=" + cuisines[i];
      }
      queryURL += cuisinesString;
    }

    if (diets && diets.length > 0) {
      var dietsString = "";
      for (var i = 0; i < diets.length; i++) {
        dietsString += "&allowedDiet[]=" + diets[i];
      }
      queryURL += dietsString;
    }

    if (intolerances && intolerances.length > 0) {
      var intolerancesString = "";
      for (var i = 0; i < intolerances.length; i++) {
        intolerancesString += "&allowedAllergy[]=" + intolerances[i];
      }
      queryURL += intolerancesString;
    }

    console.log(queryURL);
    request(queryURL, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //  have to parse the response to JSON
        var response = JSON.parse(body);
      }
      response = fixImage(response);
      res.send(response);

      if (!response) {
        res.send("0 matches found");
      }
    })
  });

  app.get("/recipes/:id", function (req, res) {
    var recipeId = req.params.id;
    request("http://api.yummly.com/v1/api/recipe/" + recipeId + "?_app_id=" + app_id + "&_app_key=" + app_key,
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          //  have to parse the response to JSON
          var recipe = JSON.parse(body);
        }
        res.send(recipe);
      })
  });
}