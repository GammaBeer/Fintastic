import Navbar from "./components/Navbar/Navbar.jsx";
import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Coin from "./pages/Coin/Coin.jsx";
import Footer from "./components/Footer/Footer.jsx";
import UserLogin from "./pages/UserLogin/UserLogin.jsx";
function App() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {/* {showLogin?<UserLogin setShowLogin={setShowLogin}/>:<> </>} */}
      {showLogin ? (
        <UserLogin setShowLogin={setShowLogin} />
      ) : (
        <div className="app min-h-[100vh] text-white bg-gradient-to-br from-indigo-900 to-slate-800">
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:coinId" element={<Coin />} />
          </Routes>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
