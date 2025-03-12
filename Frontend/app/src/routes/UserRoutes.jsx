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

const UserRoutes = ({ setLoading }) => {
  return (
    <Routes>
      {/* Varsayılan rota (Homepage) */}
      <Route index element={<Homepage setLoading={setLoading} />} />

      {/* Kullanıcı rotaları */}
      <Route path="Profile" element={<Profile setLoading={setLoading} />} />
      <Route path="Login" element={<Login setLoading={setLoading} />} />
      <Route path="SignUp" element={<SignUp setLoading={setLoading} />} />
      <Route path="Products" element={<Products setLoading={setLoading} />} />
      <Route path="Delivery" element={<Delivery setLoading={setLoading} />} />
      <Route
        path="ShoppingCard"
        element={<ShoppingCard setLoading={setLoading} />}
      />
      <Route path="Orders" element={<Orders />} />
      <Route
        path="ProductDetails/:id"
        element={<ProductDetails setLoading={setLoading} />}
      />
      <Route path="Favorites" element={<Favorites setLoading={setLoading} />} />
      <Route path="Payment" element={<Payment setLoading={setLoading} />} />
    </Routes>
  );
};

export default UserRoutes;
