$(document).ready(function() {

	$("#searchBox").keyup(function() {
	
		if($(this).val().trim(" ").length > 2) {
 			var searchTerm = $(this).val().trim(" ");
			var searchResults = "";
			document.getElementById("results").innerHTML="";
			
			var data = {};
			data.search = searchTerm;

			$.ajax({
				type: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json',
				url: 'http://localhost:8080/interface',	
				
				success: function(data) {
					console.log('success');
				
					if(data === "") {
						document.getElementById("results").innerHTML="";
						$("<h4 class='post-item-title'><a>No Results</a></h4>").appendTo('#results');						
					}
					else {
						document.getElementById("results").innerHTML="";
						$(data).appendTo('#results');
					}
				}
				});
		}
		else {
			document.getElementById("results").innerHTML="";
		}

	});
});
