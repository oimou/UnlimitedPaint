const fs = require("fs");
const linear = require("linear-solve");

const content = fs.readFileSync("./public/brushes.csv").toString();
const brushes = content.split("\n").map(line => line.split(",")).slice(1);

console.log("brushes");
console.log(brushes);

exports.encode = function (path) {
	const bases = [];
	const A = brushes
		.filter(l => l[2] == 1) /* filter by delta == 1 */
		.map(l => [l[1], +l[3], +l[5]]) /* [ch, x, z] */
		.sort((a, b) => { /* sort by norm */
			const x = Math.pow(a[1], 2) + Math.pow(a[2], 2);
			const y = Math.pow(b[1], 2) + Math.pow(b[2], 2);

			return (x < y) ? 1 : -1;
		})
		.slice(0, 2) /* square matrix */
		.map(basis => {
			bases.push(basis[0]);

			return [basis[1], basis[2]];
		});
	// scale values from path space to UH coordinate space
	const scaler = 10;
	const v = [
		(path.to[0] - path.from[0]) * scaler,
		(path.to[1] - path.from[1]) * scaler * -1 /* y axis is opposite */
	];
	const x = linear.solve(A, v).map(Math.ceil);

	// TODO
	// If got negative values as x, it cannot generate any commands
	// You should re-select basis vectors in the case.
	console.log("bases", bases);
	console.log("A", A);
	console.log("v", v);
	console.log("x", x);

	const commands = [];

	for (let d = 0; d < x.length; d++) {
		for (let i = 0; i < x[d]; i++) {
			commands.push(bases[d]);
		}
	}

	console.log("commands", commands);

	return commands.join("");
};
