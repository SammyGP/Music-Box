var bodyParser 	= require("body-parser"),
KEYS			= require("./config"),
express 		= require("express"),
app 		   	= express(),
request			= require("request"),
auth 			= require("./auth"),
authRouter		= auth.router,
tokens			= auth.tokens;



app.set("view engine", "ejs");
app.use(express.static("src"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
	console.log(tokens.access_token);
	if(tokens.access_token !== 0) {

		// get the new releases for the index header
		var newReleases = {
			url: "	https://api.spotify.com/v1/browse/new-releases?limit=10",
			headers: {
				"Authorization": "Bearer " + tokens.access_token,
				"Accept": "application/json"
			}
		}

		request(newReleases, function(err, response, body){
			if(err){
				console.log(err)
			} else {
				//res.send(body);
				var results = JSON.parse(body);
				res.render("index", {newReleases: results.albums.items});
			}
		})
	} else {
		res.render("auth");
	}
});


// temporary endpoint just to view the json data
app.get("/data", function(req, res){
	var newReleases = {
		url: "	https://api.spotify.com/v1/browse/new-releases?limit=10",
		headers: {
			"Authorization": "Bearer " + tokens.access_token,
			"Accept": "application/json"
		}
	}
	request(newReleases, function(err, response, body){
		data = JSON.parse(body);
		res.send(data);
	})
})

app.get("/auth", authRouter);
app.get("/callback", authRouter)

app.listen(3000, function(){
	console.log("Server is up");
});