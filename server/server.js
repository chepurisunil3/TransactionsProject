const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./db-connection");

const TransactionsRouter = require("./routes/transactions");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	cors({
		origin: (origin, callback) => {
			return callback(null, true);
		},
	})
);

app.use("/", TransactionsRouter);

app.listen(PORT, () => {
	console.log(`Server running on ${PORT} port`);
});
