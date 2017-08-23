var 			express 	= require("express"),
				mongoose	= require("mongoose"),
				bodyParser	= require("body-parser"),
				app 		= express();


// setting the environment port and port location. 
app.set ("port", (process.env.PORT || 3000));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

// Connection to the DB
mongoose.connect("mongodb://<babageedhey>:<nextlevel01>@ds036617.mlab.com:36617/hymndb");

//Hymn Schema
var hymnSchema = new mongoose.Schema({
	title: String,
	image: String,
	meter: String
});

//Hymn Model
var Hymn = mongoose.model("Hymn",hymnSchema);


/*Hymn.create({
	title: "A mighty Fortress",
	image: "/images/rest.jpg",
	meter: "8.8.8.8"
}, function(err, hymn){
	if(err){
		console.log(err);
	} else {
		console.log(hymn);
	}
})
*/




// Index Route/Home Page route.
app.get("/", function(req,res){
	res.render("homepage");
})

app.get("/the_church_hymnal", function(req,res){
	res.render("the_church_hymnal");
})

app.get("/baptist_hymnal", function(req,res){
	res.render("baptist_hymnal");
})

app.get("/cac_hymnal",function(req,res){
	res.render("cac_hymnal");
})

app.get("/the_hymnbook", function(req,res){
	res.render("the_hymnbook");
})

app.get("/chant_book", function(req,res){
	res.render("chant_book");
})











//Server listening for request to start server.
app.listen(app.get ("port"), function(){
	console.log("Hymn Server has Started.")
});