import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Homepage.css";
import ProductCard from "../components/ProductCard";
import FilterComponent from "../components/FilterComponent";
// import {
//   fetchProducts,
//   fetchProductImages,
// } from "../services/ProductService/ProductService";
const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        // JSON dosyasından ürün verilerini al
        const response = await fetch("/products.json"); // JSON dosyasının yolu
        if (!response.ok) {
          throw new Error("JSON dosyası yüklenemedi");
        }

        const productsData = await response.json();

        // JSON'dan gelen verileri doğrudan state'e aktar
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

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
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="homepage-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed}>
          <FilterComponent onApplyFilter={handleApplyFilter} />
        </Header>
        <div className="content">
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.images?.[0] || "default-image-path"} // İlk resmi veya varsayılan resmi göster
                price={product.price}
                description={product.description}
                quantity={product.quantity}
                stock_state={product.stock_state}
              />
            ))
          ) : (
            <p>Filtreleme kriterlerine uyan ürün bulunamadı.</p>
          )}
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Homepage;
