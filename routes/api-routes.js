var db = require("../models");
var request = require("request");

var app_id = "3f2c9a8d";
var app_key = "e92f49e132a104a2da4588b89f9f4eea";

function fixImage(object) {
  for (var i = 0; i < hbsObject.matches.length; i++) {
    var img = hbsObject.matches[i].smallImageUrls[0];
    img = img.slice(0, -2);
    img = img + "600";
    hbsObject.matches[i].smallImageUrls = {
      smallImageUrls: img
    };
  }
}


module.exports = function (app) {

  //route for creating a user and adding the user to the database
  app.post("/api/user", function (req, res) {
    console.log(req.body)
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
     // img_url: req.body.img_url,
      created_at: req.body.created_at
    }).then(function (results) {
      // `results` here would be the newly created user
      console.log("added user");

    });
  });

  app.post("/api/recipes/", function (req, res) {
    var query = req.body.query;
    request("http://api.yummly.com/v1/api/recipes?_app_id=" + app_id + "&_app_key=" + app_key + "&q=" + query,
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          //  have to parse the response to JSON
          var hbsObject = JSON.parse(body);
        }
        //  this is some weird chopping up of the image URL since it only comes as a small size and there arent any options to change it
        //  get rid of the "90" and then add the correct size in the index.handlebars.... a little hacky but whatever
        fixImage(hbsObject);
        //console.log(hbsObject);
        res.send(hbsObject);
      })

  });
}