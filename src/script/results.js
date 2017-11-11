console.log("Results are loaded");

// if the song was not found or if the video is not the one expected
// run this function on click to get a new list of suggested songs
function getNewSong(name) {
	var request = new Request(`http://localhost:3000/convert/${name}`);
	fetch(request)
	.then(function(response){
		console.log("done");
		return response.json();
	}).then(function(data){
		data = JSON.parse(data);
		data = data.items;
		var container = document.createElement("ul");
		// gets the data from every song (currently 5) from the response
		data.forEach(function(song){
			var li = document.createElement("li");

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

window.addEventListener("click", function(e){
	console.log(e);
	if(e.target.className === "change-song") {
		var searcQuery = e.path[2].dataset.title;
		getNewSong(searcQuery);
	}
})