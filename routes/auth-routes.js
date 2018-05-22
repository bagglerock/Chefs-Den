require("dotenv").config();

var db = require("../models");
var passport = require("../config/passport");
var request = require("request");
var express = require("express");
var keys = require("../keys");
var path = require("path");

// import formidable
var formidable = require('formidable');
var cloudinary = require('cloudinary');
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

var app_id = keys.yummly.app_id;
var app_key = keys.yummly.app_key;

var cloudname = keys.cloudinary.cloudname;
var cloudapi_key = keys.cloudinary.api_key;
var cloudapi_secret = keys.cloudinary.api_secret;

cloudinary.config({
	cloud_name: cloudname,
	api_key: cloudapi_key,
	api_secret: cloudapi_secret
});



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

	app.post("/api/login", passport.authenticate("local"), function (req, res) {
		//So we're sending back the route to the favorite page because the redirect will happen on the front end
		// They won't get this or even be able to access this page if they aren't authed
		var data = req.user.dataValues
		res.json(data);
	});

	//route for creating a user and adding the user to the database
	app.post("/api/user", function (req, res) {

		var form = new formidable.IncomingForm();

		form.parse(req, function (err, fields, files) {
			console.log(fields);
			console.log(files.photo);

			if (files.photo) {
				// upload file to cloudinary, which'll return an object for the new image
				cloudinary.uploader.upload(files.photo.path, function (result) {
					console.log(result);
					db.User.create({
						userName: fields.userName,
						email: fields.email,
						password: fields.password,
						photo: result.secure_url
					}).then(function (userInfo) {
						// Upon successful signup, log user in
						req.login(userInfo, function (err) {
							if (err) {
								console.log(err)
								return res.status(422).json(err);
							}
							console.log(req.user);
							res.json("favorite", userInfo);
						});
					}).catch(function (err) {
						console.log(err)
						res.status(422).json(err);
					});
				});
			} else {
				db.User.create({
					userName: fields.userName,
					email: fields.email,
					password: fields.password,
				}).then(function (userInfo) {
					// Upon successful signup, log user in
					req.login(userInfo, function (err) {
						if (err) {
							console.log(err)
							return res.status(422).json(err);
						}
						console.log(JSON.stringify(userInfo));
						var hbsInfo = {
							userName: (JSON.stringify(userInfo)).userName,
							email: (JSON.stringify(userInfo)).email,
							about: (JSON.stringify(userInfo)).about
						}
						return res.render("favorite", hbsInfo);
					});
				}).catch(function (err) {
					console.log(err);
					res.status(422).json(err);
				});
			}
		});

	});

	// Route for logging user out
	app.get("/logout", function (req, res) {
		req.logout();
		res.redirect("/");
	});

	app.get("/api/user_data", function (req, res) {
		if (!req.user) {
			// The user is not logged in, send back an empty object
			res.json({});
		} else {
			// Otherwise send back the user's email and id
			// Sending back a password, even a hashed password, isn't a good idea
			res.json({
				email: req.user.email,
				id: req.user.id,
				photo: req.user.photo
			});
		}
	});

	//==============================
	//html routes for user auth process

	//===============================

	app.get("/", function (req, res) {
		// If the user already has already logged in, send them to the favorite page
		if (req.user) {
			return res.redirect("/favorite");
		}
		res.render("index");
	});

	app.get("/login", function (req, res) {
		// If the user already has an account send them to the favorite page
		if (req.user) {
			return res.redirect("/favorite");
		}
		res.render("index");
	});

	// Here we've add our isAuthenticated middleware to this route.
	// If a user who is not logged in tries to access this route they will be redirected to the signup page
	app.get("/favorites", isAuthenticated, function (req, res) {
		db.favorites.findAll().then(function (favorite) {
			res.render("favorite", user);
		});

	});

}