// import { set } from "mongoose";
import { createContext } from "react";
import { useState,useEffect } from "react";

export const CoinContext=createContext();

const CoinContextProvider=(props)=>{
    const [token, setToken] = useState("");
    const url = "http://localhost:5000";
    const [allCoins,setAllCoins]=useState([]);
    const [currency,setCurrency]=useState({
        name:"usd",
        symbol:"$"
    });

    const fetchAllCoin=async()=>{
        const options = {
            method: 'GET',
            headers: {accept: 'application/json', 'x-cg-demo-api-key': import.meta.env.VITE_API_KEY }
          };
          
          fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`, options)
            .then(response => response.json())
            .then(response => setAllCoins(response))
            .catch(err => console.error(err));
    }

    useEffect(() => {
        async function loadData() {
            await fetchAllCoin();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [currency])
    

    const contextValue={
        allCoins,
        currency,
        setCurrency,
        url,
        token,
        setToken,
    }

    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    )
}
export default CoinContextProvider;