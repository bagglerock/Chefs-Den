var express = require("express");
var bodyParser = require("body-parser");
var db = require("./models");
var session = require("express-session");
var passport = require("./config/passport");
var path = require("path");

//  Set up express app
//=========================================
var app = express();
var PORT = process.env.PORT || 3000;
//=========================================


//  Set up express app for data parsing
//=========================================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// Static directory
app.use(express.static(path.join(__dirname, "./public")));
//app.use(express.static("public"));

//=========================================
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//  Set up handlebars
//=========================================
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//=========================================


// Import routes and give the server access to them.
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/cart-routes.js")(app);
require("./routes/auth-routes.js")(app);
require("./routes/favorites-routes.js")(app);

// Start our server so that it can begin listening to client requests.
db.sequelize.sync({}).then(function(){
  app.listen(PORT, function() {
    console.log("Listening to port %s", PORT);

  });
});