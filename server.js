const async = require("async");
const firebase = require("firebase");
const express = require("express");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const UH = require("./lib/uh");
const encoder = require("./lib/encoder");
const config = require("./public/config.js");

const app = express();
const api = express.Router();

const uh = new UH();

// Initialize Firebase
firebase.initializeApp(config);

const startedAt = new Date();

firebase.database().ref().child("lines").on("child_added", (snapshot) => {
	if (new Date() - startedAt < 1000 * 10) {
		console.log("ignoring initial data");
		return;
	}

	const path = snapshot.val();
	let command;

	try {
		command = encoder.encode(path);
	} catch (e) {
		console.error(e);
		return;
	}

	async.eachSeries(command.split(""), (c, done) => {
		uh.stimulate(c);

		setTimeout(done, 500);
	});
});
console.log("listener started");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", api);
app.use(serveStatic(__dirname + "/public"));

const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
	console.log("server started: ", PORT);
});
