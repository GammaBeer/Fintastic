import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts'


const LineChart = ({historicalData}) => {
    const [data,setData]=useState([["Date","Prices"]])
    useEffect(()=>{
        let chartData=[["Date","Prices"]];
        if(historicalData && historicalData.prices){
            historicalData.prices.forEach((price)=>{
                chartData.push([`${new Date(price[0]).toLocaleDateString().slice(0,-5)}`,price[1]])
            })
            setData(chartData);
        }
    },[historicalData])
  return (
    <Chart
        chartType='LineChart'
        data={data}
        height="100%"
        legendToggle
    />
  )
}

export default LineChart