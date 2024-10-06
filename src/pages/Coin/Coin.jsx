import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import './Coin.css';
import LineChart from '../../components/LineChart/LineChart.jsx';

const Coin = () => {
  const { currency } = useContext(CoinContext);
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  
  // Fetch coin data from API
  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-qVw81LkoTJQPCBQc7Hz2nwYq' },
    };

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch historical data for the coin
  const fetchHistoricalData = async () => {
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-qVw81LkoTJQPCBQc7Hz2nwYq'}
      };
      
      fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10`, options)
        .then(response => response.json())
        .then(response => setHistoricalData(response))
        .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [currency, coinId]);

  // Display a loading spinner while data is being fetched
  if (!coinData || !historicalData) {
    return (
      <div className='spinner grid place-self-center min-h-[80vh]'>
        <div className="spin w-16 h-16 place-self-center border-[5px] border-solid border-[#bdbdbd] border-t-[#4500c6] rounded-[50%]"></div>
      </div>
    );
  }

  return (
    <div className='coin py-0 px-5'>
      <div className="coin-name flex flex-col items-center gap-5 my-[50px] mx-auto mb-12">
        {coinData.image?.large ? (
          <img src={coinData.image.large} alt={coinData.name} className='max-w-[106px] '/>
        ) : (
          <p>No Image Available</p>
        )}
        <p>
          <b className='text-[44px] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>{coinData.name} ({coinData.symbol?.toUpperCase()})</b>
        </p>
      </div>
      <div className="coin-chart max-w-[600px] h-64 m-auto shadow-md rounded">
        <LineChart historicalData={historicalData} />
      </div>
      <div className="coin-info max-w-[600px] my-[50px] mx-auto flex flex-col text-[18px] font-medium">
        <ul className='flex justify-between py-[10px] px-0 border-b-[1px] border-b-solid border-b-[#5f5d5f] list-none'>
            <li>Crypto Market Rank</li>
            <li className='font-normal'>{coinData.market_cap_rank}</li>
        </ul>
        <ul className='flex justify-between py-[10px] px-0 border-b-[1px] border-b-solid border-b-[#5f5d5f] list-none'>
            <li>Crypto Price</li>
            <li className='font-normal'>{currency.symbol} {coinData.market_data.current_price[currency.name].toLocaleString()}</li>
        </ul>
        <ul className='flex justify-between py-[10px] px-0 border-b-[1px] border-b-solid border-b-[#5f5d5f] list-none'>
            <li>Crypto Cap</li>
            <li className='font-normal'>{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
        </ul>
        <ul className='flex justify-between py-[10px] px-0 border-b-[1px] border-b-solid border-b-[#5f5d5f] list-none'>
            <li>24H High</li>
            <li className='font-normal'>{currency.symbol} {coinData.market_data.high_24h[currency.name].toLocaleString()}</li>
        </ul>
        <ul className='flex justify-between py-[10px] px-0 border-b-[1px] border-b-solid border-b-[#5f5d5f] list-none'>
            <li>24H Low</li>
            <li className='font-normal'>{currency.symbol} {coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;
