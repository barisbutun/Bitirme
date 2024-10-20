import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Delivery from "./pages/Delivery";
import ShoppingCard from "./pages/ShoppingCard";
import SignUp from "./pages/SignUp";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import AdminPage from "./pages/AdminPage";
import Favorites from "./pages/Favorites";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Delivery" element={<Delivery />} />
        <Route path="/ShoppingCard" element={<ShoppingCard />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        <Route path="/Favorites" element={<Favorites />} />
        <Route path="/AdminPage" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
