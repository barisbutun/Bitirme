import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Products.css";
import ProductCard from "../components/ProductCard";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) =>
        console.error("There was a problem with the fetch operations:", error)
      );
  }, []);
  return (
    <Layout>
      <Sidebar />
      <Layout className="product-layout">
        <Header />
        {/* <Content> */}
        {products.map((product) => (
          <ProductCard
            key={product.name}
            name={product.name}
            image={product.image}
            price={product.price}
            description={product.description}
            stock={product.stock}
          />
        ))}
        {/* </Content> */}
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Homepage;
