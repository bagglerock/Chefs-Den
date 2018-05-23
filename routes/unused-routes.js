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

      //user profile routes. 

  //to show the user when user clicks on show profile. 
  app.get("/user/:id", function (req, res) {

    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (user) {
      console.log(user.dataValues);
      var data = user.dataValues;
      var hbsObject = {
        userName: data.userName,
        email: data.email,
        img_url: data.img_url,
        password: data.password
      }
      res.render("favorite", hbsObject);
    });
  });



    //Route to deleting a user.
    app.delete("/api/user/:id", function (req, res) {
        db.User.destroy({
          where: {
            id: req.params.id
          }
        }).then(function (user) {
          res.json("id: " + res.insertId);
        });
      })

        //route for displaying favorites page
  /*
  app.get("api/favorites", function (req, res) {
    db.Favorite.findAll({})
      .then(function (dbFavorite) {
        res.json(dbFavorite);
      });

  });
  */



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


      app.get("/cart", function (req, res) {
        db.Cart.findAll().then(function (cartItems) {
          console.log(cartItems);
          var hbsObject = {
            cartItems: cartItems
          };
          res.render("cart", hbsObject);
        })
      });

        //to delete a favorited item
  /*
  app.delete("/api/favorites/:id", function (req, res) {
    db.Favorite.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbFavorite) {
      res.json(dbFavorite);
    });
  });
  */
    
