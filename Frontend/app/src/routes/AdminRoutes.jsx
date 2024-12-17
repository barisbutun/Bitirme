import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/Admin/AdminPage";
import ProductManagement from "../pages/Admin/ProductManagement";
import UserManagement from "../pages/Admin/UserManagement";
import OrderManagement from "../pages/Admin/OrderManagement";
import CategoryManagement from "../pages/Admin/CategoryManagement";
import FavoriteManagement from "../pages/Admin/FavoriteManagement";
import ImageManagement from "../pages/Admin/ImageManagement";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Admin Ana Sayfası */}
      <Route index element={<AdminPage />} />

      {/* Admin Alt Rotaları */}
      <Route path="ProductManagement" element={<ProductManagement />} />
      <Route path="UserManagement" element={<UserManagement />} />
      <Route path="OrderManagement" element={<OrderManagement />} />
      <Route path="CategoryManagement" element={<CategoryManagement />} />
      <Route path="FavoriteManagement" element={<FavoriteManagement />} />
      <Route path="ImageManagement" element={<ImageManagement />} />
    </Routes>
  );
};

export default AdminRoutes;
