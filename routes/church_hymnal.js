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

//Function to verify user login
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
		
	} else {
		req.flash("error", "Username or Password Incorrect!");
		res.redirect("/login");
	}
	
}

//Index Route for The Church Hymnal Page
router.get("/the_church_hymnal", function(req,res){
	//Get all Hymn data from the DB
	TheChurchHymnal.find({}, function(err, allHymns){
		if (err) {
			req.flash("error", "Oops!!!... Hymns not Found");
			console.log(err.message);
		} else {
			res.render("the_church_hymnal", {hymnData: allHymns})
		}
	})
})

//Index Route for Children Supplement Hymn
router.get("/childrensup", function(req,res){
	//Get all hymns from the children supplement book
	ChildrenSupplement.find({}, function(err, allHymns){
		if (err) {
			req.flash("error", "Oops!!!... Hymns not found");
		}else {
			res.render("childrensup", {hymnData: allHymns})
		}
	})
})

//New -- Route to add new hymn
router.get("/the_church_hymnal/new",isLoggedIn, function(req, res){
	res.render("new");
})
// New -- ROute to add new Hymns to the children supplement book
router.get("/childrensup/new", isLoggedIn, function(req, res){
	res.render("newcs");
})


//Create --Route to Submit new Hymn to DB
router.post("/the_church_hymnal",isLoggedIn, function(req, res){
	//create new Hymn
TheChurchHymnal.create(req.body.hymn, function(err, newHymn){
		if (err){
			//render the form again
			res.render("new");
			console.log(err.message);
		} else {
			newHymn.save();
			res.redirect("/the_church_hymnal");
		}
	})
})
//Create -- Route to Submit the new children supplement book to
router.post("/childrensup", isLoggedIn, function(req, res){
	ChildrenSupplement.create(req.body.hymn, function(err, newHymn){
		if (err){
			res.render("newcs");
		} else {
			newHymn.save();
			res.redirect("/childrensup");
		}
	})
})
//SHOW --Page for the individual hymns
router.get("/the_church_hymnal/:id", function(req, res){

	TheChurchHymnal.findById(req.params.id).exec(function(err, selectedHymn){
		if (err){
			req.flash("error", "Oops!!!... Something went wrong.")
			console.log(err.message);
		} else {
			console.log(selectedHymn);
			res.render("show", {foundHymn: selectedHymn}) 
		}
	})
})
//Show --Page for the individual childsup hymn
router.get("/childrensup/:id", function(req, res){
	ChildrenSupplement.findById(req.params.id).exec(function(err, selectedHymn){
		if (err){
			req.flash("error", "Something went wrong")
			console.log(err.message);
		}else {
			res.render("showcs", {foundHymn: selectedHymn})
		}
	})
})

//Edit Route to Edit hymn content already in the DB.
router.get("/the_church_hymnal/:id/edit", function(req, res){
	TheChurchHymnal.findById(req.params.id, function(err, foundHymn){
		if (err){
			console.log(err.message);
		} else {
			res.render("edit", {hymn: foundHymn});
		}
	})
})
//Edit route for childrensupplement
router.get("/childrensup/:id/edit", function(req,res){
	ChildrenSupplement.findById(req.params.id, function(err, foundHymn){
		if (err){
			console.log(err.message);
		} else {
			res.render("editcs", {hymn: foundHymn});
		}
	})
})

//Update Route - Update the Edited Hymn
router.put("/the_church_hymnal/:id", isLoggedIn, function(req, res){
	TheChurchHymnal.findByIdAndUpdate(req.params.id, req.body.hymn, function(err, updatedHymn){
		if (err){
			console.log(err)
			res.redirect("/edit");
		} else {
			res.redirect("/the_church_hymnal/" +req.params.id); 
		}
	})
})
//Update Route
router.put("/childrensup/:id", isLoggedIn, function(req, res){
	ChildrenSupplement.findByIdAndUpdate(req.params.id, req.body.hymn, function(err, updatedHymn){
		if (err){
			console.log(err.message)
			res.redirect("/editcs");
		} else {
			res.redirect("/childrensup/" +req.params.id);
		}
	})
})

//Delete Route - Delete Hymn from DB
router.delete("/the_church_hymnal/:id", isLoggedIn, function(req, res){
	TheChurchHymnal.findByIdAndRemove(req.params.id, function(err){
		if (err){
			console.log(err.message)
		} else {
			res.redirect("/the_church_hymnal")
		}
	})
})
//Delete
router.delete("/childrensup/:id", isLoggedIn, function(req, res){
	ChildrenSupplement.findByIdAndRemove(req.params.id, function(err){
		if (err){
			conole.log(err.message)
		} else {
			res.redirect("/childrensup")
		}
	})
})

module.exports  = router;