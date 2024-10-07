import Navbar from './components/Navbar/Navbar.jsx'
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Coin from './pages/Coin/Coin.jsx'
import Footer from './components/Footer/Footer.jsx'
function App() {

  return (
    <>
      {/* <div className='app min-h-[100vh] text-white bg-gradient-to-r from-cyan-500 to-blue-500 '> */}
      <div className='app min-h-[100vh] text-white bg-gradient-to-br from-indigo-900 to-slate-800'>
      {/* background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */}
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/coin/:coinId' element={<Coin />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
