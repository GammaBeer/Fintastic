import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CoinContext } from "../../context/CoinContext.jsx";
import "./TradeHistory.css";

const TradeHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const { email, currency } = useContext(CoinContext);

  const getTradeHistory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/trade/history",
        { email: email }
      );
      if (response.data.success) {
        // Reverse the trade history when you receive the data
        setTradeHistory(response.data.history.reverse());
      }
    } catch (error) {
      console.error("Error fetching trade history:", error);
    }
  };

  useEffect(() => {
    getTradeHistory();
  }, [email]);

  useEffect(() => {
    console.log("trade History", tradeHistory);
  }, [tradeHistory]);

  return (
    <>
      <div className="history-container text-black">
        <h1 className="text-[40px] p-3 font-bold mb-1 bg-gradient-to-br from-violet-200 to-green-50 rounded-lg rounded-b-none">
          Trade History
        </h1>
        {tradeHistory.length === 0 ? (
          <div className="bg-gradient-to-br from-violet-200 to-green-50 flex rounded-sm p-[100px] text-[25px] items-center justify-center">
            No History yet! Start Investing
          </div>
        ) : (
          <div
            className="history-list flex flex-col gap-1"
            style={{
              maxHeight: "435px", // Set a fixed height for the coin list area
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            {tradeHistory.map((trade, index) => {
              const month = [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];

              const tradeDate = new Date(trade.tradeDate).toLocaleString(
                undefined,
                { timeZone: "Asia/Kolkata" }
              );
              const [date, time] = tradeDate.split(", ");

              // Calculate profit/loss for "sell" trades
              const profitLoss =
                trade.tradeType === "sell"
                  ? (trade.soldAt - trade.boughtAt) * trade.quantity
                  : 0;

              const profitLossFormatted =
                profitLoss > 0
                  ? `+${profitLoss.toFixed(2)}`
                  : `${profitLoss.toFixed(2)}`;

              const profitLossClass =
                profitLoss > 0 ? "text-green-500" : "text-red-500";

              return (
                <div
                  key={index}
                  className="history-card py-3 border-b-1 border-b-[#3c3c3c] flex flex-col bg-gradient-to-br from-violet-200 to-green-50 px-3 rounded-lg rounded-r-none"
                >
                  <div className="date text-[22px] font-bold text-gray-600 pb-3">
                    <span>{date.substring(3, 5) + " "}</span>
                    <span>{month[date.substring(0, 2)] + " "}</span>
                    <span>{date.substring(6, 11)}</span>
                  </div>
                  <div className="date-and-tradetype flex justify-between items-center">
                    <p className="text-[14px] font-normal text-gray-800">
                      {time.substring(0, 5) + time.substring(8, 11)}
                    </p>
                    <p className="text-[15px] font-bold">
                      <span
                        className={
                          trade.tradeType === "buy"
                            ? `text-green-600`
                            : `text-red-500`
                        }
                      >
                        {trade.tradeType.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div className="name-and-qty flex justify-between items-center">
                    <p className="font-medium text-[17px]">{trade.coinId}</p>
                    <p className="text-[14px] font-semibold">
                      <span
                        className={
                          trade.tradeType === "buy"
                            ? `h-[7px] w-[7px] bg-green-500 inline-block rounded-full items-center justify-center`
                            : `h-[7px] w-[7px] bg-red-500 inline-block rounded-full items-center justify-center`
                        }
                      ></span>
                      {" " + trade.quantity} qty
                    </p>
                  </div>
                  <div className="price flex justify-between items-center">
                    <p className="text-gray-600">
                      {`at ${currency.symbol}`}
                      {trade.tradeType === "buy"
                        ? `${trade.boughtAt}`
                        : `${trade.soldAt}`}
                    </p>
                    <p className="text-yellow-600 font-medium">
                      {`${currency.symbol}`}
                      {trade.tradeType === "buy"
                        ? (trade.boughtAt * trade.quantity).toFixed(2)
                        : (trade.soldAt * trade.quantity).toFixed(2)}
                      {/* Display profit/loss in parentheses */}
                      {trade.tradeType === "sell" && (
                        <span className={`ml-2 ${profitLossClass}`}>
                          ({profitLossFormatted})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default TradeHistory;
