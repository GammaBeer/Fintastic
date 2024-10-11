import React, { useContext, useState } from "react";
import Watchlist from "../../components/Watchlist/Watchlist.jsx";
import Trending from "../../components/Trending/Trending.jsx";
import { CoinContext } from "../../context/CoinContext.jsx";
import { Navigate, useNavigate } from "react-router-dom";

const UserWatchlist = () => {
  const [add, setAdd] = useState(false);
  const { allCoins, token } = useContext(CoinContext);
  const [input, setInput] = useState("");
  const [displayCoin, setDisplayCoin] = useState([]);
  const navigate = useNavigate();

  const inputHandler = (event) => {
    setInput(event.target.value);
    if (event.target.value === "") {
      setDisplayCoin(allCoins); // ensure setDisplayCoin is properly defined
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    if (input.trim() !== "") {
      navigate(`/coin/${input}`);
    }
  };

  return (
    <>
      <div className="main-page flex mb-7">
        <div className="trending-area w-[40%]">
          <Trending />
        </div>
        <div className="watchlist-area w-[60%]">
          <Watchlist />
          <div className="Add-area">
            <div className="flex items-center justify-center">
              {token ? (
                <>
                  {!add ? (
                    <div
                      onClick={() => setAdd(true)}
                      className="add w-[100px] bg-black bg-opacity-85 cursor-pointer text-center py-2 px-1 rounded-full flex items-center justify-center gap-1 shadow-md shadow-black"
                    >
                      Add
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#e8eaed"
                        >
                          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                        </svg>
                      </span>
                    </div>
                  ) : (
                    <div>
                      <form
                        onSubmit={searchHandler}
                        className="p-2 w-[100%] bg-transparent text-xl flex justify-center items-center mt-5"
                      >
                        <div className="relative w-[80%]">
                          <input
                            list="coinlist"
                            onChange={inputHandler}
                            value={input}
                            required
                            type="text"
                            placeholder="Search crypto.."
                            className="w-[300px] pl-5 pr-4 py-3 rounded-md rounded-r-none text-[16px] outline-none border border-gray-500 focus:border-[#7927ff] text-black font-medium"
                          />
                          <datalist id="coinlist">
                            {allCoins.map((coin, index) => (
                              <option key={index} value={coin.id} />
                            ))}
                          </datalist>
                        </div>

                        <button
                          type="submit"
                          className="bg-gradient-to-tl from-slate-900 to-violet-900 hover:bg-[#580fd6] rounded-l-none transition-colors text-white font-medium text-[16px] py-[13px] px-[35px] rounded-md cursor-pointer"
                        >
                          Search
                        </button>
                        <div className="m-3 bg-gradient-to-bl from-red-800 to-red-700 w-8 p-1 rounded-full cursor-pointer" onClick={()=>setAdd(false)}>{""}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#e8eaed"
                          >
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                          </svg>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserWatchlist;
