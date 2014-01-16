var shepherd = require("shepherd");
var fs = require("fs");
var cheerio = require("cheerio");
var mongoose = require('mongoose');

// function to initialize the Mongodb database
function initializeMongodb() {
	var db = mongoose.connection;
	db.on('error', console.error);
	
	mongoose.connect('mongodb://localhost/med17');

	var postSchema = new mongoose.Schema({
		title: { type: String },
		postLink: { type: String },
		postLastUpdated: { type: Date },
		snippetText: { type: String }
		});
	mediumPosts = mongoose.model('mediumPosts', postSchema);
} // end of function initializeMongodb

//function to save data to the Mongodb database
function saveToDb(newTitle, newPostLink,newPostLastUpdated,newSnippet ) {
	console.log('newPostLastUpdated='+newPostLastUpdated);
	
	var post = new mediumPosts({
		title: newTitle,
		postLink: newPostLink,
		postLastUpdated: new Date(newPostLastUpdated),
		snippetText:	newSnippet
	});

	mediumPosts.findOne({ title: newTitle }, function(err, article) {
		if(article) {
			console.log("post already exists="+article); 
		}
		else {
			console.log("post does not exist");	
			
			post.save(function(err, post) {
				if	(err) 
					console.log(err);
				else {
					console.log(post);
					//console.log("entered post.save");
				}
			});
		}
	});

} // end of function saveToDb
 
function getFeed(mediumFeedUrl) {
	var data = fs.readFileSync(mediumFeedUrl, "utf8");
	var $ = cheerio.load(data);

	$(".entry").each(function() {
		var link = $(this).find('a');
		var text = link.text();
		var href = link.attr("href");

		var	lastUpdated = $(this).find('.lastUpdated').text();
		var snippet	=	$(this).find('.medium-feed-snippet').text();
		//console.log("calling saveToDB...");
		saveToDb(text,href,lastUpdated,snippet);
	});

	console.log("*************************************************************************");

} // end of function getFeed

var graph = new shepherd.Graph();

graph.add('mediumFeedUrl-getFeed', getFeed, ['mediumFeedUrl']);

var builder = graph.newBuilder()
	.builds('mediumFeedUrl-getFeed')

//Initialize database
initializeMongodb();

builder.run({mediumFeedUrl: "newtechtalk.xhtml"})
	.fail(function (err) {
		console.log(err);
})


builder.run({mediumFeedUrl: "newpopculture.xhtml"})
	.fail(function (err) {
		console.log(err);
})
