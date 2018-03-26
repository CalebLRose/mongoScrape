var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
var exphbs = require("express-handlebars");
// app.engine("handlebars",exphbs({defaultLayout:"main"}));
// app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoScrape");

// SCRAPE
app.get("/scrape", function(req,res) {
	axios.get("http://www.synthtopia.com/")
	.then(function(response) {
		var $ = cheerio.load(response.data);
		$("article.post").each(function(i,element) {
			var result = {};
			result.title = $(this).children("header.entry-header").children("h1").text();
			result.preview = $(this).children("div.entry-summary").children("p").text();
			result.photo = $(this).children("header.entry-header").children("div.featured-image").children("a").attr("href");
			result.link = $(this).children("header.entry-header").children("a").attr("href");	
			console.log(result);
			console.log("\n----------------\n");
			// db.Post
			// .create(result)
			// .then(function(dbPost){
			// 	console.log(dbPost);
			// })
			// .catch(function(err){
			// 	return res.json(err);
			// });
		});
		res.send("Scrape Complete");
	});
});

app.listen(PORT,function() {
	console.log("app running on port " + PORT);
});