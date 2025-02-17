import React, { useState, useEffect } from "react";
import { Image, Button, Layout, Table } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Favorites.css";
import {
  fetchFavorites,
  removeFavorite,
} from "../../services/ProductService/FavoriteService";

const Favorites = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    fetchFavorites((data) => {
      const formattedData = data.map((item) => ({
        id: item.id || null, // Favori ID
        name: item.product?.name || "Ürün Adı Yok", // Ürün Adı
        price: item.product?.price ?? "Bilinmiyor", // Fiyat
        stockState: item.product?.stock_state || "Bilinmiyor", // Stok Durumu (Enum olabilir)
        categoryId: item.product?.category_id || "Kategori Yok", // Kategori ID
        description: item.product?.description || "Açıklama yok", // Açıklama
        quantity: item.product?.quantity ?? 0, // Adet
        image: item.product?.imageUrls?.[0] || "/assets/default-product.jpg", // İlk resim veya varsayılan
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
