import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/Admin/AdminPage";
import UserManagement from "../pages/Admin/UserManagement";
import OrderManagement from "../pages/Admin/OrderManagement";
import ProductManagement from "../pages/Admin/ProductManagement";
import CategoryManagement from "../pages/Admin/CategoryManagement";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* admin anasayfa */}
      <Route index element={<AdminPage />} />

      <Route path="ProductManagement" element={<ProductManagement />} />
      <Route path="UserManagement" element={<UserManagement />} />
      <Route path="OrderManagement" element={<OrderManagement />} />
      <Route path="CategoryManagement" element={<CategoryManagement />} />
    </Routes>
  );
};

export default AdminRoutes;
