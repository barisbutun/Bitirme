import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Empty } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { fetchProductImages } from "../../services/ProductService/ProductService";
import "../User/UserCss/Homepage.css";

const { Content } = Layout;

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [] } = location.state || {};

  const [products, setProducts] = useState(results);
  const [collapsed, setCollapsed] = React.useState(false);
  const isImageLoaded = useRef(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const productsWithImages = await Promise.all(
          products.map(async (product) => {
            if (!product.images || product.images.length === 0) {
              try {
                const images = await fetchProductImages(product.id);
                return { ...product, images };
              } catch {
                return { ...product, images: [] };
              }
            }
            return product;
          })
        );
        setProducts(productsWithImages);
        isImageLoaded.current = true;
      } catch (error) {
        console.error("Resim yüklenirken hata:", error);
      }
    };

    if (products.length > 0 && !isImageLoaded.current) {
      loadImages();
    }
  }, [products]);

  const handleClick = (id) => {
    navigate(`/user/ProductDetails/${id}`);
  };

  return (
    <Layout style={{ transition: "all 0.2s ease" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        trigger={null}
      />
      <Layout className="homepage-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content
          className="content"
          style={{
            marginLeft: collapsed ? 0 : 200,
            padding: 20,
            minHeight: "calc(100vh - 64px - 70px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: products.length === 0 ? "center" : "flex-start",
          }}
        >
          <h2 style={{ width: "100%" }}>
            {products.length > 0
              ? `Arama Sonuçları (${products.length})`
              : "Arama Sonucu Bulunamadı"}
          </h2>

          {products.length === 0 ? (
            <Empty description="Sonuç bulunamadı" />
          ) : (
            products.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClick(item.id)}
                style={{ cursor: "pointer", flex: "0 0 calc(25% - 16px)" }}
              >
                <ProductCard
                  id={item.id}
                  name={item.name}
                  image={item.images?.[0] || "default-image-path"}
                  price={item.price}
                  description={item.description}
                  quantity={item.quantity}
                  stock_state={item.stock_state}
                  category_id={item.category_id}
                />
              </div>
            ))
          )}
        </Content>

        <Footer>
          <p
            className="footer-text"
            style={{ marginLeft: collapsed ? 0 : 180 }}
          >
            @Fashion Design
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SearchResults;
