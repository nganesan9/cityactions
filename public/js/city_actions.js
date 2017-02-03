$(document).ready(function(){
	
	$.ajax({
		url: "/fill_remove_cities_dropdown",
		type: "GET",
		dataType: "json",
		data:{allcities: ""},
		contentType: "application/json",
		cache: true,
		timeout: 5000,
		complete: function() {
		  //called when complete
		  console.log('process complete');
		},
		success: function(data) {
			var city_drop_down;
			for(var i = 0; i < data.length; i++) 
			{
				var city_option = '<option style=\"font-family: montserrat, arial, verdana\">' + data[i].city + '</option>';
				city_drop_down += city_option;
			}
			document.getElementById("cities_to_be_removed").innerHTML = city_drop_down;
			console.log(city_drop_down);
		},
		error: function() {
		    console.log('process error');
		},			
	});	
	
	$("#view_city").click(function(e){
		e.preventDefault();
		console.log("Before $.ajax");
		$.ajax({
			url: "/view_cities",
			type: "GET",
			dataType: "json",
			data:{allcities: $("#allcities").val()},
			contentType: "application/json",
			cache: true,
			timeout: 5000,
			complete: function() {
			  //called when complete
			  console.log('process complete');
			},

			success: function(data) {
				document.getElementById("add_new_city_form").style.display="none";
				document.getElementById("remove_city_form").style.display="none";
				document.getElementById("show_all_cities").style.display="block";
				document.getElementById("added_city").style.display="none";
				document.getElementById("removed_city").style.display="none";
				document.getElementById("duplicate_city").style.display="none";
				document.getElementById("db_insert_error").style.display="none";
				document.getElementById("could_not_remove").style.display="none";
				document.getElementById("db_read_error").style.display="none";	
				
				var city_names_table = "City Names <br><br> <table border=\"1\">";			
				for(var i = 0; i < data.length; i++) 
					city_names_table += "<tr><td>" + data[i].city + "</td></tr>";
				city_names_table += "</table>";
				
				document.getElementById("show_all_cities").innerHTML = city_names_table;
			},

			error: function() {
			  console.log('process error');
			},			
		});		
	});
	 
	 
	$("#add_city_button").click(function(e){
			e.preventDefault();
			console.log("Before ajax in add_city_button form");
			$.ajax({
				url: "/add_city",
				type: "GET",
				dataType: "json",
				data:{new_city_name: $("#newcityname").val()},
				contentType: "application/json",
				cache: true,
				timeout: 5000,
				complete: function() {
				  //called when complete
				  console.log('process complete');
				},
				success: function(data) {
					//console.log("Received : " + data + "value = " + JSON.stringify(data));
					//console.log("Reading JSON data : " + data.added);
					document.getElementById("add_new_city_form").style.display="none";
					document.getElementById("remove_city_form").style.display="none";
					document.getElementById("show_all_cities").style.display="none";					
					document.getElementById("removed_city").style.display="none";
					document.getElementById("could_not_remove").style.display="none";		
					
					if(data.added === "Yes")
					{
						document.getElementById("added_city").style.display="block";
						document.getElementById("duplicate_city").style.display="none";
						document.getElementById("db_insert_error").style.display="none";
						document.getElementById("db_read_error").style.display="none";
					}
					else if(data.added === "No")
					{
						document.getElementById("added_city").style.display="none";
						document.getElementById("duplicate_city").style.display="block";
						document.getElementById("db_insert_error").style.display="none";
						document.getElementById("db_read_error").style.display="none";
					}
					else if(data.added === "DB insert error")
					{
						document.getElementById("added_city").style.display="none";
						document.getElementById("duplicate_city").style.display="none";
						document.getElementById("db_insert_error").style.display="block";
						document.getElementById("db_read_error").style.display="none";	
					}
					else if(data.added === "DB read error")
					{
						document.getElementById("added_city").style.display="none";
						document.getElementById("duplicate_city").style.display="none";
						document.getElementById("db_insert_error").style.display="none";
						document.getElementById("db_read_error").style.display="block";	
					}			
				},
				error: function() {
				  console.log('process error');
				},			
			});
	});  

	$("#remove_city_button").click(function(e){
		e.preventDefault();
		console.log("Before ajax in add_city_button form");
		console.log("Removing from drop down");
		$.ajax({
				url: "/remove_city",
				type: "GET",
				dataType: "json",
				data:{city_to_remove: $("#cities_to_be_removed option:selected").text()},
				contentType: "application/json",
				cache: true,
				timeout: 5000,
				complete: function() {
				  //called when complete
				  console.log('process complete');
				},
				success: function(data) {
					document.getElementById("add_new_city_form").style.display="none";
					document.getElementById("remove_city_form").style.display="none";
					document.getElementById("show_all_cities").style.display="none";
					document.getElementById("added_city").style.display="none";
					document.getElementById("duplicate_city").style.display="none";
					document.getElementById("db_insert_error").style.display="none";
				
					if(data.removed === "removed")
					{
						document.getElementById("removed_city").style.display="block";
						document.getElementById("could_not_remove").style.display="none";
						document.getElementById("db_read_error").style.display="none";
					}
					else if(data.removed === "could not remove")
					{
						document.getElementById("removed_city").style.display="none";
						document.getElementById("could_not_remove").style.display="block";
						document.getElementById("db_read_error").style.display="none";
					}
					else if(data.removed === "DB read error")
					{
						document.getElementById("removed_city").style.display="none";
						document.getElementById("could_not_remove").style.display="none";
						document.getElementById("db_read_error").style.display="block";
					}
				},
				error: function() {
				  console.log('process error');
				},			
			});
		
	});
		
});