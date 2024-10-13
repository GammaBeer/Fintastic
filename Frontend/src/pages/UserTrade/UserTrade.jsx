import React, { useContext, useState, useEffect } from "react";
import Tickertape from "../../components/Tickertape/Tickertape";
import HistoricChart from "../../components/HistoricChart/HistoricChart.jsx";
import { CoinContext } from "../../context/CoinContext.jsx";
import TradeCoinInfo from "../../components/TradeCoinInfo/TradeCoinInfo.jsx";
import { useParams } from "react-router-dom";
import TradeDropdownMenu from "../../components/TradeDropdownMenu/TradeDropdownMenu.jsx";

const UserTrade = () => {
  const { currency } = useContext(CoinContext);
  const [coinData, setCoinData] = useState(null);  // Initially set to null
  const {coinId}=useParams();
  console.log(coinId);

  const fetchCoinData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        options
      );
      const data = await response.json();
      setCoinData(data);  // Set fetched data
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoinData();  // Fetch coin data on component mount
  }, [currency,coinId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Tickertape />

      <div className="main-trading-area bg-black min-h-screen min-w-full flex flex-row gap-1 p-1">
        <div className="analysis-area w-[74%] flex flex-col gap-1">
          <div className="coin-info bg-gray-800 rounded-sm w-full h-[11%] flex flex-row items-center p-2 gap-2">
            <TradeDropdownMenu />
            <TradeCoinInfo coinData={coinData} />  {/* Pass coinData as prop */}
          </div>
          <div className="coin-analysis flex flex-row w-full h-full gap-1">
            <div className="coin-chart w-[70%] h-full bg-gray-800 rounded-sm">
              Chart Goes here
            </div>
            <div className="coin-order w-[30%] h-full bg-gray-800 rounded-sm">
              Order goes here
            </div>
          </div>
        </div>
        <div className="trade-area w-[26%] ">
          <div className="trade-container w-full h-full bg-gray-800 rounded-sm">
            Buy/Selling Goes here
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrade;
