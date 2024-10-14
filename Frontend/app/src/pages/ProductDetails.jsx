import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductDetailsCard from "../components/ProductDetailsCard";
import "../css/ProductDetails.css";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Ürün bilgilerini API'den al
    fetch(`/products.json?timestamp=${new Date().getTime()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const selectedProduct = data.find(
          (product) => product.id === parseInt(id, 10)
        );
        if (selectedProduct) {
          setProduct(selectedProduct);
        } else {
          console.error("Ürün bulunamadı");
        }
      })
      .catch((error) => {
        console.error("Veri alınırken hata oluştu:", error);
      });
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Veri gelene kadar bir yükleme ekranı göster
  }

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="site-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="productdetails-content">
          <ProductDetailsCard product={product} />
        </div>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProductDetails;
