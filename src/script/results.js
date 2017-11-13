console.log("Results are loaded");

var currentContainer;

// if the song was not found or if the video is not the one expected
// run this function on click to get a new list of suggested songs
function getNewSong(name) {
	var request = new Request(`http://localhost:3000/convert/${name}`);
	fetch(request)
	.then(function(response){

		// removes the previous popup list if any
		if(document.querySelector(".track-popup")) {
			document.querySelector(".track-popup").remove();
		}
		console.log("done");
		return response.json();
	}).then(function(data){
		data = JSON.parse(data);
		data = data.items;
		var container = document.createElement("ul");
		container.classList.add("track-popup");

		// gets the data from every song (currently 5) from the response
		data.forEach(function(song){
			var li = document.createElement("li");
			li.dataset.id = song.id.videoId;
			li.dataset.img = song.snippet.thumbnails.default.url;
			li.dataset.title = song.snippet.title;

			var img = document.createElement("img");
			img.src = song.snippet.thumbnails.default.url;
			li.appendChild(img);

			var p = document.createElement("p");
			p.innerHTML = song.snippet.title;
			li.appendChild(p);
			container.appendChild(li);
		})
		document.querySelector("body").appendChild(container);
	})
}
function setNewSong(id, title, img) {
	console.log(img);
}

window.addEventListener("click", function(e){
	console.log(e);
	if(e.target.className === "change-song") {
		var searchQuery = e.path[2].dataset.title;
		currentContainer = e.target;
		getNewSong(searchQuery);
		setNewSong(e);
	}
	if(e.target.tagName === "LI") {
		var id = e.target.dataset.id;
		var title = e.target.dataset.title;
		var img = e.target.dataset.img;
		setNewSong(id, title, img);
		console.log(currentContainer);
	}
})