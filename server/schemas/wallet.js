const { Schema, model } = require("mongoose");
const Wallet = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		balance: {
			type: Number,
			required: true,
		},
		createdDate: {
			type: Date,
			default: new Date(),
		},
	},
	{ versionKey: false }
);

module.exports = model("wallets", Wallet);
