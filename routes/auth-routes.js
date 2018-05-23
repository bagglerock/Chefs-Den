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

			if (files.photo) {
				// upload file to cloudinary, which'll return an object for the new image
				cloudinary.uploader.upload(files.photo.path, function (result) {
					db.User.create({
						userName: fields.userName,
						email: fields.email,
						password: fields.password,
						img_url: result.secure_url, 
						about: fields.about
					}).then(function (userInfo) {
						// Upon successful signup, log user in
						req.login(userInfo, function (err) {
							if (err) {
								console.log(err)
								return res.status(422).json(err);
							}
							res.render("profile", userInfo);
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
					about: fields.about
				}).then(function (userInfo) {
					// Upon successful signup, log user in
					req.login(userInfo, function (err) {
						if (err) {
							console.log(err)
							return res.status(422).json(err);
						}
						var hbsInfo = {
							userName: (JSON.stringify(userInfo)).userName,
							email: (JSON.stringify(userInfo)).email,
							about: (JSON.stringify(userInfo)).about
						}
						return res.render("profile", hbsInfo);
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
		res.render("index");
	});



}