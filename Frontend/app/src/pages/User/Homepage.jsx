import React, { useEffect, useState } from "react";
import { Layout, Spin, Pagination } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Homepage.css";
import ProductCard from "../../components/ProductCard";
import {
  fetchProducts,
  fetchProductImages,
  fetchFilteredProducts,
} from "../../services/ProductService/ProductService";
const Homepage = ({ setLoading }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const handlePageChange = (pageNumber, pageSize) => {
    setPage(pageNumber);
    setSize(pageSize);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      // setLoading(true);
      try {
        const productsData = await fetchProducts(page - 1, size);

        // Önce sadece ürünleri göster
        const initialProducts = productsData.map((product) => ({
          ...product,
          images: [], // Başlangıçta boş
        }));
        setProducts(initialProducts);
        setFilteredProducts(initialProducts);

        // Sonra resimleri getirip state'i güncelle
        for (const product of productsData) {
          const images = await fetchProductImages(product.id);
          setFilteredProducts((prev) =>
            prev.map((p) => (p.id === product.id ? { ...p, images } : p))
          );
        }
      } catch (error) {
        setError(error.message);
        console.error("Ürünler yüklenirken hata oluştu:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [page, size]);

  if (error) return <div>Hata: {error}</div>;

  const handleApplyFilter = async (filters) => {
    console.log("filtreleme kriterleri:", filters);
    try {
      const data = await fetchFilteredProducts(filters);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Filtreleme sırasında hata:", error);
    }
  };

  return (
    <Layout
      style={{
        transition: "all 0.2s ease",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        trigger={null}
        width={200}
        style={{
          position: "fixed", // Ekrana sabitlenir
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100, // Önde kalsın
        }}
      />
      <Layout className="homepage-layout">
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onFilterChange={handleApplyFilter}
        />

        <div className="content">
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.images?.[0] || "default-image-path"}
                price={product.price}
                description={product.description}
                quantity={product.quantity}
                stock_state={product.stock_state}
                category_id={product.category_id}
              />
            ))
          ) : (
            <p>Ürün bulunamadı.</p>
          )}
        </div>

        <Footer>
          <div className="pagination-inside-footer">
            <Pagination
              current={page}
              pageSize={size}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20", "50"]}
              total={100}
            />
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Homepage;
