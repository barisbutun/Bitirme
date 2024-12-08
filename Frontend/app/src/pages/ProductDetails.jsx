import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductDetailsCard from "../components/ProductDetailsCard";
import "../css/ProductDetails.css";
import { useParams } from "react-router-dom";
import {
  fetchProducts,
  fetchProductImages,
} from "../services/ProductService/ProductService";
const ProductDetails = ({ token }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return; // Eğer id boşsa işlem yapma
      try {
        const products = await fetchProducts(token);
        const selectedProduct = products.find(
          (product) => product.id === parseInt(id, 10)
        );

        if (selectedProduct) {
          setProduct(selectedProduct);

          const productImages = await fetchProductImages(
            selectedProduct.id,
            token
          );
          setImages(productImages);
        } else {
          console.error("Ürün bulunamadı");
        }
      } catch (error) {
        console.error("Veriler alınırken hata oluştu:", error);
      }
    };

    fetchProductDetails();
  }, [id, token]);

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
