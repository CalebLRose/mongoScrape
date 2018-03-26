var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoScrape");

// ALL Posts
router.get("/", function(req,res) {
	res.redirect("/all");
});

router.get("/all",function(req,res) {
	db.Post.find({})
	.then(function(dbPost){
		res.render("index",{dbPost});
		// res.json(dbPost);
	})
	.catch(function(err){
		res.json(err);
	});
});

// SCRAPE
router.get("/scrape", function(req,res) {
	axios.get("http://www.synthtopia.com/")
	.then(function(response) {
		var $ = cheerio.load(response.data);
		$("article.post").each(function(i,element) {
			var result = {};
			result.title = $(this).children("header.entry-header").children("h1").text();
			result.preview = $(this).children("div.entry-summary").children("p").text();
			// result.date = $(this).children("div.entry-meta").children("span").children("a").children("time").attr("datetime");
			result.photo = $(this).children("header.entry-header").children("div.featured-image").children("a").attr("href");
			result.link = $(this).children("header.entry-header").children("h1.entry-title").children("a").attr("href");	
			console.log(result.date);
			db.Post
			.create(result)
			.then(function(dbPost){
				console.log(dbPost);
			})
			.catch(function(err){
				return res.json(err);
			});
		
		});
		res.send("Scrape Complete");
	});
});

// Seeding the database with older posts. 
router.get("/scrape/:id", function(req,res) {
	axios.get("http://www.synthtopia.com/page/"+req.params.id)
	.then(function(response) {
		var $ = cheerio.load(response.data);
		$("article.post").each(function(i,element) {
			var result = {};
			result.title = $(this).children("header.entry-header").children("h1").text();
			result.preview = $(this).children("div.entry-summary").children("p").text();
			// result.date = $(this).children("div.entry-meta").children("a").children("time").attr("datetime");
			result.photo = $(this).children("header.entry-header").children("div.featured-image").children("a").attr("href");
			result.link = $(this).children("header.entry-header").children("h1.entry-title").children("a").attr("href");	
			db.Post
			.create(result)
			.then(function(dbPost){
				console.log(dbPost);
			})
			.catch(function(err){
				return res.json(err);
			});
		
		});
		res.send("Scrape Complete");
	});
});

module.exports = router;