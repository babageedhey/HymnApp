var			express 				= require("express"),
			router					= express.Router(),
			TheChurchHymnal 		= require("../models/hymns"),
			ChildrenSupplement		= require("../models/childsup"),
			User					= require("../models/user"),
			passport				= require("passport"),
			passportLocal			= require("passport-local"),
			flash					= require("connect-flash");




//Passport Configuration
router.use(require("express-session")({
	secret: "This is gonna be so successful.",
	resave: false,
	saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middlewear for login logic
router.use(function(req, res, next){
	res.locals.currentUser	= req.user;
	res.locals.error 		= req.flash("error");
	res.locals.success 		= req.flash("success");
	next();
})

// Index Route for Home page.
router.get("/", function(req,res){
	res.render("homepage", {currentUser: req.user});
})

//Show Register form
router.get("/register", function(req, res){
	res.render("register");
})

//handle register post
router.post("/register", function(req, res){
	var newUser = new User ({username: req.body.username});
	
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err.message);
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome " + user.username);
			res.redirect("/");
			
		})
	})
})
//Show Login Form
router.get("/login", function(req, res){
	res.render("login");
})

//Handles the login route
router.post("/login", passport.authenticate("local", 
	{successRedirect: "/", failureRedirect: "/login"}), function(req, res){
	console.log(username);
})

//Logout Route
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");	
})
//Function to verify user login
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
		
	} else {
		req.flash("error", "Username or Password Incorrect!");
		res.redirect("/login");
	}
	
}

module.exports = router;