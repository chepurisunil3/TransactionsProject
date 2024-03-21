import React, { useState } from "react";

function CreateWallet(props) {
	const { setIsLoggedIn, isLoggedIn, baseUrl } = props;
	const [userName, setUserName] = useState("");
	const [balance, setBalance] = useState(0);

	const submitUserWallet = async () => {
		if (userName !== "" && !isNaN(balance)) {
			const createWalletResponse = await fetch(baseUrl + "/setup", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: userName,
					balance: balance,
				}),
			});
			const walletResponse = await createWalletResponse.json();
			if (walletResponse.success) {
				localStorage.setItem("walletId", walletResponse.walletId);
				setIsLoggedIn(true);
			} else {
				alert(
					"Cannot able to create new wallet: \n Reason: " +
						JSON.stringify(walletResponse.errors)
				);
			}
		} else {
			alert("invalid details provided");
		}
	};

	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				background: "#1E5162",
			}}
		>
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
					Create Wallet
				</label>
				<input
					style={{ width: "80%", margin: "5px", padding: "5px" }}
					type="text"
					onChange={(e) => {
						setUserName(e.target.value);
					}}
					placeholder="Enter your name"
					value={userName}
				/>
				<input
					style={{ width: "80%", margin: "5px", padding: "5px" }}
					placeholder="Enter the initial balance"
					type="number"
					min="0"
					onChange={(e) => {
						setBalance(e.target.value);
					}}
					value={balance}
				/>
				<button
					onClick={submitUserWallet}
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
					Create
				</button>
			</section>
		</div>
	);
}
export default CreateWallet;
