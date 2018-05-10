var db = require("../models");
var request = require("request");

// Create all our routes and set up logic within those routes where required.

module.exports = function (app) {

    app.get("/", function (req, res) {
        request("http://www.omdbapi.com/?t=" + "The Matrix" + "&y=&plot=short&apikey=trilogy",
            function(error, response, body) {
                if(!error && response.statusCode === 200){
                    //console.log(body);
                    var hbsObject = JSON.parse(body);
                    /*var hbsObject = {
                        Title: body.title
                    };*/
                    console.log(hbsObject);
                }


            res.render("index", hbsObject);
            //res.json(hbsObject);
        })
    });
}