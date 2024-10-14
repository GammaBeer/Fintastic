import React, { useContext, useEffect, useState } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";
import axios from "axios";

const CurrentHoldings = () => {
  const { currency, balance, email, allCoins } = useContext(CoinContext);
  const [currentHoldings, setCurrentHoldings] = useState([]);
  const [coinDetails, setCoinDetails] = useState([]);

  const fetchCurrentHoldings = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/trade/holdings",
        { email }
      );
      if (response.data.success) {
        setCurrentHoldings(response.data.holdings);
      }
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };

  const getCoinDetails = async (coinId) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-qVw81LkoTJQPCBQc7Hz2nwYq",
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        options
      );
      const data = await response.json();
      return {
        coinId,
        price: data.market_data.current_price[currency.name],
        name: data.name,
      };
    } catch (err) {
      console.error(`Error fetching details for ${coinId}:`, err);
      return null;
    }
  };

  const fetchAllCoinDetails = async () => {
    const details = await Promise.all(
      currentHoldings.map((holding) => getCoinDetails(holding.coinId))
    );
    setCoinDetails(details.filter((detail) => detail !== null));
  };

  useEffect(() => {
    if (email) {
      fetchCurrentHoldings();
    }
  }, [email]);

  useEffect(() => {
    if (currentHoldings.length > 0) {
      fetchAllCoinDetails();
    }
  }, [currentHoldings]);

  const calculateProfitLossPercentage = (currentPrice, boughtPrice) => {
    return ((currentPrice - boughtPrice) / boughtPrice) * 100;
  };

  const formatProfitLoss = (value) => {
    const formattedValue = Math.abs(value).toFixed(2);
    return value >= 0
      ? `+${currency.symbol}${formattedValue}`
      : `-${currency.symbol}${formattedValue}`;
  };

  const formatProfitLossPercentage = (percentage) => {
    const formattedPercentage = Math.abs(percentage).toFixed(2);
    return percentage >= 0 ? `(+${formattedPercentage}%)` : `(-${formattedPercentage}%)`;
  };

  return (
    <div className="holdings-container bg-black">
      <h1>Holdings</h1>
      {currentHoldings.length === 0 ? (
        <h1>No current Holdings</h1>
      ) : !allCoins ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="table-layout grid grid-cols-[2fr_1fr_1fr] py-4 px-7 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] border-t-[1px] border-t-solid border-t-[#3c3c3c] font-bold">
            <p>Coins</p>
            <p>Current Price</p>
            <p>Returns</p>
          </div>
          {currentHoldings.map((holding,index) => {
            if (coinDetails.length > 0) {
              const currentCoin = coinDetails.find(
                (coin) => coin.coinId === holding.coinId
              );
              if (currentCoin) {
                const currentPrice = currentCoin.price;
                const name = currentCoin.name;
                const profitLossPercentage = calculateProfitLossPercentage(
                  currentPrice,
                  holding.price
                );
                const profitLossValue =
                  (currentPrice - holding.price) * holding.quantity;
                return (
                  <div
                    key={index}
                    className="table-layout grid grid-cols-[2fr_1fr_1fr] py-4 px-7 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] border-t-[1px] border-t-solid border-t-[#3c3c3c] font-md"
                  >
                    <div className="flex flex-col">
                      <h2>{name}</h2>
                      <p>
                        Bought At: {currency.symbol}
                        {holding.price}
                      </p>
                      <p>{holding.quantity.toFixed(3)} qty</p>
                    </div>
                    <p className="items-center">
                      {currency.symbol}
                      {currentPrice}
                    </p>
                    <div className="flex flex-col">
                      <p
                        className={
                          currentPrice >= holding.price
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {formatProfitLoss(profitLossValue)}
                      </p>
                      <p
                        className={
                          currentPrice >= holding.price
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {formatProfitLossPercentage(profitLossPercentage)}
                      </p>
                    </div>
                  </div>
                );
              }
            }
            return null;
          })}
        </>
      )}
    </div>
  );
};

export default CurrentHoldings;
