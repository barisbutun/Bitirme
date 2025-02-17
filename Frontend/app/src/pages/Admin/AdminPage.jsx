import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import AdminSidebar from "../../AdminComponents/AdminSidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
// import "../User/UserCss/Homepage.css";
import "../Admin/AdminCss/AdminPage.css";
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
        <Header collapsed={collapsed} setCollapsed={setCollapsed}>
          <FilterComponent onApplyFilter={handleApplyFilter} />
        </Header>
        <div className="admincontent">
          <iframe
            src="http://localhost:5601/app/dashboards#/view/25f8a8f0-4deb-4276-aaed-ea24277d0c88?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-1y%2Fd%2Cto%3Anow))&hide-filter-bar=true"
            height="600"
            width="100%"
          ></iframe>
        </div>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default Homepage;
