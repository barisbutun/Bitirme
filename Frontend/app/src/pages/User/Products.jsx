import React, { useEffect, useState } from "react";
import { Layout, Pagination } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Products.css";
import ProductCard from "../../components/ProductCard";
import {
  fetchProducts,
  fetchProductImages,
  fetchFilteredProducts,
} from "../../services/ProductService/ProductService";
import { fetchFavorites } from "../../services/ProductService/FavoriteService";

const Products = ({ setLoading }) => {
  const [products, setProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  const handlePageChange = (pageNumber, pageSize) => {
    setPage(pageNumber);
    setSize(pageSize);
  };

  // Ürünleri getir (resimsiz)
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const productsData = await fetchProducts(page - 1, size);
        const productList = productsData.content;

        if (!Array.isArray(productList)) {
          throw new Error("Ürün verisi dizisi bekleniyor.");
        }

        setProducts(productList);
        setTotal(productsData.totalElements);
      } catch (error) {
        setError(error.message);
        console.error("Ürünler yüklenirken hata oluştu:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [page, size]);

  // Ürünler geldikten sonra resimleri lazy olarak getir
  useEffect(() => {
    const loadImages = async () => {
      for (const product of products) {
        try {
          const images = await fetchProductImages(product.id);
          setProducts((prev) =>
            prev.map((p) => (p.id === product.id ? { ...p, images } : p))
          );
        } catch (error) {
          console.error(
            `Ürün resmi alınırken hata (ID: ${product.id}):`,
            error
          );
        }
      }
    };

    if (products.length > 0) {
      loadImages();
    }
  }, [products]);

  // Filtreleme
  const handleApplyFilter = async (filters) => {
    console.log("filtreleme kriterleri:", filters);
    setLoading(true);
    try {
      const data = await fetchFilteredProducts(filters);
      setProducts(data); // İlk başta resimsiz gelir

      // Resimleri ayrı yükle
      for (const product of data) {
        try {
          const images = await fetchProductImages(product.id);
          setProducts((prev) =>
            prev.map((p) => (p.id === product.id ? { ...p, images } : p))
          );
        } catch (error) {
          console.error(
            `Filtre sonrası ürün resmi hatası (ID: ${product.id}):`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Filtreleme sırasında hata:", error);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div>Hata: {error}</div>;

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 0 : 0, transition: "all 0.2s" }}>
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onFilterChange={handleApplyFilter}
        />

        <div
          className="content"
          style={{
            marginLeft: collapsed ? 0 : 200,
          }}
        >
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
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
            <p></p>
          )}
        </div>

        <Footer>
          <div
            className="pagination-inside-footer"
            style={{ marginLeft: collapsed ? 0 : 180 }}
          >
            <Pagination
              current={page}
              pageSize={size}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20", "50"]}
              total={total}
            />
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Products;
