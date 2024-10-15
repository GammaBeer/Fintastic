import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Coin from "./pages/Coin/Coin.jsx";
import Footer from "./components/Footer/Footer.jsx";
import UserLogin from "./pages/UserLogin/UserLogin.jsx";
import UserWatchlist from "./pages/UserWatchlist/UserWatchlist.jsx";
import UserTrade from "./pages/UserTrade/UserTrade.jsx";
import UserPortfolio from "./pages/UserPortfolio/UserPortfolio.jsx";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  // bg-gradient-to-tl from-neutral-900 to-neutral-900
  // bg-gradient-to-br from-indigo-900 to-slate-800
  // bg-gradient-to-tl from-stone-800 to-slate-800

  return (
    <>
      {showLogin ? (
        <UserLogin setShowLogin={setShowLogin} />
      ) : (
        <div className="app min-h-screen flex flex-col bg-gradient-to-tl from-stone-800 to-slate-800 text-white">
          <Navbar setShowLogin={setShowLogin} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/coin/:coinId" element={<Coin />} />
              <Route path="/UserWatchlist" element={<UserWatchlist />} />
              <Route path="/UserTrade" element={<UserTrade />} />
              <Route path="/UserTrade/coin/:coinId" element={<UserTrade />} />
              <Route path="/UserPortfolio" element={<UserPortfolio />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
