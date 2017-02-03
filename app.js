var express = require('express');
var cfenv = require('cfenv');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');

app.use(express.static(__dirname + '/public'));

var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var dbCredentials = {
	dbName : 'city_actions'
};
var db;
if(process.env.VCAP_SERVICES) {
	services = JSON.parse(process.env.VCAP_SERVICES);	
	if(services.cloudantNoSQLDB) {
		dbCredentials.url = services.cloudantNoSQLDB[0].credentials.url;
	}
	console.log('VCAP Services: '+JSON.stringify(process.env.VCAP_SERVICES));
	
	host = process.env.VCAP_APP_HOST; 
	port = process.env.VCAP_APP_PORT;
	console.log("app is in bluemix");
}
var nano = require('nano')("https://f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix:0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com");	

/*
nano.db.create(dbCredentials.dbName, function (err, res) {
		if (err) {
			console.log('could not create db');
		    console.log("ERROR:" , err);
		    console.log("RES:" , res);
		}
		else
		{
			console.log("created db : " + dbCredentials.dbName);
		}
});
*/
db = nano.use(dbCredentials.dbName);

app.get('/fill_remove_cities_dropdown', function(req, res){
	console.log("To fill remove cities dropdown");
	
	var password = '0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93';
	var username = 'f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix';	
	var url="https://"+username+":"+password+"@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com/city_actions/_design/city_actions/_view/city_actions";
	
	request({
			 url: url,
			 json: true
			}, function (error, response, body) {	
		if (!error && response.statusCode === 200)
		{
			//Check if current input is present in the table, else add. If present then return with error message
			var user_data = body.rows;
			var city_present = 0; //false
			var list_of_cities = '[';
			var city_name_array = [];
			
			for(var i=0; i< user_data.length; i++)
				city_name_array.push(user_data[i].value);
			city_name_array.sort();			
			for(var i=0; i<city_name_array.length; i++)
			{
				var city_JSON = '{\"city\":\"' + city_name_array[i] + '\"}';
				if(i == 0)
					list_of_cities = list_of_cities.concat(city_JSON);
				else
				{
					list_of_cities = list_of_cities.concat(",");
					list_of_cities = list_of_cities.concat(city_JSON);
				}
			}
			console.log("List of cities : " + city_name_array);
			list_of_cities = list_of_cities.concat("]");
			console.log(list_of_cities);
			res.contentType('application/json');
			res.send(JSON.parse(list_of_cities));
		}
		else
		{
			console.log("No data from URL");
			console.log("Response is : " + response.statusCode);
			var name_string="{\"added\":\"DB read error\"}";
			res.contentType('application/json');
			res.send(JSON.parse(name_string));
		}
	});
});

app.get('/view_cities',function(req, res){
	console.log("Will get cities");
	console.log("Received from front end : = " + req.query.allcities);
	
	/* Display existing cities */
	var password = '0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93';
	var username = 'f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix';	
	var url="https://"+username+":"+password+"@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com/city_actions/_design/city_actions/_view/city_actions";

	request({
			 url: url,
			 json: true
			}, function (error, response, body) {	
		if (!error && response.statusCode === 200)
		{
			//Check if current input is present in the table, else add. If present then return with error message
			var user_data = body.rows;
			var city_present = 0; //false
			var list_of_cities = '[';
			var city_name_array = [];
			
			for(var i=0; i< user_data.length; i++)
				city_name_array.push(user_data[i].value);
			city_name_array.sort();			
			for(var i=0; i<city_name_array.length; i++)
			{
				var city_JSON = '{\"city\":\"' + city_name_array[i] + '\"}';
				if(i == 0)
					list_of_cities = list_of_cities.concat(city_JSON);
				else
				{
					list_of_cities = list_of_cities.concat(",");
					list_of_cities = list_of_cities.concat(city_JSON);
				}
			}

			console.log("List of cities : " + city_name_array);
			list_of_cities = list_of_cities.concat("]");
			console.log(list_of_cities);
			res.contentType('application/json');
			res.send(JSON.parse(list_of_cities));
		}
		else
		{
			console.log("No data from URL");
			console.log("Response is : " + response.statusCode);
			var name_string="{\"added\":\"DB read error\"}";
			res.contentType('application/json');
			res.send(JSON.parse(name_string));
		}
	});
});

