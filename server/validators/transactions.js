const { body, param, query } = require("express-validator");
const TransactionsValidator = (method) => {
	switch (method) {
		case "SETUP_WALLET":
			return [body("balance").notEmpty().isNumeric(), body("name").notEmpty()];
		case "MAKE_TRANSACTION":
			return [
				param("walletId").notEmpty(),
				body("amount").notEmpty().isNumeric(),
			];
		case "GET_TRANSACTIONS":
			return [
				query("walletId").notEmpty(),
				query("skip").notEmpty().isNumeric(),
			];
		case "GET_WALLET":
			return [param("id").notEmpty()];
		default:
			return [];
	}
};
module.exports = { TransactionsValidator };
