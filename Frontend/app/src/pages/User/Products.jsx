import React, { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Products.css";
import ProductCard from "../../components/ProductCard";
import {
  fetchProducts,
  fetchProductImages,
  fetchFilteredProductsWithImages,
} from "../../services/ProductService/ProductService";
import { fetchFavorites } from "../../services/ProductService/FavoriteService";
const Products = ({ setLoading }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Ürünleri ve favorileri paralel olarak çek
        const [productsData] = await Promise.all([
          fetchProducts(),
          fetchFavorites(setFavorites),
        ]);
        console.log("products.jsx'deki -API'den gelen ham veri:", productsData); // Debug log 1

        // Resimleri ekle
        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            const images = await fetchProductImages(product.id);
            const transformedProduct = {
              ...product,
              images,
              category_id: product.categoryId || product.category_id,
              categoryId: product.categoryId || product.category_id, // Her iki formatı da koruyalım
            };
            console.log(
              "Products.jsx - Dönüştürülmüş ürün:",
              transformedProduct
            ); // Debug log 2
            return transformedProduct;
          })
        );
        console.log("Products.jsx - Final ürün listesi:", productsWithImages); // Debug log 3
        setProducts(productsWithImages);
        setFilteredProducts(productsWithImages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (error) return <div>Hata: {error}</div>;

  const handleApplyFilter = async (filters) => {
    console.log("filtreleme kriterleri:", filters);
    try {
      const dataWithImages = await fetchFilteredProductsWithImages(filters);
      setFilteredProducts(dataWithImages);
    } catch (error) {
      console.error("Filtreleme sırasında hata:", error);
    }
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="product-layout">
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
                image={product.images?.[0] || "default-image-path"} // İlk resmi veya varsayılan resmi göster
                price={product.price}
                description={product.description}
                quantity={product.quantity}
                stock_state={product.stock_state}
                category_id={product.category_id}
                categoryId={product.categoryId}
                favorites={favorites}
              />
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              Ürün bulunamadı.
            </p>
          )}
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Products;