app.get('/add_city',function(req, res){
	console.log("City to be added : = " + req.query.new_city_name);
	req.query.new_city_name = req.query.new_city_name.toUpperCase();
	req.query.new_city_name = req.query.new_city_name.trim();
	
	//Check if req.query.new_city_name is in the table directly.
	
	var password = '0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93';
	var username = 'f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix';	
	var url="https://"+username+":"+password+"@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com/city_actions/_design/city_actions/_view/city_actions";

	request({
			 url: url,
			 json: true
			}, function (error, response, body) {	
		if (!error && response.statusCode === 200)
		{
			//Check if current input is present in the table, else add. If present then return with error message
			console.log("Successfully fetched data");
			console.log("City to be added is : " + req.query.new_city_name);
			var user_data = body.rows;
			var city_present = 0; //false
			for(var i=0; i< user_data.length; i++)
			{
				var doc = user_data[i];
				console.log("in Db : " + doc.value);
				if(req.query.new_city_name === doc.value)
				{
					city_present = 1;
					break;
				}
			}
			
			if(city_present === 0) //if city is not already in the list
			{
				db.insert(req.query, function(err, body, header){
					if (!err) {
						console.log("Added new city");
						var name_string="{\"added\":\"Yes\"}";
						res.contentType('application/json');
						res.send(JSON.parse(name_string));
					}
					else {
						console.log("Error inserting into DB " + err);
						var name_string="{\"added\":\"DB insert error\"}";
						res.contentType('application/json');
						res.send(JSON.parse(name_string));
					}
				});
			}
			else
			{
				console.log("City is already present");
				var name_string="{\"added\":\"No\"}";
				res.contentType('application/json');
				res.send(JSON.parse(name_string));
			}  
		}
		else
		{
			console.log("No data from URL");
			console.log("Response is : " + response.statusCode);
			var name_string="{\"added\":\"DB read error\"}";
			res.contentType('application/json');
			res.send(JSON.parse(name_string));
		}
	});
});

app.get('/remove_city',function(req, res){
	console.log("City to be removed : = " + req.query.city_to_remove);	
	var password = '0409af40c352e41c849e648f2360a1139ae966e61e940b1375dc184058147d93';
	var username = 'f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix';	
	var url="https://"+username+":"+password+"@f69bd6d1-bf42-43db-8a1f-822f06e0e954-bluemix.cloudant.com/city_actions/_design/city_actions/_view/to_delete";

	/*
	req.query.city_to_remove = req.query.city_to_remove.toUpperCase();
	req.query.city_to_remove = req.query.city_to_remove.trim();
	*/
	
	request({
			 url: url,
			 json: true
			}, function (error, response, body) {	
			if (!error && response.statusCode === 200)
			{
				var user_data = body.rows;
				var id_to_remove;
				var rev_to_remove;
				for(var i=0; i< user_data.length; i++)
				{
					var doc = user_data[i];
					if(doc.value[1] === req.query.city_to_remove)
					{
						id_to_remove = doc.key;
						rev_to_remove = doc.value[0];
						break;
					}
				}
			
				db.destroy(id_to_remove, rev_to_remove, function(err){
					if(!err)
					{
						console.log("Removed city");
						var name_string="{\"removed\":\"removed\"}";
						res.contentType('application/json');
						res.send(JSON.parse(name_string));
					}
					else
					{
						console.log("Couldn't remove city");
						console.log(err);
						var name_string="{\"removed\":\"could not remove\"}";
						res.contentType('application/json');
						res.send(JSON.parse(name_string));
					}
				});
			}
			else
			{
				console.log("No data from URL");
				console.log("Response is : " + response.statusCode);
				var name_string="{\"removed\":\"DB read error\"}";
				res.contentType('application/json');
				res.send(JSON.parse(name_string));
			}
	});
	
});

var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
