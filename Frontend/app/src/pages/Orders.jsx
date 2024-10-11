import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Content from "../components/Content";
import Footer from "../components/Footer";
import "../css/Orders.css";

const Orders = () => {
  const [collapsed, setCollapsed] = useState(false);
  // sipariş bilgileri
  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="Orders-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content />
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Orders;
