import React,{useContext, useEffect} from "react";
import CurrentHoldings from "../../components/CurrentHoldings/CurrentHoldings.jsx";
import TradeHistory from "../../components/TradeHistory/TradeHistory.jsx";
import { CoinContext } from "../../context/CoinContext.jsx";

const UserPortfolio = () => {
  const {token} = useContext(CoinContext);
  useEffect(()=>{
    
  },[token]);
  return (
    <>
      {token ?
        <div className="main-page flex">
          <div className="holdings-area w-[50%] p-4 m-4">
            <CurrentHoldings />
          </div>
          <div className="history-area w-[50%] p-4 m-4">
            <TradeHistory />
          </div>
        </div>
        :
        <>
          <div className="flex items-center m-auto justify-center p-[160px] text-[40px] font-medium">
            <h1> <span className="text-yellow-400 hover:underline"> Login/Register </span>to View your Portfolio</h1>
          </div>
        </>
      }
    </>
  );
};

export default UserPortfolio;
