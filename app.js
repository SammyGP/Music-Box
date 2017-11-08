var bodyParser 	= require("body-parser"),
KEYS			= require("./config"),
express 		= require("express"),
app 		   	= express(),
request			= require("request"),
auth 			= require("./auth"),
authRouter		= auth.router,
rp 				= require("request-promise"),

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

// JSON of user playlists track
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

// spotify playlist submission
app.post("/convert", function(req, res){

	// posts the search_query object containing a string for each artist and song


	//
	// TODO fix the post request
	// i get the data but now i need to figure out how to DISPLAY the data to the user
	//

	var spotifyList = req.body;
	if(!spotifyList) {
		console.log("something went wrong");
	} else {

		var data = [];
		var counter = 0;


		// the for loops request the youtube api every iteration 
		// when the request is done (it returns a promise) and adds to the counter
		// when the counter is bigger than the list its renders the page with all the data
		/*
			PROBLEM due the async nature of request i cant do a conventional counter due the fact
			that a normal counter and for loop will count up while the request data is still handled
			with the .then() i make sure each request is finished before i add to the counter and render the new page
		*/
		for (i=0, j=spotifyList.search_query.length; i <= j; i++) {

			rp(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${KEYS.YOUTUBE_KEY}&q=${spotifyList.search_query[i]}`, 
			function(error, response, body){

				var result = JSON.parse(body);
				result = result.items[0];
				data.push(result);
			}).then(function(){

				counter++;
				if(counter > j) {
					console.log("all the data done");
					//res.send(data);
					res.render("results", {data: data});
				}
			})

		}
	}
});

// VIDEO playback
app.post("/playback", function(req, res){
	var data = req.body;
	//data = JSON.stringify(data);
	app.set("videoIds", data)
	res.render("video");
})

app.get("/playback/json", function(req, res){
	var data = app.get("videoIds");
	res.json(data);
})

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