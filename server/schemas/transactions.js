const { Schema, Types, model } = require("mongoose");
const Transactions = new Schema(
	{
		walletId: {
			type: Types.ObjectId,
			ref: "wallet",
			index: true,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		balance: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
		},
		date: {
			type: Date,
			default: new Date(),
		},
		transactionType: {
			type: String,
			enum: ["CREDIT", "DEBIT"],
			required: true,
		},
	},
	{ versionKey: false }
);

Transactions.index({ walletId: 1, date: -1 });
Transactions.index({ walletId: 1, transactionType: 1 });
module.exports = model("transactions", Transactions);
