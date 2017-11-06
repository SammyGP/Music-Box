var bodyParser 	= require("body-parser"),
KEYS			= require("./config"),
express 		= require("express"),
app 		   	= express(),
request			= require("request"),
auth 			= require("./auth"),
authRouter		= auth.router,

// not vialbe for release to have tokens like this
// look inte pushing token to front end?
tokens			= auth.tokens;



app.set("view engine", "ejs");
app.use(express.static("src"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
	console.log(tokens.access_token);
	if(tokens.access_token !== 0) {

		// get the new releases for the index header
		// TODO get new release playlist instead of new releas tracks
		var newReleases = {
			url: "https://api.spotify.com/v1/browse/new-releases?limit=10",
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


/*****************************************************************************************************/
				// old user playlist request
				// when done request the user playlist
				/*
				var userPlaylist = {
					url: "https://api.spotify.com/v1/me/playlists?",
					headers: {
						"Authorization": "Bearer " + tokens.access_token,
						"Accept": "application/json"
					}
				}
				request(userPlaylist, function(e, r, b){
					if(e) {
						console.log(e);
					} else {
						var playlistResult = JSON.parse(b);
						res.render("index", {newReleases: results.albums.items, userPlaylist:playlistResult.items});
					}
				})
				*/
/****************************************************************************************************/
			}
		})
	} else {
		res.render("auth");
	}
});

// gets all the tracks from the selected playlist and sends them to the frontend with a fetch request
app.get("/playlist/:user/:id", function(req, res){
	console.log("get track route");
	var userTracks = {
		url: `https://api.spotify.com/v1/users/${req.params.user}/playlists/${req.params.id}`,
		headers: {
			"Authorization": "Bearer " + tokens.access_token,
			"Accept": "application/json"
		}
	}
	request(userTracks, function(err, response, body){
		console.log(userTracks);
		if(err) {
			console.log(err);
		} else {
			var result = JSON.parse(body);

			// needs to be a res.send for the fetch api to recieve
			res.send(body);
		}
	})
});

app.get("/user/playlist", function(req, res){
	var userPlaylist = {
		url: "https://api.spotify.com/v1/me/playlists?",
		headers: {
			"Authorization": "Bearer " + tokens.access_token,
			"Accept": "application/json"
		}
	}
	request(userPlaylist, function(err, response, body){
		var data = JSON.parse(body);
		res.send(data);
	})
})

app.get("/convert", function(req, res){
	res.send("convert!!!");
})
app.post("/convert", function(req, res){
	console.log(req.body);
	res.redirect("/convert");
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
	})
})


// authentication 
// if user is not authenticated (ie tokens.access_token is ==== 0) user from index will be redirected to /auth
app.get("/auth", authRouter);
app.get("/callback", authRouter)

app.listen(3000, function(){
	console.log("Server is up");
});