import React, { useEffect, useState,useContext } from "react";
import { Link } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext.jsx";
const Trending = () => {
  const [trendingList, setTrendingList] = useState([]);
  const { currency } = useContext(CoinContext);

  const fetchTrendingData = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-qVw81LkoTJQPCBQc7Hz2nwYq",
      },
    };

    fetch("https://api.coingecko.com/api/v3/search/trending", options)
      .then((response) => response.json())
      .then((response) => setTrendingList(response.coins))
      .catch((err) => console.error(err));
  };
  

  useEffect(() => {
    fetchTrendingData();
  }, []);
  useEffect(() => {
    console.log(trendingList);
  }, [trendingList]);
  return (
    <>
      <div className="trending-container items-center mx-auto my-5 w-[500px] bg-gradient-to-br from-stone-900 to-slate-800 rounded-xl">
        <h1 className="text-[40px] px-6 py-6 font-medium">Trending</h1>
        {trendingList === 0 ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <div className="table-layout grid grid-cols-[3fr_1fr_1fr] py-4 px-7 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] border-t-[1px] border-t-solid border-t-[#3c3c3c] font-bold">
              <p>Coins</p>
              <p>Price</p>
              <p className="text-center">24H Change</p>
            </div>
            {trendingList.map((coin) => (
              <Link
                to={`/coin/${coin.item.id}`}
                className="table-layout grid grid-cols-[3fr_1fr_1fr] py-3 px-5 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] last:border-none font-medium"
                key={coin.item.id}
              >
                <div className="flex items-center gap-[10px]">
                  <img src={coin.item.small} alt="" className="w-9" />
                  <p>{coin.item.name + " (" + coin.item.symbol + ")"}</p>
                </div>
                <p>
                  {currency.symbol}
                  {coin.item.data.price.toLocaleString()}
                </p>
                <p
                  className={`text-center ${
                    coin.item.data.price_change_percentage_24h[currency.name] < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {Math.floor(
                    coin.item.data.price_change_percentage_24h[currency.name] * 100
                  ) / 100}
                  %
                </p>
              </Link>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Trending;
