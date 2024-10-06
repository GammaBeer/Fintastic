import React from 'react'
import cryptologo from '../../assets/cryptologo.png'
import { CoinContext } from '../../context/CoinContext.jsx'
import {useContext} from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const {setCurrency,currency}=useContext(CoinContext);
    const currencyHandler=(event)=>{
        switch(event.target.value){
            case "usd":{
                setCurrency({name :"usd",symbol:"$"});
                break;
            }
            case "eur":{
                setCurrency({name :"eur",symbol:"€"});
                break;
            }
            case "inr":{
                setCurrency({name :"inr",symbol:"₹"});
                break;
            }
            default:{
                setCurrency({name :"usd",symbol:"$"});
                break;
            }
        }
    }
    
  return (
    <>
        <div className='navbar flex items-center justify-between p-[20px] px-[10%] text-[#ddd] border-b-[2px] border-solid border-[#3c3c3c]'>
            <Link to={'/'}>
                <img src={cryptologo} alt="" className='[200px] h-[50px] rounded-lg'/> 
            </Link>
            <ul className='flex gap-10 list-none font-medium text-[17px]'>
                <Link to={'/'}>
                    <li className='cursor-pointer'>Home</li>
                </Link>
                <li className='cursor-pointer'>Features</li>
                <li className='cursor-pointer'>Pricing</li>
                <li className='cursor-pointer'>Blog</li>
            </ul>
            <div className="nav-right flex items-center gap-[max(1vw,12px)]">
                <select onChange={currencyHandler} className='bg-[#09005c] py-[5px] px-2 rounded-[6px] border-solid  border-white  text-white'>
                    <option value="usd" className='bg-[#09005c] text-white'>USD</option>    
                    <option value="eur" className='bg-[#09005c] text-white'>EUR</option>
                    <option value="inr" className='bg-[#09005c] text-white'>INR</option>
                </select>
                <button className='bg-white items-center gap-2.5 py-2.5 px-6 rounded-[20px] text-[15px] font-medium text-[#393939] border-none cursor-pointer'>Sign Up <img src="" alt="" /></button>
            </div>
        </div>
    </>
  )
}

export default Navbar