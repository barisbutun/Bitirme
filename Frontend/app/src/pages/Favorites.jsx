import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Favorites.css";

const Favorites = ({ products }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];

    // products dizisi yüklendiyse ve boş değilse işleme devam ediliyor
    if (products && products.length > 0 && favoriteIds.length > 0) {
      const favProducts = products.filter((product) =>
        favoriteIds.includes(product.id)
      );
      setFavoriteProducts(favProducts);
    }
  }, [products]);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="favorites-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="favorites-page">
          <h2>Favori Ürünlerim</h2>
          <Row gutter={16}>
            {favoriteProducts.length > 0 ? (
              favoriteProducts.map((product) => (
                <Col span={8} key={product.id}>
                  <Card
                    title={product.name}
                    cover={<img src={product.image1} alt={product.name} />}
                  >
                    <p>{product.price} TL</p>
                  </Card>
                </Col>
              ))
            ) : (
              <p>Henüz favori ürününüz yok.</p>
            )}
          </Row>
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Favorites;
