var 			express 	= require("express"),
				app 		= express();


// setting the environment port and port location. 
app.set ("port", (process.env.PORT || 3000));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");



// Index Route/Home Page route.
app.get("/", function(req,res){
	res.render("homepage");
})













//Server listening for request to start server.
app.listen(app.get ("port"), function(){
	console.log("Hymn Server has Started.")
});