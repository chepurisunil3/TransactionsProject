# Trasactions Project

## API Endpoints

### In Local

- Setup the wallet
  - POST - http://localhost:3001/setup
    - headers: Accept: "application/json","Content-Type": "application/json"
    - request: {name:"user name", balance: "Initial balance"}
    - response: {success:bool,walletId:string,errors:array}
- Add a transaction
  - POST - http://localhost:3001/transact/:walletId
    - headers: Accept: "application/json","Content-Type": "application/json"
    - request: {amount:number, description: string, walletId:string}
    - response: {success:bool,data:object,errors:array}
- Get Transactions
  - GET - http://localhost:3001/transactions
    - request: walletId
    - response: {success:bool,data:array,errors:array}
- Get Wallet Details
  - GET - http://localhost:3001/wallet/:id
    - request:{}
    - response: {success:bool,data:object,errors:array}

## Setup

- Open setup directory
- Run backend-setup.cmd (wait for it to complete the process)
- Run frontend-setup.cmd (wait for it to complete)

## Start Server and website

- Open setup directory
- Run start-server.cmd (Let it run until you use the website)
- Run start-website.cmd (Let it run until you run the website)

## Database explanation

- Database used: MongoDB
- Schema Designing: Mongoose
- collections

  - wallets
    - Fields
      - \_id: ObjectId
      - name: String
      - balance: Number
      - createdDate: Date
    - Index
      \_id: default index
      name: index - 1(ASC), unique
  - transactions

    - Fields
      - \_id: ObjectId
      - walletId: ObjectId
      - amount: Number
      - balance: Number
      - description: String
      - date: Date
      - transactionType: Enum (CREDIT,DEBIT)
    - Index
      \_id: default index
      walletId: index - ASC
    - Compound Index
      walletId (ASC), date(DESC)

  - Code functionality
    - Creates new wallet if name is not present
    - Creates new Transactions and updates the balance left in wallet amount
      - Used Queue system to update the balance in wallet to avoid race condition.
      - If the update in balance for wallet fails the transaction entry will be reverted back
    - Fetches the transactions list using walletId using aggregation pipeline
    - Fetches the wallet details using walletId

### Recording Link

https://www.loom.com/share/533b466bf4164b03b4bf53b2be9c1599?sid=525693f1-b87b-4ae5-8f52-c473bef2c78a
