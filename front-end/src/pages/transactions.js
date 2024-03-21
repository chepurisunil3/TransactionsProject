import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
function TransactionsPage(props) {
	const { userDetails, baseUrl } = props;
	const columns = [
		{
			id: 1,
			name: "Amount",
			selector: (row) => {
				if (row.amount < 0) return row.amount * -1;
				else return row.amount;
			},
			sortable: true,
			reorder: true,
		},
		{
			id: 2,
			name: "Transaction Type",
			selector: (row) => row.transactionType,
			sortable: true,
			reorder: true,
		},
		{
			id: 3,
			name: "Balance after Transaction",
			selector: (row) => row.balance,
			sortable: true,
			reorder: true,
		},
		{
			id: 4,
			name: "description",
			selector: (row) => row.description,
			sortable: true,
			right: true,
			reorder: true,
		},
		{
			id: 5,
			name: "Date",
			selector: (row) => {
				return new Date(row.date).toLocaleDateString();
			},
			sortable: true,
			reorder: true,
		},
	];
	const [transactions, setTransactions] = useState([]);
	useEffect(() => {
		const walletId = userDetails._id;
		if (walletId) {
			getWalletTransactions(walletId);
		}
	}, []);

	const getWalletTransactions = async (walletId) => {
		const transactionsResponse = await fetch(
			baseUrl + "/transactions?walletId=" + walletId + "&skip=0"
		);
		const transactionsData = await transactionsResponse.json();
		if (transactionsData.success) {
			setTransactions(transactionsData.data);
		} else {
			alert("Cannot fetch transactions");
		}
	};
	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				overflow: "hidden",
				background: "#1E5162",
			}}
		>
			<div
				style={{
					position: "relative",
					width: "100%",
					maxHeight: "100%",
					overflowY: "auto",
					paddingTop: "60px",
					paddingBottom: "10px",
				}}
			>
				<CSVLink
					data={transactions}
					filename="transactions.csv"
					style={{ background: "white", padding: "5px", color: "black" }}
				>
					Download CSV
				</CSVLink>
				<DataTable
					style={{ height: "100%" }}
					title="Transactions"
					columns={columns}
					data={transactions}
					pagination
					paginationPerPage={6}
				/>
			</div>
		</div>
	);
}
export default TransactionsPage;
