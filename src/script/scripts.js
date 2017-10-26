console.log("Hello scripts are loaded");


window.addEventListener("click", function(e){
	console.log(e);
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

	/*
	button.onclick = fetch(myRequest, {
		method: "POST"
	}).then(function(request){
		console.log(request);
		return request.text();
	}).then(function(myString){
		console.log(myString)
	})
	*/
});

