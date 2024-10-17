import React from "react";
import TradingViewWidget from "../TradingViewWidget/TradingViewWidget.jsx";

const HistoricChart = ({ sym, setSym }) => {
  return (
    <>
      <div className="h-[91%] p-1 rounded-md">
        <TradingViewWidget sym={sym} setSym={setSym} />
      </div>
      <div className="bg-slate-950">
        <p className="text-center p-1 text-[20px] font-semibold">
          TradingView Widget is used,Price difference may be seen
        </p>
      </div>
    </>
  );
};

export default HistoricChart;
