import { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets.js'

import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Navbar = ({ setShowLogin }) => {

  const navigate = useNavigate();
  const [menu, setMenu] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);

  const { getTotalCartAmount, user, isAdmin, logout } = useContext(AppContext);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [])

  const handleAdmin = async () => {
    if (isAdmin) {
      navigate('/admin');
      setShowDropdown(false)
    } else {
      toast.error("You are not authorized to access this page.")
    }
  }



  const hideSearchButton = location.pathname === "/foodItems";

  return (
    <div className='navbar py-5 flex justify-between items-center '>
      <img onClick={() => navigate('/')} src={assets.delight_logo} alt="" className='max-lg:w-25 logo w-36 ' />
      <div className="max-md:hidden max-md:gap-3 max-md:text-[16px] max-lg:gap-3 max-lg:text-[15px] navbar-menu flex gap-5 text-[#49557e]">
        <Link to='/' onClick={() => setMenu("home")} className={`${menu === "home" ? "navActive" : ""} lg:text-[20px]`}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "navActive" : ""} lg:text-[20px]`}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={`${menu === "mobile-app" ? "navActive" : ""} lg:text-[20px]`}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={`${menu === "contact-us" ? "navActive" : ""} lg:text-[20px]`}>contact-us</a>
      </div>
      <div className="relative max-md:gap-5 max-lg:gap-7.5 navbar-right flex items-center gap-10">
        {!hideSearchButton && <button
          onClick={() => navigate('/foodItems')}
          className="cursor-pointer"
        >
          <img src={assets.search_icon} alt="search" className="h-5 w-5 sm:h-8 sm:w-8 " /></button>
        }
        <div className="relative">
          <img onClick={() => navigate('/cart')} className='cursor-pointer max-md:w-6 max-lg:w-5 ' src={assets.basket_icon} alt="" />
          <div className={`${getTotalCartAmount() ? "dot absolute min-w-2.5 min-h-2.5 bg-[tomato] -top-2 -right-2 rounded-2xl" : ""}`}></div>
        </div>
        {!user ? (
          <button onClick={() => setShowLogin(true)} className='max-md:text-[15px] max-md:py-1.5 max-md:px-5 max-lg:py-2 max-lg:px-6.25  bg-transparent text-[16px] text-[#49557e] border border-[tomato] py-2 px-7 rounded-3xl transition duration-300 cursor-pointer hover:bg-[#fff4f2]'>sign in</button>
        ) : (
          <div className="navbar-profile " ref={dropdownRef}>
            <div className="navbar-image">
              <img onClick={() => setShowDropdown(prev => !prev)} className='rounded-full w-12 h-12 max-md:w-6 max-md:h-6 hover:opacity-85 transition-opacity delay-100 cursor-pointer' src={user.profile_image ? user.profile_image : assets.profile_icon} alt='profile' />
            </div>
            {showDropdown && (
              <ul className='profile-dropdown absolute left-1 mt-1 md:left-10 max-md:right-0 z-10 flex flex-col gap-2 bg-[#fff2ef] py-3 px-3 md:py-2 md:px-3 md:w-[max(14vw,28px)]  rounded-sm border border-[tomato] outline-2 outline-white list-none '>
                <li onClick={() => { navigate('/profile'); setShowDropdown(false) }} className='cursor-pointer hover:text-[tomato] lg:flex gap-[2vw] items-center max-md:text-sm'>profile</li>
                <hr />
                <li onClick={() => { navigate('/placeOrder'); setShowDropdown(false) }} className=' cursor-pointer hover:text-[tomato]  lg:flex gap-[2vw] items-center max-md:text-sm'><img className='w-7 h-7  max-md:w-5 max-md:h-5' src={assets.bag_icon} alt="bag-icon" />Place Orders</li>
                <hr />
                <li onClick={() => { navigate('/orders'); setShowDropdown(false) }} className=' cursor-pointer hover:text-[tomato]  lg:flex gap-[2vw] items-center max-md:text-sm'><img className='w-7 h-7  max-md:w-5 max-md:h-5' src={assets.bag_icon} alt="bag-icon" />Orders</li>
                <hr />
                <li onClick={logout} className='cursor-pointer lg:flex gap-[2vw] items-center hover:text-[tomato] max-md:text-sm'><img className='w-7 h-7 max-md:w-5 max-md:h-5' src={assets.logout_icon} alt="logout-icon" />Logout</li>
                <hr />
                <li onClick={() => handleAdmin()} className='flex items-center hover:text-[tomato] justify-center cursor-pointer rounded-2xl p-1 hover:bg-[#fffcfc]'><p>admin</p></li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar