import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/User/Homepage";
import Login from "../pages/User/Login";
import Profile from "../pages/User/Profile";
import Products from "../pages/User/Products";
import Delivery from "../pages/Delivery";
import ShoppingCard from "../pages/User/ShoppingCard";
import SignUp from "../pages/User/SignUp";
import Orders from "../pages/User/Orders";
import ProductDetails from "../pages/User/ProductDetails";
import Favorites from "../pages/User/Favorites";
import Payment from "../pages/User/Payment";

const UserRoutes = () => {
  return (
    <Routes>
      {/* Varsayılan rota (Homepage) */}
      <Route index element={<Homepage />} />

      {/* Kullanıcı rotaları */}
      <Route path="Profile" element={<Profile />} />
      <Route path="Login" element={<Login />} />
      <Route path="SignUp" element={<SignUp />} />
      <Route path="Products" element={<Products />} />
      <Route path="Delivery" element={<Delivery />} />
      <Route path="ShoppingCard" element={<ShoppingCard />} />
      <Route path="Orders" element={<Orders />} />
      <Route path="ProductDetails/:id" element={<ProductDetails />} />
      <Route path="Favorites" element={<Favorites />} />
      <Route path="Payment" element={<Payment />} />
    </Routes>
  );
};

export default UserRoutes;
