var 			express 				= require("express"),
				mongoose				= require("mongoose"),
				bodyParser				= require("body-parser"),
				passport				= require("passport"),
				passportLocal			= require("passport-local"),
				seedDB					= require("./seed"),
				TheChurchHymnal 		= require("./models/hymns"),
				User					= require("./models/user"),
				methodOverRide			= require("method-override"),
				
				app 					= express();



seedDB();


// setting the environment port and port location. 
app.set ("port", (process.env.PORT || 3000));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverRide("_method"));
app.set("view engine", "ejs");




// Connection to the DB cloud
//mongoose.connect("mongodb://<babageedhey>:<nextlevel01>@ds036617.mlab.com:36617/hymndb");

//Connection to DB Locally
mongoose.Promise = require("bluebird");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/hymndb", { useMongoClient: true});



//Passport Configuration
app.use(require("express-session")({
	secret: "This is gonna be so successful.",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middlewear for login logic
app.use(function(req, res, next){
	res.locals.currentUser	= req.user;
	next();
})

// Index Route for Home page.
app.get("/", function(req,res){
	res.render("homepage", {currentUser: req.user});
})

//Index Route for The Church Hymnal Page
app.get("/the_church_hymnal", function(req,res){
	//Get all Hymn data from the DB
	TheChurchHymnal.find({}, function(err, allHymns){
		if (err) {
			console.log(err)
		} else {
			res.render("the_church_hymnal", {hymnData: allHymns})
		}
	})
})

//New -- Route form for new hymns
app.get("/the_church_hymnal/new",isLoggedIn, function(req, res){
	res.render("new");
})

//Create --Route to Submit form to
app.post("/the_church_hymnal", isLoggedIn, function(req, res){
	//create new Hymn
TheChurchHymnal.create(req.body.hymn, function(err, newHymn){
		if (err){
			//render the form again
			res.render("new")
			console.log(err)
		} else {
			newHymn.save();
			res.redirect("/the_church_hymnal");
		}
	})
})
//SHOW --Page for the individual hymns
app.get("/the_church_hymnal/:id", function(req, res){

	TheChurchHymnal.findById(req.params.id).exec(function(err, selectedHymn){
		if (err){
			console.log(err)
		} else {
			console.log(selectedHymn);
			res.render("show", {foundHymn: selectedHymn}) 
		}
	})
})

//Edit Route to Edit hymn content already in the DB.
app.get("/the_church_hymnal/:id/edit", function(req, res){
	TheChurchHymnal.findById(req.params.id, function(err, foundHymn){
		if (err){
			console.log(err)
		} else {
			res.render("edit", {hymn: foundHymn});
		}
	})
})

//Update Route - Update the Edited Hymn
app.put("/the_church_hymnal/:id", isLoggedIn, function(req, res){
	TheChurchHymnal.findByIdAndUpdate(req.params.id, req.body.hymn, function(err, updatedHymn){
		if (err){
			console.log(err)
			res.redirect("/edit");
		} else {
			res.redirect("/the_church_hymnal/" +req.params.id); 
		}
	})
})

//Delete Route - Delete Hymn from DB
app.delete("/the_church_hymnal/:id", isLoggedIn, function(req, res){
	TheChurchHymnal.findByIdAndRemove(req.params.id, function(err){
		if (err){
			console.log(err)
		} else {
			res.redirect("/the_church_hymnal")
		}
	})
})
//Index Route for Baptist hymnal page
app.get("/baptist_hymnal", function(req,res){
	//Get all Hymn data from the DB
	TheChurchHymnal.find({}, function(err, allHymns){
		if (err) {
			console.log(err)
		} else {
			res.render("baptist_hymnal", {hymnData: allHymns});
		}
	})
	
})


//Index Route for CAC Hymnal page
app.get("/cac_hymnal",function(req,res){
	res.render("cac_hymnal");
})


//Index Route for The hymnal Book
app.get("/the_hymnbook", function(req,res){
	res.render("the_hymnbook");
})


//Index Route for Chant book
app.get("/chant_book", function(req,res){
	res.render("chant_book");
})

//Authentication Routes

//Show Register form
app.get("/register", function(req, res){
	res.render("register");
})

//handle register post
app.post("/register", function(req, res){
	var newUser = new User ({username: req.body.username});
	console.log(req.body.username)
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err)
			return res.render("/register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		})
	})
})
//Show Login Form
app.get("/login", function(req, res){
	res.render("login");
})

//Handles the login route
app.post("/login", passport.authenticate("local", 
	{successRedirect: "/", failureRedirect: "/login"}), function(req, res){
	console.log(username);
})

//Logout Route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
})

//Function to verify user login
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//Server listening for request to start server.
app.listen(app.get ("port"), function(){
	console.log("Hymn Server has Started.")
});