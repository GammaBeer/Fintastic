import React from "react";
import Github from '../../assets/github-mark-white.png';
const Footer = () => {
  // https://www.coingecko.com/
  return (
    <footer className="w-full flex flex-col items-center gap-2 py-4 text-center text-[17px]bg-gradient-to-tl from-stone-800 to-slate-800 border-t-2 border-t-gray-700">
      <p>Copyright © 2024, Fintastic - All Right Reserved.</p>
      <p>Powered by <a href="https://www.coingecko.com/" className="underline">CoinGecko Developer API</a></p>
      <p className="w-[200px] flex items-center gap-3"><img src={Github} className="w-[40px]" alt="" /><a href="https://github.com/GammaBeer/Fintastic.git">Fintastic.git</a></p>
    </footer>
  );
};

export default Footer;
