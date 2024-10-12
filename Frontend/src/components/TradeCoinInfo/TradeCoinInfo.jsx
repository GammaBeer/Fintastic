import React, { useContext } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";

const TradeCoinInfo = ({ coinData }) => {
  const { currency } = useContext(CoinContext);


  const formatChange = (change) => {
    return (
      <span className={change > 0 ? "text-green-500" : "text-red-500"}>
        {change > 0 ? "+" : ""}
        {change.toLocaleString({
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })}{"%"}
      </span>
    );
  };

  return (
    <>
      {coinData ? (
        <div className="coin-info-area flex flex-row gap-8">
          <div className="coin-image-name flex flex-row items-center gap-2">
            {coinData.image?.large ? (
              <img
                src={coinData.image.large}
                alt={coinData.name}
                className="w-9"
              />
            ) : (
              <p>No Image Available</p>
            )}
            <div className="flex flex-col">
              <h1>{coinData.symbol?.toUpperCase()}</h1>
              <h2>{coinData.name}</h2>
            </div>
          </div>
          <div className="border-r border-gray-600  w-1 "></div>
          <div className="price flex items-center font-medium">
            {currency.symbol}{" "}
            {coinData.market_data?.current_price[currency.name]?.toLocaleString({
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </div>
          <div className="24h-change flex flex-col">
            <h1 className="text-[13px] text-gray-400">24H Change</h1>
            <h2 className="text-[14px] font-medium">{formatChange(coinData.market_data?.price_change_percentage_24h_in_currency[currency.name])}</h2>
          </div>
          <div className="24h-high flex flex-col">
            <h1 className="text-[13px] text-gray-400">24H High</h1>
            <h2 className="text-[14px] font-medium">{currency.symbol}{coinData.market_data?.high_24h[currency.name]?.toLocaleString()}</h2>
          </div>
          <div className="24h-low flex flex-col">
            <h1 className="text-[13px] text-gray-400">24H High</h1>
            <h2 className="text-[14px] font-medium">{currency.symbol}{coinData.market_data?.low_24h[currency.name]?.toLocaleString()}</h2>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default TradeCoinInfo;
