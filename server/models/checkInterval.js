let maxRetries = 1;
var intervalTime = 1;
callTimeout();

// let interval = setInterval(() => {
// 	if (maxRetries >= 10) {
// 		clearInterval(interval);
// 	}
// 	console.log(maxRetries);
// 	maxRetries++;
// }, intervalTime);

function callTimeout() {
	let interval = setTimeout(() => {
		if (maxRetries <= 10) {
			clearInterval(interval);
			callTimeout();
			maxRetries++;
			intervalTime *= 2;
			console.log(intervalTime);
		}
	}, intervalTime * 1000);
}
