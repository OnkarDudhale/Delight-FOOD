import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import UserOrders from './pages/UserOrders'
import Footer from './components/Footer'
import LoginPopUp from './components/LoginPopUp'
import AdminLayout from './pages/admin/AdminLayout'
import AddFoodItem from './pages/admin/AddFoodItem'
import ListFoodItems from './pages/admin/ListFoodItems'
import Orders from './pages/admin/Orders'
import { Toaster } from 'react-hot-toast'

import Profile from './pages/Profile'
import Verify from './pages/Verify'
import { SearchResults } from './pages/SearchResults'

const App = () => {

  const isAdminPath = useLocation().pathname.includes('/admin')

  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className='min-h-screen flex flex-col'>
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <Toaster />


      <main className={`${isAdminPath ? "" : 'app  grow'} `}>
        {isAdminPath ? null : <Navbar setShowLogin={setShowLogin} />}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart setShowLogin={setShowLogin} />} />
          <Route path='/placeOrder' element={<PlaceOrder />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/orders' element={<UserOrders />} />
          <Route path='/foodItems' element={<SearchResults />} />
          <Route path='/verify' element={<Verify />} />

          {/* Admin Routes */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<AddFoodItem />} />
            <Route path='list' element={<ListFoodItems />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </main>
      {isAdminPath ? null : <Footer />}
    </div >
  )
}

export default App