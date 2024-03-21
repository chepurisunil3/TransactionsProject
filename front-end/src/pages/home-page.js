import React, { useState } from "react";

function HomePage(props) {
	const { userDetails, setUserDetails, baseUrl } = props;
	const [amount, setAmount] = useState(0);
	const [transactionType, setTransactionType] = useState("credit");
	const [description, setDescription] = useState("");

	const submitCreateTransaction = async (event) => {
		if (!isNaN(amount) && Number(amount) > 0) {
			let currentAmount = amount;
			if (transactionType == "debit") {
				currentAmount = currentAmount * -1;
			}
			const makeTransactionResponse = await fetch(
				baseUrl + "/transact/" + userDetails._id,
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						amount: currentAmount,
						description: description,
					}),
				}
			);
			const transactionResponse = await makeTransactionResponse.json();
			if (transactionResponse.success) {
				setUserDetails({
					...userDetails,
					balance: transactionResponse.data.balance,
				});
				setDescription("");
				setAmount(0);
				setTransactionType("credit");
				alert("Transaction successfull!");
			} else {
				alert(
					"Couldn't make transaction \n reason: " +
						JSON.stringify(transactionResponse.errors)
				);
			}
		} else {
			alert("Amount should be valid and greater than 0");
		}
	};
	return (
		<>
			<div
				style={{
					width: "100vw",
					height: "100vh",
					overflow: "hidden",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					background: "#1E5162",
					flexDirection: "column",
				}}
			>
				<section>
					<p>Hi! {userDetails.name}</p>
					<p>Your Current Balance: {userDetails.balance}</p>
				</section>
				<section
					style={{
						width: "20vw",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<label style={{ paddingBottom: "10px", fontWeight: "bold" }}>
						Make a transaction
					</label>
					<input
						style={{ width: "80%", margin: "5px", padding: "5px" }}
						placeholder="Enter the initial balance"
						type="number"
						onChange={(e) => {
							setAmount(e.target.value);
						}}
						value={amount}
					/>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							width: "80%",
							justifyContent: "space-between",
							margin: "5px",
						}}
					>
						<label>Transaction Type:</label>
						<select
							value={transactionType}
							onChange={(e) => {
								setTransactionType(e.target.value);
							}}
						>
							<option value={"credit"}>Credit</option>
							<option value={"debit"}>Debit</option>
						</select>
					</div>
					<textarea
						style={{ width: "80%", margin: "5px", padding: "5px" }}
						type="text"
						onChange={(e) => {
							setDescription(e.target.value);
						}}
						placeholder="Optional description"
						value={description}
					/>
					<button
						onClick={submitCreateTransaction}
						style={{
							marginTop: "20px",
							background: "white",
							color: "black",
							padding: "5px 20px",
							border: "none",
							borderRadius: "5px",
							fontWeight: "bold",
						}}
					>
						Submit
					</button>
				</section>
			</div>
		</>
	);
}

export default HomePage;
