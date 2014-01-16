var express = require('express');
var app = express();
var data = require('./data.json');
postsData = data;


//sort the array based on the date-->descending order
postsData.posts.sort(function(x, y){
		 return y.postLastUpdated.$date - x.postLastUpdated.$date;
})
 
app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());
 
app.post('/search', function(req, res){
console.log('req.body.search = '+req.body.search);
var searchTerm = req.body.search;

	if(searchTerm.trim(" ").length > 2) {
		var searchTerm = searchTerm.trim(" ");
		var searchResults = "";
		for (var j in postsData.posts) {
			
			if(postsData.posts[j].title.search(new RegExp(searchTerm, "i")) < 0 ) {
					//do nothing;
			}
			else {
			var postDate = new Date(postsData.posts[j].postLastUpdated.$date)
			searchResults+="<h4 class='post-item-title'><a  href='"+postsData.posts[j].postLink+"'>"+postsData.posts[j].title+"</a></h4>";
			searchResults+='<a class="post-item-snippet" href="'+postsData.posts[j].postLink+'"><p>'+postsData.posts[j].snippetText+'</p>';
			}
 		}

		res.send(searchResults);
	}

});
 
app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
           process.env.OPENSHIFT_NODEJS_IP);

