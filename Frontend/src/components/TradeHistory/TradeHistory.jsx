import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CoinContext } from "../../context/CoinContext.jsx";

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
        setTradeHistory(response.data.history);
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
      <div className="history-container bg-purple-700 ">
        <h1>Trade History</h1>
        {tradeHistory.length===0 ? (
          <>No History yet! Start Investing</>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              {tradeHistory.map((trade, index) => {
                console.log("trade", trade);
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

                var s = new Date(trade.tradeDate).toLocaleString(undefined, {
                  timeZone: "Asia/Kolkata",
                });
                const [date, time] = s.split(", ");

                return (
                  <div
                    key={index}
                    className="history-card py-3 border-b-4 border-b-black flex flex-col"
                  >
                    <div className="date text-[22px] font-semibold pb-3">
                      <span>{date.substring(3, 5) + " "}</span>
                      <span>{month[date.substring(0, 2)] + " "}</span>
                      <span>{date.substring(6, 11)}</span>
                    </div>
                    <div className="date-and-tradetype flex justify-between items-center">
                      <p className="text-[14px]">
                        {time.substring(0, 5) + time.substring(8, 11)}
                      </p>
                      <p className="mr-3 text-[13px]">{trade.tradeType}</p>
                    </div>
                    <div className="name-and-qty flex justify-between items-center">
                      <p className="font-medium text-[17px]">{trade.coinId}</p>
                      <p className="mr-3 text-sm">{trade.quantity} qty</p>
                    </div>
                    <div className="price flex justify-end">
                      <p className="text-right">
                        {currency.symbol}
                        {trade.tradeType === "buy"
                          ? trade.boughtAt
                          : trade.soldAt}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TradeHistory;
