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
import { fetchProductImages } from "../../services/ProductService/ProductService";

const Favorites = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favorites = await fetchFavorites();
      console.log("Ham favori verisi:", favorites);

      // Her favori için resim bilgisini çek
      const favoritesWithImages = await Promise.all(
        favorites.map(async (favorite) => {
          const images = await fetchProductImages(favorite.product_id);
          return {
            id: favorite.product_id,
            category_id: favorite.category_id,
            name: favorite.name,
            price: favorite.price,
            image1: images?.[0] || null,
            stock: "AVAILABLE", // Backend'den stok bilgisi geliyorsa burası güncellenebilir
          };
        })
      );

      console.log("Resimlerle birlikte favoriler:", favoritesWithImages);
      setFavoriteProducts(favoritesWithImages);
    } catch (error) {
      console.error("Favoriler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (record) => {
    console.log("Silinecek ürün ID:", record);
    const productId = record.id;
    if (!productId) {
      console.error("Geçersiz ürün ID'si");
      return;
    }
    const success = await removeFavorite(productId);
    if (success) {
      await loadFavorites();
    }
  };

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
          danger
          onClick={() => handleRemoveFavorite(record)}
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
            loading={loading}
            columns={columns}
            dataSource={favoriteProducts}
            rowKey={(record) => record.id || Math.random()}
            pagination={{ pageSize: 5 }}
          />
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Favorites;
