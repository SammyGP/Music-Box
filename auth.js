var express = require("express");
var router = express.Router();
// var app = express(); not needed?
var keys = require("./config");
var client_id = keys.SPOTIFY_ID;
var client_secret = keys.SPOTIFY_KEY;
var qs = require("querystring");
var request = require("request");
//app.set("view engine", "ejs");
//app.use(express.static("public"));
var tokens = {
	access_token: 0,
	refresh_token: 0
};

router.get("/auth", function(req, res){
	var authUrl = qs.stringify({
		client_id: client_id,
		response_type: "code",
		redirect_uri: "http://localhost:3000/callback",
		show_dialog: true
	})
	res.redirect("https://accounts.spotify.com/authorize?" + authUrl)
})

router.get("/callback", function(req, res){
	if(req.query.error){
		console.log("error occured ");
		res.redirect("/");
	}

	var authOptions = {
		url: "https://accounts.spotify.com/api/token",
		form: {
			grant_type: "authorization_code",
			code: req.query.code,
			redirect_uri: "http://localhost:3000/callback"
		},
		headers: {
			"authorization": "Basic " + (new Buffer(client_id + ':' + client_secret).toString('base64'))
		},
		json: true
	}

	request.post(authOptions, function(err, response, body){
		if(err){
			console.log("error loading page");
			console.log(err)
		} else {
			tokens.access_token = body.access_token;
			tokens.refresh_token = body.refresh_token;
			res.redirect("/");
		}
	});
})

module.exports = {
	router: router,
	tokens: tokens
};