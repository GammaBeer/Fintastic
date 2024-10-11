import React, { useContext, useState } from "react";
import { CoinContext } from "../../context/CoinContext.jsx";
import axios from "axios";

const UserLogin = ({ setShowLogin }) => {
  const [activeTab, setActiveTab] = useState("login"); // Manage tab switching
  const { url, setToken } = useContext(CoinContext);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (activeTab === "login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    const response = await axios.post(newUrl, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("sessionToken", response.data.sessionToken);
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  };


  return (
    <div className="login-popup absolute z-[1] w-full h-full bg-gradient-to-br from-indigo-900 to-slate-800 grid">
      <div className="bg-white w-[350px] h-[350px] mx-auto p-6 rounded-lg shadow-black shadow-md place-self-center ">
        <div className="flex justify-between mb-6">
          <button
            className={`w-1/2 py-2 font-semibold ${
              activeTab === "login"
                ? "bg-[#7927ff] text-white rounded-t-lg"
                : "bg-gray-400 rounded-t-lg"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Log In
          </button>
          <button
            className={`w-1/2 py-2 font-semibold ${
              activeTab === "signup"
                ? "bg-[#7927ff] text-white rounded-t-lg"
                : "bg-gray-400 rounded-t-lg"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "login" && (
          <div className="flex flex-col space-y-4">
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="text"
              placeholder="Enter email"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7927ff]"
            />
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Enter password"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7927ff]"
            />
            <button
              onClick={onLogin}
              className="bg-[#7927ff] text-white py-2 rounded-md "
            >
              Login
            </button>
            <a href="/" className="text-sm text-gray-500 text-center">
              Forgotten account?
            </a>
          </div>
        )}

        {activeTab === "signup" && (
          <div className="flex flex-col space-y-4">
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Enter Name"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7927ff]"
            />
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Enter email"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7927ff]"
            />
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Create password"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7927ff]"
            />
            <button
              onClick={onLogin}
              className="bg-[#7927ff] text-white py-2 rounded-md"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
      <div
        onClick={() => setShowLogin(false)}
        className="text-center items-center mx-auto text-white text-[30px] font-bold cursor-pointer  bg-pink-800 w-[300px] h-[50px] rounded-3xl"
      >
        Back to Home Page
      </div>
    </div>
  );
};

export default UserLogin;
