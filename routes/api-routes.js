var db = require("../models");
var request = require("request");

var app_id = "3f2c9a8d";
var app_key = "e92f49e132a104a2da4588b89f9f4eea";

// Create all our routes and set up logic within those routes where required.

module.exports = function (app) {

    app.get("/", function (req, res) {
        request("http://api.yummly.com/v1/api/recipes?_app_id=" + app_id + "&_app_key=" + app_key + "&chicken",
            function(error, response, body) {
                if(!error && response.statusCode === 200){
                    //  have to parse the response to JSON
                    var hbsObject = JSON.parse(body);
                }
            res.render("index", hbsObject);
        })
    });
}