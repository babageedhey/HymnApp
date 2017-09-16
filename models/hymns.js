var 		mongoose =	require("mongoose");


//Hymn Schema
var hymnSchema = new mongoose.Schema({
	number: Number,
	title: String,
	score: String,
	meter: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}, username: String
	},
	tune_name: String
});

//Hymn export
module.exports = mongoose.model("TheChurchHymnal", hymnSchema);

