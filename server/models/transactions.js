const WalletSchema = require("../schemas/wallet");
const TransactionsSchema = require("../schemas/transactions");
const { v4: uuid } = require("uuid");
const { Types } = require("mongoose");
let transactionsInProcess = {};

const getCurrentBalance = async (id) => {
	try {
		const balance = await WalletSchema.findOne({ _id: id }, { balance: true });
		if (balance != null) {
			return { success: true, balance: balance.balance };
		} else {
			return { success: false, reason: "Invalid Wallet id" };
		}
	} catch (e) {
		console.log(e);
		return { success: false, reason: e.toString() };
	}
};

const updateBalance = async (id, increment) => {
	try {
		const currentTransactionId = uuid();
		if (!transactionsInProcess.hasOwnProperty(id))
			transactionsInProcess[id] = [currentTransactionId];
		else transactionsInProcess[id].push(currentTransactionId);

		if (
			transactionsInProcess[id].length == 0 ||
			transactionsInProcess[id][0] == currentTransactionId
		) {
			const resp = await actualBalanceUpdate(id, increment);
			transactionsInProcess[id].splice(
				transactionsInProcess[id].indexOf(currentTransactionId),
				1
			);
			return resp;
		} else {
			const maxRetries = 15;
			let intervalTime = 10;
			const timeInterval = setInterval(async () => {
				if (maxRetries <= 0) {
					clearInterval(timeInterval);
					return { success: false, reason: "Maximum retries exceeded" };
				}
				if (
					transactionsInProcess[id].length == 0 ||
					transactionsInProcess[id][0] == currentTransactionId
				) {
					const resp = await actualBalanceUpdate(id, increment);
					transactionsInProcess[id].splice(
						transactionsInProcess[id].indexOf(currentTransactionId),
						1
					);
					clearInterval(timeInterval);
					return resp;
				}
				maxRetries--;
				intervalTime += 10;
			}, intervalTime);
		}
	} catch (e) {
		console.log(e);
		return { success: false, reason: e.toString() };
	}
};

const actualBalanceUpdate = async (id, increment) => {
	try {
		const updatedBalance = await WalletSchema.updateOne(
			{ _id: id },
			{ $inc: { balance: increment } }
		);
		if (updatedBalance.modifiedCount == 1) {
			return { success: true };
		} else {
			return { success: false, reason: "Balance not updated" };
		}
	} catch (e) {
		console.log(e);
		return { success: false, reason: e.toString() };
	}
};

const addNewWallet = async (data) => {
	try {
		const createdWallet = new WalletSchema(data);
		await createdWallet.save();
		return { success: true, id: createdWallet._id };
	} catch (e) {
		return { success: false, reason: e.toString() };
	}
};

const addTransaction = async (data) => {
	try {
		const createdTransaction = new TransactionsSchema(data);
		await createdTransaction.save();
		return { success: true, data: createdTransaction };
	} catch (e) {
		return { success: false, reason: e.toString() };
	}
};

const getTransactionsByWalletId = async (walletId, skip, limit) => {
	try {
		const pipeLine = [
			{ $match: { walletId: Types.ObjectId(walletId) } },
			{ $sort: { date: -1 } },
			{ $skip: skip },
		];
		if (limit != null) {
			pipeLine.push({ $limit: limit });
		}
		const response = await TransactionsSchema.aggregate(pipeLine);
		return { success: true, data: response };
	} catch (e) {
		console.log(e);
		return { success: false, reason: e.toString() };
	}
};

const removeTransaction = async (id) => {
	try {
		const deletedResponse = await TransactionsSchema.deleteOne({ _id: id });
		if (deletedResponse.deletedCount == 1) return { success: true };
		else {
			return { success: false, reason: "Transaction id not found" };
		}
	} catch (e) {
		return { success: false, reason: e.toString() };
	}
};

const getWalletDetails = async (id) => {
	try {
		const walletDetails = await WalletSchema.findOne({ _id: id });
		if (walletDetails != null) {
			return { success: true, data: walletDetails };
		} else {
			return { success: false, reason: "Couldn't find the wallet!" };
		}
	} catch (e) {
		return { success: false, reason: e.toString() };
	}
};

module.exports = {
	addNewWallet,
	addTransaction,
	getCurrentBalance,
	updateBalance,
	removeTransaction,
	getTransactionsByWalletId,
	getWalletDetails,
};
