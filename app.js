var 			express 				= require("express"),
				mongoose				= require("mongoose"),
				bodyParser				= require("body-parser"),
				passport				= require("passport"),
				passportLocal			= require("passport-local"),
				flash					= require("connect-flash"),
				seedDB					= require("./seed"),
				allHymns 				= require("./models/combinedhymn"),
				TheChurchHymnal 		= require("./models/hymns"),
				ChildrenSupplement		= require("./models/childsup"),
				User					= require("./models/user"),
				methodOverRide			= require("method-override"),
				keys					= require("./config/keys"),

				allHymnsRoutes			= require("./routes/all_hymns"),
				churchHymnalRoutes		= require("./routes/church_hymnal"),
				authenticationRoutes	= require("./routes/authentication"),
				
				app 					= express();



seedDB();


// setting the environment port and port location. 
app.set ("port", (process.env.PORT || 3000));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(methodOverRide("_method"));
app.set("view engine", "ejs");

app.use(churchHymnalRoutes);
app.use(allHymnsRoutes);
app.use(authenticationRoutes);

console.log(process.env.DATABASEURL);



//Mongo Global Promise
mongoose.Promise = require("bluebird");
mongoose.Promise = global.Promise;
// Connection of DB
mongoose.connect(keys.mongoURI, {})
	.then(function(){
		console.log("MongoDB Connected");
	})
	.catch(err => console.log(err));

//Passport Configuration
app.use(require("express-session")({
	secret: "secret",
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
	res.locals.error 		= req.flash("error");
	res.locals.success 		= req.flash("success");
	next();
})




// Index Route for Home page.
app.get("/", function(req,res){
	res.render("homepage", {currentUser: req.user});
})

//Contact Us ROute
app.get("/contact", function(req, res){
	res.render('contact', {currentUser: req.user });
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