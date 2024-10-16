import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import cryptologo from "../../assets/cryptologo.png";
import { CoinContext } from "../../context/CoinContext.jsx";
import { useContext } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import profileicon from "../../assets/profileicon.png";
import logout_Icon from "../../assets/logout_Icon.png";
import Logo from "../../assets/Logo.png";
import svgLogo from "../../../public/svgLogo.svg";
import axios from "axios";

const Navbar = ({ setShowLogin }) => {
  const { setCurrency, currency, token, setToken,balance } = useContext(CoinContext);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionToken");
    setToken("");
    navigate("/");
  };
  const decodeSessionToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded && decoded.name && decoded.email) {
        setUsername(decoded.name);
      }
    } catch (error) {
      console.error("Error decoding session token:", error);
    }
  };


  useEffect(() => {
    const runFunctions = async () => {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        await decodeSessionToken(sessionToken);
      }
    };
    runFunctions();
  }, []);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", symbol: "€" });
        break;
      }
      case "inr": {
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
    }
  };

  useEffect(()=>{

  },[token,balance])

  return (
    <>
      <div className="navbar flex items-center justify-between p-[20px] px-[10%] text-[#ddd] border-b-[2px] border-solid border-[#3c3c3c]">
        <Link to={"/"}>
          <img
            src={cryptologo}
            alt=""
            className="[200px] h-[55px] rounded-lg"
          />
        </Link>
        <ul className="flex gap-10 list-none font-medium text-[17px]">
          <Link to={"/"}>
            <li className="cursor-pointer hover:underline">Home</li>
          </Link>
          <Link to={"/UserWatchList"}>
            <li className="cursor-pointer hover:underline">Watchlist</li>
          </Link>
          <Link to={"/UserTrade/coin/bitcoin"}>
            <li className="cursor-pointer hover:underline">Trade</li>
          </Link>
          <Link to={"/UserPortfolio"}>
            <li className="cursor-pointer hover:underline">Portfolio</li>
          </Link>
        </ul>
        <div className="nav-right flex items-center gap-[max(1vw,12px)]">
          <select
            onChange={currencyHandler}
            className="bg-[#09005c] py-[5px] px-2 rounded-[6px] border-solid font-medium border-white  text-white"
          >
            <option value="usd" className="bg-[#09005c] text-white font-medium">
              USD
            </option>
            <option value="eur" className="bg-[#09005c] text-white font-medium">
              EUR
            </option>
            <option value="inr" className="bg-[#09005c] text-white font-medium">
              INR
            </option>
          </select>

          {!token ? (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white items-center gap-2.5 py-2.5 px-6 rounded-[20px] text-[15px] font-medium text-[#393939] border-none cursor-pointer"
            >
              Sign Up <img src="" alt="" />
            </button>
          ) : (
            <div className="navbar-profile relative flex items-center gap-2 bg-[#1f1037] rounded-2xl px-2 py-1 justify-center">
              <img
                src={profileicon}
                alt="Profile Icon"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-white">{username}</h2>
              <ul className="navbar-profile-dropdown absolute hidden">
                <li className="text-black flex flex-col  px-7 py-2 items-center justify-center border-b-black border-b-2">
                  <p className="text-sm">balance</p>
                  <div className="text-[24px] font-bold">{balance && currency.symbol + balance.toLocaleString()}</div>
                </li>
                <li
                  onClick={logout}
                  className="cursor-pointer p-2  text-black flex px-7 gap-3 font-semibold hover:underline justify-center"
                >
                  <img src={logout_Icon} alt="" className="w-6" />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
