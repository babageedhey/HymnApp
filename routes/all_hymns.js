var			express 				= require("express"),
			router					= express.Router(),
			mongoose				= require("mongoose"),
			TheChurchHymnal 		= require("../models/hymns"),
			ChildrenSupplement		= require("../models/childsup"),
			User					= require("../models/user"),
			allHymns 				= require("../models/combinedhymn"),
			passport				= require("passport"),
			passportLocal			= require("passport-local"),
			flash					= require("connect-flash");



mongoose.Promise = require("bluebird");
mongoose.Promise = global.Promise;

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

//Function to verify user login
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
		
	} else {
		req.flash("error", "Username or Password Incorrect!");
		res.redirect("/login");
	}
	
}
/*
//Copy the different Collections to a single one 
TheChurchHymnal.copyTo("allHymns");
ChildrenSupplement.copyTo("allHymns");
allHymns.find({}, function(err, hymns){
	if (err){
		console.log(err)
	} else {
		console.log(hymns)
	}
})

//Function to filter the input search
function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//Search Route
router.get("/search", function(req,res){
	searchParam = req.query.search
	
		if (searchParam) {
		const regex = new RegExp(escapeRegex(searchParam), "gi");
		//Get the searched hymn from the DB
		allHymns.find({title: regex}, function(err, foundHymns){
			if (err){
				console.log(err);
			} else {
				if (!foundHymns.length == 0) {
					res.render("search", {hymnData: foundHymns})
				} else{
					
					res.render("search", {hymnData: foundHymns});
					console.log("No hymn was found");
				}
				
			}
		})
	}
	
})

*/

module.exports = router;