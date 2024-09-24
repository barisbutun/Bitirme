import React from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Content from "../components/Content";
import Footer from "../components/Footer";
import "../css/Products.css";

const Homepage = () => {
  return (
    <Layout>
      <Sidebar />
      <Layout className="product-layout">
        <Header />
        <Content />
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Homepage;
