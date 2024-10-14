
import { createContext } from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
  const [token, setToken] = useState("");
  const url = "http://localhost:5000";
  const [allCoins, setAllCoins] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0);

  const fetchAllCoin = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
      },
    };

    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
      options
    )
      .then((response) => response.json())
      .then((response) => setAllCoins(response))
      .catch((err) => console.error(err));
  };

  const decodeSessionToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded && decoded.name && decoded.email) {
        setEmail(decoded.email);
      }
    } catch (error) {
      console.error("Error decoding session token:", error);
    }
  };

  const getBalance = async () => {
    const response = await axios.post(
      "http://localhost:5000/api/trade/checkBalance",
      { email: email }
    );
    if (response.data.success) {
      setBalance(response.data.balance);  
    }
  };
  useEffect(() => {
    getBalance();
  }, [email,balance,token]);

  useEffect(() => {
    async function loadData() {
      await fetchAllCoin();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
    }
    loadData();
  }, [currency]);

  useEffect(() => {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        decodeSessionToken(sessionToken);
      }
  }, []);

  const contextValue = {
    allCoins,
    currency,
    setCurrency,
    url,
    token,
    setToken,
    balance,
    setBalance,
    email
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};
export default CoinContextProvider;
