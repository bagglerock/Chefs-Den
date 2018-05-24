require("dotenv").config();

var db = require("../models");
var passport = require("../config/passport");
var express = require("express");
var keys = require("../keys");
var path = require("path");

// import formidable
var formidable = require('formidable');
var cloudinary = require('cloudinary');

var cloudname = keys.cloudinary.cloudname;
var cloudapi_key = keys.cloudinary.api_key;
var cloudapi_secret = keys.cloudinary.api_secret;

cloudinary.config({
	cloud_name: cloudname,
	api_key: cloudapi_key,
	api_secret: cloudapi_secret
});

module.exports = function (app) {

	// Route for logging user out
	app.get("/logout", function (req, res) {
		req.logout();
		res.render("index");
	});

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

	//Route to update the user
	app.put("/api/user/:id", function (req, res) {
        db.User.update(req.body, {
            where: {
              id: req.body.id
            }
          })
          .then(function (user) {
            res.redirect("/profile/");
          })
      })


}