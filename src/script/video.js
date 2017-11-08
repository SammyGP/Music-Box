console.log("videoscripts loaded");

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// array of videos ids for the playlist
var userList = ["lbHYyPdQfqk", "lbHYyPdQfqk", "lbHYyPdQfqk" ,"lbHYyPdQfqk"];

// create the player
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player("player", {
		height: "390",
		width: "640",
		videoId: userList[0],
		events: {
			onStateChange: getUserList
		}
	});
}

var loaded = false;
function getUserList(event) {
	if(event.data === -1 && !loaded) {
		player.loadPlaylist({
			playlist: userList
		})
		loaded = true;
	}
}
var request = new Request("http://localhost:3000/playback/json");
fetch(request).then(function(response){
	return response.json();
}).then(function(response){
	userList = response.videoId;
})