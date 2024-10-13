import React, { useContext, useState, useEffect } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";
import { Link } from "react-router-dom";
import "./TradeDropdownMenu.css"; // Import the CSS file for custom styles

const TradeDropdownMenu = () => {
  const { allCoins, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [input, setInput] = useState("");
  let hideMenuTimeout;

  const inputHandler = (event) => {
    const inputValue = event.target.value;
    setInput(inputValue);

    // Dynamically filter coins based on input
    const filteredCoins = allCoins.filter((coin) =>
      coin.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setDisplayCoin(filteredCoins);

    if (inputValue === "") {
      setDisplayCoin(allCoins); // Reset to all coins if input is cleared
    }
  };

  useEffect(() => {
    setDisplayCoin(allCoins);
  }, [allCoins]);

  // Function to hide menu after a delay
  const hideMenuWithDelay = () => {
    hideMenuTimeout = setTimeout(() => {
      setShowMenu(false);
    }, 1000);
  };

  // Function to clear the hide delay when hovering back
  const clearHideMenuTimeout = () => {
    clearTimeout(hideMenuTimeout);
  };

  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={() => {
          setShowMenu(true);
          clearHideMenuTimeout();
        }}
        onMouseLeave={hideMenuWithDelay}
      >
        {/* Dropdown Toggle Icon */}
        <div className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </div>

        {/* Dropdown Menu - Visible when showMenu is true */}
        {showMenu && (
          <div
            className="absolute left-0 bg-gray-700 text-white inline-block flex-col z-10 mt-6 p-2"
            onMouseEnter={clearHideMenuTimeout}
            onMouseLeave={hideMenuWithDelay}
            style={{
              width: "420px", // Fixed width for dropdown
            }}
          >
            <div className="flex flex-row items-center p-1 justify-center">
              <div className="w-[95%] bg-white rounded-md text-sm flex justify-between items-center p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="black"
                >
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
                <input
                  list="coinlist"
                  onChange={inputHandler}
                  value={input}
                  type="text"
                  placeholder="Search crypto.."
                  className="flex-1 text-[16px] p-1 outline-none rounded-md border-none text-black"
                />
                <datalist id="coinlist">
                  {allCoins.map((coin, index) => (
                    <option key={index} value={coin.name} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Non-scrollable Header */}
            <div className="menu-table items-center">
              <div className="table-layout grid grid-cols-[0.5fr_0.5fr_0.5fr_0.1fr] p-2 items-center border-b-[1px] border-b-solid border-b-black font-sm text-[13px] text-yellow-400">
                <p className="flex items-center justify-start">Trading Pairs</p>
                <p className="flex justify-end">Price</p>
                <p className="flex justify-end">24H %</p>
              </div>
            </div>

            {/* Scrollable Coin List */}
            <div
              className="coin-list"
              style={{
                maxHeight: "300px", // Set a fixed height for the coin list area
                overflowY: "auto",
                // Enable vertical scrolling
              }}
            >
              {displayCoin.map((coin) => (
                <Link
                  to={`/UserTrade/coin/${coin.id}`}
                  key={coin.id}
                  className="table-layout grid grid-cols-[0.5fr_0.5fr_0.5fr_0.1fr] p-2 items-center border-b-[1px] border-b-solid border-b-black font-medium text-[13px] hover:bg-gray-600"
                >
                  <div className="flex items-center gap-[10px]">
                    <img src={coin.image} alt="" className="w-5" />
                    <p>{coin.symbol}</p>
                  </div>
                  <p className="flex justify-end">
                    {currency.symbol}
                    {coin.current_price}
                  </p>
                  <p className="flex justify-end">
                    {coin.price_change_percentage_24h < 0 ? (
                      <span className="text-red-400">
                        {coin.price_change_percentage_24h.toLocaleString()}%
                      </span>
                    ) : (
                      <span className="text-green-400">
                        +{coin.price_change_percentage_24h.toLocaleString()}%
                      </span>
                    )}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TradeDropdownMenu;
