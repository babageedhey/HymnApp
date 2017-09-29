var 			express 				= require("express"),
				mongoose				= require("mongoose"),
				bodyParser				= require("body-parser"),
				passport				= require("passport"),
				passportLocal			= require("passport-local"),
				flash					= require("connect-flash"),
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
app.use(flash());
app.use(methodOverRide("_method"));
app.set("view engine", "ejs");

console.log(process.env.DATABASEURL);



//Connection to DB Locally
mongoose.Promise = require("bluebird");
mongoose.Promise = global.Promise;
// Connection to the DB cloud
mongoose.connect("mongodb://babageedhey:nextlevel01@ds036617.mlab.com:36617/hymndb", {useMongoClient: true});

//mongoose.connect("mongodb://localhost/hymndb", {useMongoClient: true});



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

//Function to verify user login
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
		
	} else {
		req.flash("error", "Username or Password Incorrect!");
		res.redirect("/login");
	}
	
}

//Middlewear for login logic
app.use(function(req, res, next){
	res.locals.currentUser	= req.user;
	res.locals.error 		= req.flash("error");
	res.locals.success 		= req.flash("success");
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
			req.flash("error", "Oops!!!... Hymns not Found");
			console.log(err.message);
		} else {
			res.render("the_church_hymnal", {hymnData: allHymns})
		}
	})
})

//New -- Route to add new hymn
app.get("/the_church_hymnal/new",isLoggedIn, function(req, res){
	res.render("new");
})

//Create --Route to Submit new Hymn to DB
app.post("/the_church_hymnal",isLoggedIn, function(req, res){
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
//SHOW --Page for the individual hymns
app.get("/the_church_hymnal/:id", function(req, res){

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

//Show Register form
app.get("/register", function(req, res){
	res.render("register");
})

//handle register post
app.post("/register", function(req, res){
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



//Server listening for request to start server.
app.listen(app.get ("port"), function(){
	console.log("Hymn Server has Started.")
});


//Other Hymns Routes
//Index Route for Baptist hymnal page
app.get("/baptist_hymnal", function(req,res){
	res.render("baptist_hymnal");
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