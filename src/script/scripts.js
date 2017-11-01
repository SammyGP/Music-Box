console.log("Hello scripts are loaded");


// TODO add the data AND acces/refresh token to session storage
// so that i dont need to call the backend api every request


// get the tracks from user playlists function
var getUserTracks = function(userId, listId) {

	// check if list already exists in session storage
	if(sessionStorage.getItem(listId)) {
		console.log(userId);
	} else {
		// if not fetches the data from the server


		// and adds it to the session storage
	}
		// if not fetches the data from the server
		var request = new Request(`http://localhost:3000/playlist/${userId}/${listId}`);
		fetch(request)
		.then(function(response){
			return response.json();
		})
		.then(function(data){
			//returns various data about the tracks in the playlist
			console.log(data.tracks.items);
			data = data.tracks.items;

			// removes the hidden class so the list is displayed
			document.querySelector(".track-popup").classList.remove("hidden");

			var container = document.getElementById("popup-list");

			// clear the container before appending to make sure new stuff dont get added everytime you click
			// checks if list container has childnodes and deletes them while it has
			if(container.hasChildNodes()){
				while(container.hasChildNodes()) {

					// always selects the first li it encounters
					var rm = container.querySelector("li");
					container.removeChild(rm);
				}
			}

			// populates the list (again if selecting new one)
			data.forEach(function(item){
				var li = document.createElement("li");

				// TODO 
				// currently only displays the first artist, make sure all artist in the artists[] array are displayed

				li.innerHTML = item.track.artists[0].name  + " - " + item.track.name;
				li.style.display = "block";
				container.appendChild(li);
			})

			// TODO 
			// create the container "popup" window that contains all the trackslist for the user to views what the playlist contains
			var display = document.querySelector(".track-popup").style.display = "block";
			container.style.display = "block";

		})
}


window.addEventListener("click", function(e){

	console.log(e);

	if(e.path[1].className === "user-playlist") {
		var userId = e.path[1].dataset.userId;
		var listId = e.path[1].dataset.listId
		getUserTracks(userId, listId);
	}










	/*


	// adds the item from the header or user playlist to the submit list
	if(e.path[1].className === "song-box") {
		var listItem = e.path[1]
		listItem.classList.add("list-item");
		listItem.classList.remove("song-box");
		var formData = document.querySelector(".submit-playlist");
		formData.appendChild(listItem);
	}
	if(e.srcElement.className == "submit") {

		// gets the owber id and list name from the playlist form values
		var listOwner = e.srcElement.form[0].value;
		var listId = e.srcElement.form[1].value

		// request the backen /playlist post route with the params needed to get the list tracks from spotify
		// see app.js for more
		var myRequest = new Request(`http://localhost:3000/playlist/${listOwner}/${listId}`);

		var button = e.srcElement.className;
		button.onclick = fetch(myRequest, {
			method: "POST"
		}).then(function(request){
			console.log(request);

			// sets the return type to json
			return request.json();
		}).then(function(myData){
			console.log(myData)
		})
	}

	*/
});



var closeButton = document.getElementById("close-button");
closeButton.onclick = function(){
	document.querySelector(".track-popup").classList.add("hidden")
}


// gets all the users playlists from the server
var getUserPlaylistButton = document.getElementById("get-playlists");
getUserPlaylistButton.addEventListener("click", function(e){

	var request = new Request("http://localhost:3000/user/playlist");
	fetch(request)
	.then(function(response){
		return response.json();
	})
	.then(function(data){
		// returns json of all the users playlists
		data = data.items;
		console.log(data);
		getUserPlaylistButton.style.display = "none";
		data.forEach(function(item){
			var container = document.querySelector(".user-playlists");
			var div = document.createElement("div");
			div.classList.add("user-playlist");
			var img = document.createElement("img");

			// checks if there is an playlist background image or not
			if(!item.images[0]) {
				img.src = "No image available for playlist";
				// add default image?
				
			} else {
				console.log("image exists");
				img.src = item.images[0].url;
			}
			div.appendChild(img);

			// no show data thats needed for playlist api info
			var userId = item.owner.id;
			var listId = item.id;

			// add the hidden data to the div using the data- attribute
			div.dataset.userId = userId;
			div.dataset.listId = listId;

			// creates the elements containing the display data
			// and appends it to the div
			var displayName = document.createElement("p");
			displayName.innerHTML = item.owner.display_name;
			div.appendChild(displayName);

			var listName = document.createElement("h2");
			listName.innerHTML = item.name;
			div.appendChild(listName);


			// apends the div to the final container
			container.appendChild(div);
		})
	})
})
