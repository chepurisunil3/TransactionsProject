import "./App.css";
import { useEffect, useState } from "react";
import HomePage from "./pages/home-page";
import CreateWallet from "./pages/create-wallet";
import TransactionsPage from "./pages/transactions";

function App() {
  const baseUrl = "http://localhost:3001";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [viewTransactionsPage, setViewTransactionsPage] = useState(false);
  useEffect(() => {
    const walletId = localStorage.getItem("walletId");
    if (walletId) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn == true) {
      fetchUserDetails(localStorage.getItem("walletId"));
    }
  }, [isLoggedIn]);

  const logoutUser = () => {
    localStorage.removeItem("walletId");
    setIsLoggedIn(false);
    setUserDetails({});
  };

  const showTransactions = () => {
    setViewTransactionsPage(true);
  };

  const showWalletDashboard = () => {
    setViewTransactionsPage(false);
  };

  const fetchUserDetails = async (walletId) => {
    const userDetailsResponse = await fetch(baseUrl + "/wallet/" + walletId);
    const userDetailsFetched = await userDetailsResponse.json();
    if (userDetailsFetched.success) {
      setUserDetails(userDetailsFetched.data);
    } else {
      alert("Couldn't able to fetch details. Please re-login again!");
      localStorage.removeItem("walletId");
    }
  };
  return (
    <div className="App">
      {isLoggedIn && userDetails ? (
        <>
          <header
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            <h4>Transactions Project</h4>
            <div
              style={{
                float: "right",
                position: "absolute",
                right: 0,
                top: 0,
                zIndex: 100,
              }}
            >
              {viewTransactionsPage ? (
                <button
                  style={{
                    margin: "15px 10px",
                    background: "transparent",
                    textDecoration: "underline",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={showWalletDashboard}
                >
                  Open Dashboard
                </button>
              ) : (
                <button
                  style={{
                    margin: "15px 10px",
                    background: "transparent",
                    textDecoration: "underline",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={showTransactions}
                >
                  View Transactions
                </button>
              )}
              <button
                onClick={logoutUser}
                style={{
                  margin: "15px 10px",
                  background: "transparent",
                  textDecoration: "underline",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          </header>
          {viewTransactionsPage ? (
            <TransactionsPage baseUrl={baseUrl} userDetails={userDetails} />
          ) : (
            <HomePage
              baseUrl={baseUrl}
              userDetails={userDetails}
              setUserDetails={setUserDetails}
            />
          )}
        </>
      ) : (
        <CreateWallet
          baseUrl={baseUrl}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
}

export default App;
