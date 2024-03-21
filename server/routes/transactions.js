const express = require("express");
const {
	setupWallet,
	makeTransaction,
	getTransactions,
	getWallet,
} = require("../controllers/transactions");

const { TransactionsValidator } = require("../validators/transactions");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("Default Route for transactions");
});

router.post("/setup", TransactionsValidator("SETUP_WALLET"), setupWallet);
router.post(
	"/transact/:walletId",
	TransactionsValidator("MAKE_TRANSACTION"),
	makeTransaction
);
router.get(
	"/transactions",
	TransactionsValidator("GET_TRANSACTIONS"),
	getTransactions
);

router.get("/wallet/:id", TransactionsValidator("GET_WALLET"), getWallet);

module.exports = router;
