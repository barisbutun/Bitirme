import React, { useState, useEffect } from "react";
import { Image, Button, Layout, Table } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Favorites.css";
import {
  fetchFavorites,
  removeFavorite,
} from "../services/ProductService/FavoriteService";

const Favorites = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    fetchFavorites((data) => {
      // Backend'den dönen veriyi doğru şekilde işleyin
      const formattedData = data.map((item) => ({
        id: item.id || null, // Favori ID
        name: item.product?.name || "Ürün Adı Yok", // Product Name
        price: item.product?.price || 0, // Product Price
        stock: item.product?.stock || "Bilinmiyor", // Stock
        image1: item.product?.image1 || "default-image-url.jpg", // Image URL
      }));
      setFavoriteProducts(formattedData);
    });
  }, []);

  const columns = [
    {
      title: "Resim",
      dataIndex: "image1",
      key: "image",
      render: (image1) =>
        image1 ? (
          <Image width={50} src={image1} alt="Product" />
        ) : (
          <div>Resim Yok</div>
        ),
    },
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
      render: (name) => name || "Ürün Adı Yok",
    },
    {
      title: "Fiyat",
      dataIndex: "price",
      key: "price",
      render: (price) => (price ? `${price} TL` : "Fiyat Yok"),
    },
    {
      title: "Stok Durumu",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => stock || "Bilinmiyor",
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => removeFavorite(record.id, setFavoriteProducts)}
        >
          Favoriden Çıkar
        </Button>
      ),
    },
  ];

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
            rowKey={(record) => record.id || Math.random()} // Eğer ID yoksa random key kullanır
            pagination={{ pageSize: 5 }}
          />
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Favorites;
