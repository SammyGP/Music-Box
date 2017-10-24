console.log("Hello scripts are loaded");

window.addEventListener("click", function(e){

	// adds the item from the header or user playlist to the submit list
	if(e.path[1].className === "song-box") {
		var listItem = e.path[1]
		listItem.classList.add("list-item");
		listItem.classList.remove("song-box");
		var formData = document.querySelector(".submit-playlist");
		formData.appendChild(listItem);
	}
});