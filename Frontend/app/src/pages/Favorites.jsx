import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Content from "../components/Content";
import Footer from "../components/Footer";
import "../css/Favorites.css";

const Favorites = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="site-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content />
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Favorites;
