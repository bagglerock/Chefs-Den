require("dotenv").config();

const db = require("../models");
const request = require("request");
const keys = require("../keys");

const app_id = keys.yummly.app_id;
const app_key = keys.yummly.app_key;


function fixImage(resObject) {
  if (resObject.statusCode !== 500) {
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
    console.log("Error: Status Code" + resObject.statusCode)
    return resObject;
  }
}

function makeQueryURL(reqBody) {

  const endpoint = "http://api.yummly.com/v1/api/recipes?";

  let queryURL = endpoint;
  queryURL += "&_app_id=" + app_id + "&_app_key=" + app_key;

  if (reqBody.query && reqBody.query !== "") {
    queryURL += "&q=" + reqBody.query;
  }

  if (reqBody.ingredients && reqBody.ingredients.length > 0) {
    for (let i = 0; i < reqBody.ingredients.length; i++) {
      queryURL += "&allowedIngredient[]=" + reqBody.ingredients[i];
    }
  }

  if (reqBody.cuisines && reqBody.cuisines.length > 0) {
    for (let i = 0; i < reqBody.cuisines.length; i++) {
      queryURL += "&allowedCuisine[]=" + reqBody.cuisines[i];
    }
  }

  if (reqBody.diets && reqBody.diets.length > 0) {
    for (let i = 0; i < reqBody.diets.length; i++) {
      queryURL += "&allowedDiet[]=" + reqBody.diets[i];
    }
  }

  if (reqBody.intolerances && reqBody.intolerances.length > 0) {
    for (let i = 0; i < reqBody.intolerances.length; i++) {
      queryURL += "&allowedAllergy[]=" + reqBody.intolerances[i];
    }
  }
  return queryURL;
}


module.exports = function (app) {

  app.get("/recipes/:id", function (req, res) {
    var recipeId = req.params.id;
    var user = req.user;
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
        if (user) {
          recipe.loggedStatus = true;
        } else {
          recipe.loggedStatus = false;
        }
        res.send(recipe);
      }
    );
  });


  //this is the route the ajax request will hit to make a request to the api for recipes
  app.post("/recipes/", function (req, res) {
    const reqBody = req.body;
    let queryURL = makeQueryURL(reqBody);

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




}