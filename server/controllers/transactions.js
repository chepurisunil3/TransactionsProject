const { validationResult } = require("express-validator");
const {
	addNewWallet,
	addTransaction,
	getCurrentBalance,
	updateBalance,
	removeTransaction,
	getTransactionsByWalletId,
	getWalletDetails,
} = require("../models/transactions");
const setupWallet = async (req, res) => {
	const errors = validationResult(req).mapped();
	if (Object.keys(errors).length > 0) {
		res.json({ errors: errors, success: false });
		return;
	}
	const name = req.body.name;
	const balance = req.body.balance;
	let numberOfDecimalsArray = balance.toString().split(".");
	let numberOfDecimals =
		numberOfDecimalsArray.length > 2 ? numberOfDecimalsArray[1].length : 0;
	if (numberOfDecimals && numberOfDecimals > 4) {
		res.json({
			errors: [
				{ balance: { msg: "Balance can be maximum of 4 digitals only" } },
			],
			success: false,
		});
		return;
	}
	const response = await addNewWallet({ name, balance });
	if (response.success) {
		res.json({ success: true, walletId: response.id });
	} else {
		res.json({ success: false, errors: [{ reason: response.reason }] });
	}
};

const makeTransaction = async (req, res) => {
	const errors = validationResult(req).mapped();
	if (Object.keys(errors).length > 0) {
		res.json({ errors: errors, success: false });
		return;
	}
	let numberOfDecimalsArray = req.body.amount.toString().split(".");
	let numberOfDecimals =
		numberOfDecimalsArray.length > 2 ? numberOfDecimalsArray[1].length : 0;
	if (numberOfDecimals && numberOfDecimals > 4) {
		res.json({
			errors: [{ amount: { msg: "Amount can be maximum of 4 digitals only" } }],
			success: false,
		});
		return;
	}
	const balanceResponse = await getCurrentBalance(req.params.walletId);
	if (balanceResponse.success) {
		req.body.balance = balanceResponse.balance + Number(req.body.amount);
	} else {
		res.json({
			errors: [{ walletId: { msg: balanceResponse.reason } }],
			success: false,
		});
		return;
	}
	req.body.transactionType = Number(req.body.amount) > 0 ? "CREDIT" : "DEBIT";
	let dataToStore = req.body;
	dataToStore.walletId = req.params.walletId;
	const response = await addTransaction(dataToStore);
	if (response.success) {
		const updateBalanceResp = await updateBalance(
			dataToStore.walletId,
			dataToStore.amount
		);
		if (updateBalanceResp.success)
			res.json({ success: true, data: response.data });
		else {
			const deleteTransaction = await removeTransaction(response.id);
			res.json({
				success: false,
				errors: [{ reason: updateBalanceResp.reason }],
			});
		}
	} else {
		res.json({ success: false, errors: [{ reason: response.reason }] });
	}
	return;
};

const getTransactions = async (req, res) => {
	const errors = validationResult(req).mapped();
	if (Object.keys(errors).length > 0) {
		res.json({ errors: errors, success: false });
		return;
	}
	const response = await getTransactionsByWalletId(
		req.query.walletId,
		Number(req.query.skip),
		req.query.limit ? Number(req.query.limit) : null
	);
	if (response.success) {
		res.json({ success: true, data: response.data });
	} else {
		res.json({ success: false, errors: [{ reason: response.reason }] });
	}
};

const getWallet = async (req, res) => {
	const errors = validationResult(req).mapped();
	if (Object.keys(errors).length > 0) {
		res.json({ errors: errors, success: false });
		return;
	}
	const response = await getWalletDetails(req.params.id);
	if (response.success) {
		res.json({ success: true, data: response.data });
	} else {
		res.json({ success: false, errors: [{ reason: response.reason }] });
	}
};

module.exports = { setupWallet, makeTransaction, getTransactions, getWallet };
