require("dotenv").config();

var db = require("../models");
var passport = require("../config/passport");
var request = require("request");
var keys = require("../keys");

// import formidable
var formidable = require('formidable');
var cloudinary = require('cloudinary');

var app_id = keys.yummly.app_id;
var app_key = keys.yummly.app_key;

var cloudname = keys.cloudinary.cloudname;
var cloudapi_key = keys.cloudinary.api_key;
var cloudapi_secret = keys.cloudinary.api_secret;


function fixImage(resObject) {
  if (resObject) {
    for (var i = 0; i < resObject.matches.length; i++) {
      if (resObject.matches[i].smallImageUrls) {
        var img = resObject.matches[i].smallImageUrls[0];
        resObject.matches[i].smallImageUrls = img.slice(0, -2) + "300";
        resObject.matches[i].totalTimeInSeconds =
          resObject.matches[i].totalTimeInSeconds / 60;
      }
    }
    return resObject;
  } else {
    return null;
  }
}

module.exports = function (app) {

  //this is the route the ajax request will hit to make a request to the api for recipes
  app.post("/recipes/", function (req, res) {

    //query to the api
    var queryURL = "http://api.yummly.com/v1/api/recipes?&_app_id=" + app_id + "&_app_key=" + app_key;

    //if there is query item(for eg: yam fries)
    var query = req.body.query;
    if (query) {
      queryURL += "&q=" + query;
    }

    //Search based on ingredients for the ingredients keyed in 
    function searchIngredients() {
      var ingredients = req.body.ingredients;
      if (ingredients && ingredients.length > 0) {
        //go through the array and construct each of the ampersand queries
        for (var i = 0; i < ingredients.length; i++) {
          queryURL += "&allowedIngredient[]=" + ingredients[i];
        }
      }
      //once the ingredients are added to the queryURL, move to add cuisines
      includeCuisines();
    }

    //search based on cuisines if the cuisine filters were selected
    function includeCuisines() {
      var cuisines = req.body.cuisines;
      if (cuisines && cuisines.length > 0) {
        //go through the array and construct each of the ampersand allowedCuisines queries
        for (var i = 0; i < cuisines.length; i++) {
          queryURL += "&allowedCuisine[]=" + cuisines[i];
        }
        //once the cuisines are added to the queryURL, move on to add Diets
        includeDiet();
      }
    }

    //search based on Diets if the diet filters were selected
    function includeDiet() {
      var diets = req.body.diets;
      if (diets && diets.length > 0) {
        for (var i = 0; i < diets.length; i++) {
          queryURL += "&allowedDiet[]=" + diets[i];
        }
      }
      //once the diets are added to the queryURL, move on to exclude the recipes with allergy items. This is done by adding the allowedAllergy to queryURL 
      excludeAllergies();
    }

    function excludeAllergies() {
      var intolerances = req.body.intolerances;
      if (intolerances && intolerances.length > 0) {
        for (var i = 0; i < intolerances.length; i++) {
          queryURL += "&allowedAllergy[]=" + intolerances[i];
        }
      }
    }

    //Calling the function that begins the building of queryURL. This basically search for ingredients.
    searchIngredients();
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
    });
  });

  app.get("/recipes/:id", function (req, res) {
    var recipeId = req.params.id;
    request(
      "http://api.yummly.com/v1/api/recipe/" +
      recipeId +
      "?_app_id=" +
      app_id +
      "&_app_key=" +
      app_key,
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          //  have to parse the response to JSON
          var recipe = JSON.parse(body);
        }
        res.send(recipe);
      }
    );
  });
  
  


}