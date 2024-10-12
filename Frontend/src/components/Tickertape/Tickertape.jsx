import React, { useContext, useEffect, useState } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";

import Marquee from "react-fast-marquee";

const Tickertape = () => {
  const { allCoins, currency } = useContext(CoinContext);
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    setTickerData(allCoins);
  }, [allCoins]);

  const formatChange = (change1, change2) => {
    return (
      <span className={change2 > 0 ? "text-green-500" : "text-red-500"}>
        {change1 > 0 ? "+" : ""}
        {change1.toLocaleString({
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })}{" "}
        ({change2 > 0 ? "+" : ""}
        {change2.toLocaleString({
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }) + "%"}
        )
      </span>
    );
  };

  return (
    <>
      <div className="ticker-tape-container bg-gray-800 flex flex-row">
        <Marquee pauseOnHover>
          {tickerData.slice(0, 15).map((coin, index) => {
            return (
              <div className="item-container items-start flex " key={coin.id}>
                <div
                  className={`ticker-tape-item flex flex-col justify-center w-max items-start px-6 py-[6px] text-white ${
                    index !== 15
                      ? "border-r border-gray-600 border-spacing-1"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                    <div className="ticker-tape-item-name text-sm">
                      {coin.name}
                    </div>
                  </div>
                  {/* Coin price */}
                  <div className="ticker-tape-item-price text-base font-semibold">
                    {currency.symbol}
                    {coin.current_price.toLocaleString({
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </div>
                  {/* Price change percentage */}
                  <div className="ticker-tape-item-change text-sm font-medium">
                    {formatChange(
                      coin.price_change_24h,
                      coin.price_change_percentage_24h
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Marquee>
      </div>
    </>
  );
};

export default Tickertape;
