import React, { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './Components/Home';
import Cart from './Components/Cart';
import Order from './Components/Order';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import WhishList from './Components/WhishList';


function App() {

  const cart = useSelector((state) => state.cart);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);


  return (
    <>
      <BrowserRouter>
        
            <nav className="nav-links">
              <Link to="/home">Home</Link>
                <Link to="/cart">Cart🛒{itemCount}</Link>
              <Link to="/order">Order</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/whishlist">WhishList</Link>

            </nav>
            <Routes>
              <Route path="/home" element={<Home/>} />
              <Route path="/cart" element={<Cart/>} />
              <Route path="/order" element={<Order />} />
              <Route path="/about" element={<AboutUs/>} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/whishlist" element={<WhishList/>} />
            </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;