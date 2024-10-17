import React, { useContext, useEffect, useState } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";
import axios from "axios";
import "./CurrentHoldings.css";

const CurrentHoldings = () => {
  const { currency, email } = useContext(CoinContext);
  const [currentHoldings, setCurrentHoldings] = useState([]);
  const [coinDetails, setCoinDetails] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);

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
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
        },
      };
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,options
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

  useEffect(() => {
    if (coinDetails.length > 0) {
      let totalInvestedCalc = 0;
      let currentCalc = 0;

      currentHoldings.forEach((holding) => {
        const coin = coinDetails.find((c) => c.coinId === holding.coinId);
        if (coin) {
          const invested = holding.price * holding.quantity;
          const currentPrice = coin.price * holding.quantity;

          totalInvestedCalc += invested;
          currentCalc += currentPrice;
        }
      });

      setTotalInvested(totalInvestedCalc);
      setCurrentValue(currentCalc);
      setTotalReturns(currentCalc - totalInvestedCalc); // Total returns = current value - invested amount
    }
  }, [coinDetails, currentHoldings]);

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
    return percentage >= 0
      ? `(+${formattedPercentage}%)`
      : `(-${formattedPercentage}%)`;
  };

  return (
    <div className="holdings-container text-white">
      <h1 className="text-[40px] p-3 font-medium bg-gradient-to-tl from-neutral-900 to-neutral-800 rounded-lg mb-1 rounded-b-sm">
        Holdings
      </h1>
      {currentHoldings.length === 0 ? (
        <div className="bg-gradient-to-tl from-neutral-900 to-neutral-800 flex rounded-sm p-[100px] text-[25px] items-center justify-center">
          No current Holdings
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-tl from-neutral-900 to-neutral-800 flex rounded-sm p-5 justify-between mb-1">
            <div className="Invested flex flex-col">
              <p className="text-[14px]">Invested</p>
              <p className="font-medium text-[18px]">{currency.symbol}{totalInvested.toFixed(2)}</p>
            </div>
            <div className="Current flex flex-col items-center">
              <p className="text-[14px]">Current</p>
              <p className="font-medium text-[18px]">{currency.symbol}{currentValue.toFixed(2)}</p>
            </div>
            <div className="returns flex flex-col items-end">
              <p className="text-[14px]">Total Returns</p>
              <p className={totalReturns >=0 ? `text-green-500 font-medium text-[18px]` : `text-red-500 font-medium text-[18px]`}>{totalReturns>=0 ? `+${currency.symbol}${Math.abs(totalReturns).toFixed(2)}` : `-${currency.symbol}${Math.abs(totalReturns).toFixed(2)}`}</p>
            </div>
          </div>

          <div className="table-layout grid grid-cols-[1.7fr_1fr_1fr] py-3 px-7 items-center rounded-lg font-medium text-[18px] bg-gradient-to-tl from-neutral-900 to-neutral-800 rounded-b-sm">
            <p>Coins</p>
            <p>Current Price</p>
            <p>Returns</p>
          </div>

          <div className="holdings-list" style={{ maxHeight: "420px", overflowY: "auto" }}>
            {currentHoldings.map((holding, index) => {
              const currentCoin = coinDetails.find(
                (coin) => coin.coinId === holding.coinId
              );
              if (currentCoin) {
                const currentPrice = currentCoin.price;
                const profitLossPercentage = calculateProfitLossPercentage(
                  currentPrice,
                  holding.price
                );
                const profitLossValue =
                  (currentPrice - holding.price) * holding.quantity;

                return (
                  <div
                    key={index}
                    className="table-layout grid grid-cols-[2fr_1fr_1fr] py-4 px-7 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] border-t-[1px] border-t-solid border-t-[#292524] bg-gradient-to-tl from-neutral-900 to-neutral-800 font-md rounded-lg"
                  >
                    <div className="flex flex-col">
                      <h2 className="text-[18px] font-semibold">{currentCoin.name}</h2>
                      <p className="text-sm font-light">
                        Bought At:{" "}
                        <span className="text-yellow-400">
                          {currency.symbol}{holding.price}
                        </span>
                      </p>
                      <p className="text-base font-normal">
                        {holding.quantity.toFixed(3)} qty
                      </p>
                      <p className="text-sm font-light">
                        Invested: <span className="text-yellow-400">{currency.symbol}{(holding.price * holding.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                    <p className="items-center font-medium">
                      {currency.symbol}{currentPrice}
                    </p>
                    <div className="flex flex-col font-semibold">
                      <p
                        className={currentPrice >= holding.price ? "text-green-500" : "text-red-500"}
                      >
                        {formatProfitLoss(profitLossValue)}
                      </p>
                      <p
                        className={currentPrice >= holding.price ? "text-green-500" : "text-red-500"}
                      >
                        {formatProfitLossPercentage(profitLossPercentage)}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentHoldings;
