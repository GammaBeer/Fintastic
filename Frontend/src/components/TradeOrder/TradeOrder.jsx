import React, { useContext, useState, useEffect } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";
import axios from "axios";

const TradeOrder = ({ coinData, setShowLogin }) => {
  const [activeTab, setActiveTab] = useState("buy");
  const [orderType, setOrderType] = useState("Market");
  const [qty, setQty] = useState("");
  const [orderValue, setOrderValue] = useState("");
  const { currency, balance, token, email, setBalance } = useContext(CoinContext);
  const [currentHoldings, setCurrentHoldings] = useState([]);

  let price = coinData?.market_data?.current_price[currency.name] || 0;
  let totalHoldings = 0;

  // Fetch holdings
  const getHoldings = async () => {
    try {
      const response = await axios.post(
        "https://fintastic.onrender.com/api/trade/holdings",
        { email: email }
      );
      if (response.data.success) {
        setCurrentHoldings(response.data.holdings);
      }
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };

  useEffect(() => {
    if (coinData) {
      getHoldings();
    }
  }, [coinData]);

  if (currentHoldings.length > 0) {
    const holdings = currentHoldings.filter(
      (item) => item.coinId === coinData.id
    );
    totalHoldings = holdings.reduce(
      (sum, holding) => sum + holding.quantity,
      0
    );
  }

  // Handle buying coin
  const buyCoin = async () => {
    try {
      const response = await axios.post(
        "https://fintastic.onrender.com/api/trade/buycoin",
        {
          email: email,
          coin: coinData.id,
          quantity: qty,
          boughtAt: price,
          value: orderValue,
        }
      );
      setQty("");
      setOrderValue("");
      if (response.data.success) {
        alert("Coin bought successfully");

        // Fetch the updated balance after buying
        setBalance(await fetchUpdatedBalance());
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error buying coin:", error);
      alert("An error occurred while buying the coin.");
    }
  };

  // Handle selling coin
  const sellCoin = async () => {
    try {
      const response = await axios.post(
        "https://fintastic.onrender.com/api/trade/sellcoin",
        {
          email: email,
          coin: coinData.id,
          quantity: qty,
          soldAt: price,
          value: orderValue,
        }
      );
      setQty("");
      setOrderValue("");
      if (response.data.success) {
        alert("Coin Sold successfully");

        // Fetch the updated balance after selling
        setBalance(await fetchUpdatedBalance());
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error selling coin:", error);
      alert("An error occurred while selling the coin.");
    }
  };

  // Switch between buy/sell tabs
  const switchTab = (tab) => setActiveTab(tab);
  const switchOrderType = (type) => setOrderType(type);

  // Function to format numbers for dependent fields (on blur)
  const formatToFixed = (value, decimalPlaces) => {
    if (!value || isNaN(value)) return "";
    return parseFloat(value).toFixed(decimalPlaces);
  };

  // Update order value based on qty
  useEffect(() => {
    const numericQty = parseFloat(qty);
    if (numericQty > 0) {
      setOrderValue((numericQty * price).toString());
    } else {
      setOrderValue("");
    }
  }, [qty, price]);

  // Update qty based on order value
  useEffect(() => {
    const numericOrderValue = parseFloat(orderValue);
    if (numericOrderValue > 0) {
      setQty((numericOrderValue / price).toString());
    } else {
      setQty("");
    }
  }, [orderValue, price]);

  const handleQtyChange = (e) => setQty(e.target.value);
  const handleOrderValueChange = (e) => setOrderValue(e.target.value);

  return (
    <>
      {coinData && (
        <div className="bg-gray-800 p-4 rounded-lg max-w-[350px]">
          {/* Buy/Sell Toggle */}
          <div className="flex mb-4">
            <button
              onClick={() => switchTab("buy")}
              className={`flex-1 text-sm py-2 ${activeTab === "buy" ? "bg-green-500" : "bg-gray-600"} text-white rounded-l-md`}
            >
              Buy
            </button>
            <button
              onClick={() => switchTab("sell")}
              className={`flex-1 text-sm py-2 ${activeTab === "sell" ? "bg-red-500" : "bg-gray-600"} text-white rounded-r-md`}
            >
              Sell
            </button>
          </div>

          {/* Order Type (Limit/Market/TP-SL) */}
          <div className="flex space-x-2 mb-3 text-yellow-400">
            <button
              className={`${orderType === "Market" ? "text-white border-b-2 border-yellow-500" : ""}`}
              onClick={() => switchOrderType("Market")}
            >
              Market
            </button>
          </div>

          {/* Available Balance */}
          <div className="text-sm text-gray-300 mb-2">
            Available Balance:{" "}
            <span>
              {token
                ? activeTab === "buy"
                  ? `${balance.toLocaleString()} ${currency.name}`
                  : `${totalHoldings.toLocaleString()} ${coinData.symbol}`
                : "---"}
            </span>
          </div>

          {/* Order Price (readonly) */}
          {activeTab === "buy" && (
            <div className="flex items-center justify-between bg-gray-700 p-2 mb-2 rounded-md">
              <input
                type="text"
                value={price}
                className="bg-transparent outline-none text-white flex-1"
                readOnly
              />
              <span className="text-gray-400">{currency.name}</span>
            </div>
          )}

          {/* Quantity Input */}
          <div className="flex items-center justify-between bg-gray-700 p-2 mb-2 rounded-md">
            <input
              type="text"
              value={qty}
              onChange={handleQtyChange}
              onBlur={() => setQty(formatToFixed(qty, 2))} // Format to 2 decimal places on blur
              placeholder="Qty"
              className="bg-transparent outline-none text-white flex-1"
            />
            <span className="text-gray-400">{coinData.symbol}</span>
          </div>

          {/* Order Value Input */}
          <div className="flex items-center justify-between bg-gray-700 p-2 mb-2 rounded-md">
            <input
              type="text"
              value={orderValue}
              onChange={handleOrderValueChange}
              onBlur={() => setOrderValue(formatToFixed(orderValue, 2))} // Format to 2 decimal places on blur
              placeholder="Order Value"
              className="bg-transparent outline-none text-white flex-1"
            />
            <span className="text-gray-400">{currency.name}</span>
          </div>

          {/* Max buying/selling amount */}
          <div className="text-sm text-gray-300 mb-3">
            {activeTab === "buy" &&
              `Max. buying amount: ${
                token ? (balance / price).toLocaleString() + " " : "---"
              } ${coinData.symbol}`}
          </div>

          {/* Buy/Sell Button */}
          {token ? (
            <button
              className={`w-full py-2 rounded-md text-white ${activeTab === "buy" ? "bg-green-500" : "bg-red-500"}`}
              onClick={activeTab === "buy" ? buyCoin : sellCoin}
            >
              {activeTab === "buy" ? "Buy" : "Sell"}
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="w-full py-2 rounded-md bg-yellow-500 text-black font-bold"
            >
              Please Login
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default TradeOrder;
