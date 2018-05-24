	//==============================
	//html routes for user auth process

	//===============================

	
	// Here we've add our isAuthenticated middleware to this route.
	// If a user who is not logged in tries to access this route they will be redirected to the signup page
	
	
	app.get("/favorites", isAuthenticated, function (req, res) {
		db.favorites.findAll().then(function (favorite) {
			res.render("favorite", user);
        });
    });

      //user profile routes. 







  // might use this soon 



    //To update an user information. 
    app.put("/user/:id", function (req, res) {
        db.User.update(req.body, {
            where: {
              id: req.body.id
            }
          })
          .then(function (user) {
            res.render("favorite", user);
          })
      })
