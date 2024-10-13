import React, { useContext, useState, useEffect } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";

const TradeOrder = ({ coinData }) => {
  const [activeTab, setActiveTab] = useState("buy"); // Track active tab (Buy/Sell)
  const [orderType, setOrderType] = useState("Market"); // Track order type (Limit/Market)
  const [qty, setQty] = useState(""); // Track Quantity input as string
  const [orderValue, setOrderValue] = useState(""); // Track Order Value input as string
  const { currency } = useContext(CoinContext);

  const price = coinData.market_data.current_price[currency.name]; // Get current price in selected currency

  const switchTab = (tab) => setActiveTab(tab);
  const switchOrderType = (type) => setOrderType(type);

  // Convert the input string to a number (float or integer)
  const toNumber = (value) => {
    if (!value) return 0; // Handle empty string input as zero
    return parseFloat(value); // Convert to float (safe for integers too)
  };

  // Update Order Value when Qty is changed
  useEffect(() => {
    const numericQty = toNumber(qty); // Convert qty from string to number
    if (numericQty > 0) {
      setOrderValue((numericQty * price).toString()); // Calculate order value based on qty
    } else {
      setOrderValue(""); // Reset if qty is invalid or empty
    }
  }, [qty, price]);

  // Update Qty when Order Value is changed
  useEffect(() => {
    const numericOrderValue = toNumber(orderValue); // Convert order value from string to number
    if (numericOrderValue > 0) {
      setQty((numericOrderValue / price).toString()); // Calculate qty based on order value
    } else {
      setQty(""); // Reset if order value is invalid or empty
    }
  }, [orderValue, price]);

  // Handle qty input validation (up to 5 decimal places)
  const handleQtyChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,5}$/.test(value)) { // Allow up to 5 decimal places
      setQty(value);
    }
  };

  // Handle order value input validation (up to 2 decimal places)
  const handleOrderValueChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) { // Allow up to 2 decimal places
      setOrderValue(value);
    }
  };

  return (
    <>
      {coinData && (
        <div className="bg-gray-800 p-4 rounded-lg max-w-[350px]">
          {/* Buy/Sell Toggle */}
          <div className="flex mb-4">
            <button
              onClick={() => switchTab("buy")}
              className={`flex-1 text-sm py-2 ${
                activeTab === "buy" ? "bg-green-500" : "bg-gray-600"
              } text-white rounded-l-md`}
            >
              Buy
            </button>
            <button
              onClick={() => switchTab("sell")}
              className={`flex-1 text-sm py-2 ${
                activeTab === "sell" ? "bg-red-500" : "bg-gray-600"
              } text-white rounded-r-md`}
            >
              Sell
            </button>
          </div>

          {/* Order Type (Limit/Market/TP-SL) */}
          <div className="flex space-x-2 mb-3 text-yellow-400">
            <button
              className={`${
                orderType === "Market"
                  ? "text-white border-b-2 border-yellow-500"
                  : ""
              }`}
              onClick={() => switchOrderType("Market")}
            >
              Market
            </button>
          </div>

          {/* Available Balance */}
          <div className="text-sm text-gray-300 mb-2">
            Available Balance:{" "}
            <span>
              ******{" "}
              {activeTab === "buy" ? `${currency.name}` : `${coinData.symbol}`}
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
              <span className="text-gray-400">
                {activeTab === "buy"
                  ? `${currency.name}`
                  : `${coinData.symbol}`}
              </span>
            </div>
          )}

          {/* Quantity Input (as string with max 5 decimals) */}
          <div className="flex items-center justify-between bg-gray-700 p-2 mb-2 rounded-md">
            <input
              type="text"
              value={qty}
              onChange={handleQtyChange} // Restrict to 5 decimal places
              placeholder="Qty"
              className="bg-transparent outline-none text-white flex-1"
            />
            <span className="text-gray-400">{coinData.symbol}</span>
          </div>

          {/* Order Value Input (as string with max 2 decimals) */}
          <div className="flex items-center justify-between bg-gray-700 p-2 mb-2 rounded-md">
            <input
              type="text"
              value={orderValue}
              onChange={handleOrderValueChange} // Restrict to 2 decimal places
              placeholder="Order Value"
              className="bg-transparent outline-none text-white flex-1"
            />
            <span className="text-gray-400">{currency.name}</span>
          </div>

          {/* Max buying/selling amount */}
          <div className="text-sm text-gray-300 mb-3">
            Max. {activeTab === "buy" ? "buying" : "selling"} amount: ******{" "}
            {activeTab === "buy" ? `${coinData.symbol}` : `${currency.name}`}
          </div>

          {/* Buy/Sell Button */}
          <button
            className={`w-full py-2 rounded-md text-white ${
              activeTab === "buy" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {activeTab === "buy"
              ? `Buy ${coinData.symbol}`
              : `Sell ${coinData.symbol}`}
          </button>
        </div>
      )}
    </>
  );
};

export default TradeOrder;
