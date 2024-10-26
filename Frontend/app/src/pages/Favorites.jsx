import React, { useState, useEffect } from "react";
import { Image, Button, Layout, Table, notification } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Favorites.css";

const Favorites = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/products.json`);
        const data = await response.json();
        const favProducts = data.filter((product) =>
          favoriteIds.includes(product.id)
        );
        setFavoriteProducts(favProducts);
      } catch (error) {
        console.error("JSON dosyası yüklenirken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);

  // Sütunları tanımlayın
  const columns = [
    {
      title: "Resim",
      dataIndex: "image1",
      key: "image",
      render: (image1) => <Image width={50} src={image1} alt="Product" />,
    },
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} TL`,
    },
    {
      title: "Stok Durumu",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "İşlem",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => removeFavorite(record.id)}>
          Favoriden Çıkar
        </Button>
      ),
    },
  ];
  const removeFavorite = (productId) => {
    // Favori ürünleri filtrele
    const updatedFavorites = favoriteProducts.filter(
      (item) => item.id !== productId
    );
    setFavoriteProducts(updatedFavorites); // Durum değişkenini güncelle

    // Favori ürünleri güncelle
    const savedFavorites = localStorage.getItem("favorites");
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
    const updatedFavoriteIds = favoriteIds.filter((id) => id !== productId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavoriteIds));

    const product = favoriteProducts.find((item) => item.id === productId);
    notification.warning({
      message: "Favoriden Çıkarıldı",
      description: `${
        product ? product.name : "Ürün"
      } başarıyla favorilerden çıkarıldı!`,
      placement: "topRight",
    });
  };
  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="favorites-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="favorites-page">
          <h2>Favori Ürünlerim</h2>
          <Table
            columns={columns}
            dataSource={favoriteProducts}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Favorites;
