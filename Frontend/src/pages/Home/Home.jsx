import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";
import { Link } from "react-router-dom";
import './Home.css'
const Home = () => {
  const { allCoins, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input,setInput]=useState("");

  const inputHandler=(event)=>{
    setInput(event.target.value);
    if(event.target.value===""){
      setDisplayCoin(allCoins);

    }
  }
  const searchHandler=async(event)=>{
    event.preventDefault();
    const coins = await allCoins.filter((coin)=>{
        return coin.name.toLowerCase().includes(input.toLowerCase());
    })
    setDisplayCoin(coins);
  }
  useEffect(() => {
    setDisplayCoin(allCoins);
  }, [allCoins]);

  return (
    <>
      <div className="home py-0 px-10px pb-24">
        <div className="hero max-w-[600px] my-20 mx-auto flex flex-col items-center text-center gap-7">
          <h1 className="text-[max(4vw,36px)] font-bold">Crypto Marketplace</h1>
          <p className="w-[75%] text-[e3e3e3] font-normal text-[17px] mb-3">
            Welcome! <br /> Explore various Cryptos and track them with real time data
          </p>
          <form onSubmit={searchHandler} className="p-2 w-[80%] bg-white rounded-md text-xl flex justify-between items-center gap-[10px] ">
            <input
                list="coinlist"
                onChange={inputHandler}
                value={input}
                required
              type="text"
              placeholder="Search crypto.."
              className="flex-1 text-[16px] outline-none border-none pl-[10px] text-black"
            />
            <datalist id='coinlist'>
                {allCoins.map((coin,index)=>(
                    <option key={index} value={coin.name}/>
                ))}
            </datalist>

            <button
              type="submit"
              className="border-none bg-[#7927ff] text-white text-[16px] py-[10px] px-[30px]  rounded-md cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
        <div className="crypto-table max-w-[800px] m-auto rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800">
          <div className="table-layout grid grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr] py-4 px-5 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            <p>#</p>
            <p>Coins</p>
            <p>Price</p>
            <p className="text-center">24H Change</p>
            <p className="market-cap text-right">Market Cap</p>
          </div>
          {displayCoin.slice(0, 10).map((coin, index) => (
            <Link to={`/coin/${coin.id}`}
              className="table-layout grid grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr] py-4 px-5 items-center border-b-[1px] border-b-solid border-b-[#3c3c3c] last:border-none font-medium"
              key={index}
            >
              <p>{coin.market_cap_rank}</p>
              <div className="flex items-center gap-[10px]">
                <img src={coin.image} alt="" className="w-9" />
                <p>{coin.name + " - " + coin.symbol}</p>
              </div>
              <p>
                {currency.symbol}
                {coin.current_price.toLocaleString()}
              </p>
              <p
                className={`text-center ${
                  coin.price_change_percentage_24h < 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {Math.floor(coin.price_change_percentage_24h * 100) / 100}%
              </p>
              <p className="market-cap text-right">
                {currency.symbol}
                {coin.market_cap.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
