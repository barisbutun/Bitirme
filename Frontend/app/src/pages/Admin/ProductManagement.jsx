import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import AdminSidebar from "../../AdminComponents/AdminSidebar";
import AdminHeader from "../../AdminComponents/AdminHeader";
import Footer from "../../components/Footer";
import "../User/UserCss/Homepage.css";
import FilterComponent from "../../components/FilterComponent";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const handleApplyFilter = (category) => {
    if (category) {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <Layout>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="homepage-layout">
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed}>
          <FilterComponent onApplyFilter={handleApplyFilter} />
        </AdminHeader>
        <div className="content">Ürün İşlemleri Sayfası</div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Homepage;
