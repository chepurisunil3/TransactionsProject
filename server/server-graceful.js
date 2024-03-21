const express = require("express");
const { createHttpTerminator } = require("http-terminator");
const app = express();

const server = app.listen(3001);
const httpTerminator = createHttpTerminator({ server });

setTimeout(() => {
	httpTerminator.terminate();
}, 5000);

// process.on("SIGTERM", () => {
// 	console.log("SIGTERM signal received: closing HTTP server");
// 	server.close(() => {
// 		console.log("HTTP server closed");
// 	});
// });
// process.on("message", (message) => {
// 	if (message === "shutdown") {
// 		console.log("start shutdown");
// 		server.stopServer().finally(() => {
// 			console.log("finished shutdown");
// 			process.exit(0);
// 		});
// 	}
// });
