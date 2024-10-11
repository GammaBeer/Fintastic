import React, { useContext, useState, useEffect } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Watchlist = () => {
  const { token, currency } = useContext(CoinContext);
  const [watchlist, setWatchlist] = useState([]);
  const [coinDataList, setCoinDataList] = useState([]);

  // Fetch the user's watchlist
  const getWatchlist = async () => {
    const sessionToken = localStorage.getItem("sessionToken");
    const decoded = jwtDecode(sessionToken);
    console.log(`decoded : ${decoded.email}`);
    const response = await axios.post(
      "http://localhost:5000/api/user/getWatchlist",
      { email: decoded.email }
    );
    console.log(response.data);

    if (response.data.success) {
      console.log(`watchlist : ${response.data.watchlist}`);
      setWatchlist(response.data.watchlist);
    }
  };

  // Fetch individual coin data from CoinGecko API
  const fetchCoinData = async (symbol) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": import.meta.env.VITE_API_KEY,
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol}`,
        options
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Load watchlist data from API based on the coins in the watchlist
  const loadWatchlistData = async () => {
    try {
      if (watchlist.length === 0) {
        console.log("Watchlist is empty, skipping fetch");
        return;
      }

      const data = await Promise.all(
        watchlist.map(async (coinId) => {
          const coinData = await fetchCoinData(coinId);
          return coinData;
        })
      );

      const filteredData = data.filter(
        (coin) => coin !== undefined && coin !== null
      );
      setCoinDataList(filteredData); // Set the fetched data in state
    } catch (err) {
      console.error("Error loading watchlist data:", err);
    }
  };

  // Effect for fetching the watchlist when the component mounts
  useEffect(() => {
    getWatchlist();
    // console.log(watchlist);
    
  }, []);

  // Effect for loading coin data whenever the watchlist changes
  useEffect(() => {
    if (watchlist.length > 0) {
      loadWatchlistData();
    }
  }, [watchlist]);

  return (
    <>
      <div className="watchlist-container items-center  mx-auto my-5 w-[689px] bg-gradient-to-br from-slate-900 to-violet-900 rounded-xl pb-9">
        <h1 className="text-[40px] px-6 py-6 font-medium">Watchlist</h1>
        {token ? (
          <>
            {coinDataList.length === 0 ? (
              <p className="text-center text-white text-[30px] font-extralight">
                {watchlist.length === 0
                  ? "Your watchlist is empty."
                  : "Loading..."}
              </p>
            ) : (
              <>
                <div className="table-layout grid grid-cols-[3fr_1fr_1fr] py-4 px-5 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] font-bold border-t-[1px] border-t-solid border-t-[#3c3c3c]">
                  <p>Coins</p>
                  <p>Price</p>
                  <p className="text-center">24H Change</p>
                </div>
                {coinDataList.map((coin) => (
                  <Link
                    to={`/coin/${coin.id}`}
                    className="table-layout grid grid-cols-[3fr_1fr_1fr] py-4 px-5 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] last:border-none font-medium"
                    key={coin.id}
                  >
                    <div className="flex items-center gap-[10px]">
                      <img src={coin.image.small} alt="" className="w-9" />
                      <p>{coin.name + " (" + coin.symbol + ")"}</p>
                    </div>
                    <p>
                      {currency.symbol}
                      {coin.market_data.current_price[
                        currency.name
                      ].toLocaleString()}
                    </p>
                    <p
                      className={`text-center ${
                        coin.market_data.market_cap_change_percentage_24h < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {Math.floor(
                        coin.market_data.market_cap_change_percentage_24h * 100
                      ) / 100}
                      %
                    </p>
                  </Link>
                ))}
              </>
            )}
          </>
        ) : (
          <p className="text-center text-white text-[30px] font-extralight">
            Please login to view your watchlist
          </p>
        )}
        {console.log(token)}
      </div>
    </>
  );
};

export default Watchlist;
