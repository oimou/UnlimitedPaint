function draw (path) {
	var newKey = firebase.database().ref().child("lines").push().key;
	var updates = {};

	updates["/lines/" + newKey] = path;

	firebase.database().ref().update(updates);

	//$.post("/api/draw", {
	//	path: path
	//}, (res) => {
	//	console.log(res);
	//});
}

$(() => {
	firebase.database().ref().child("lines").on("child_added", (snapshot) => {
		console.log(snapshot);
	});
});
