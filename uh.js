const SerialPort = require("serialport");

function UH() {
	this.port = new SerialPort("/dev/tty.usbserial-A104X0R2", {
		baudRate: 115200
	});

	this.port.on("open", () => {
		this.port.write("A");

		console.log("serialport opened");
	});

	this.port.on("error", (err) => {
		console.error(err);
	});
}

UH.prototype.stimulate = function (ch) {
	this.port.write(Buffer(ch));
};

module.exports = UH;

if (require.main === module) {
	const uh = new UH();

	setTimeout(() => {
		uh.stimulate("b");
	}, 4000);
}
