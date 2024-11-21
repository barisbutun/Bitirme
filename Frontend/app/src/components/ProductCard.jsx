import React, { useState } from "react";
import { Card, Button, notification, Image } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { CardText, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../css/ProductCard.css";
import {
  addToCart,
  addToFavorites,
} from "../services/ProductService/ProductService";

function ProductCard({
  id,
  name,
  image,
  price,
  quantity,
  stock_state, // 'AVAILABLE' or 'UNAVAILABLE'
  description,
  image1,
  image2,
  image3,
}) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    const url = `/ProductDetails/${id}`;
    console.log("Navigating to:", url);
    navigate(url);
  };

  const isLoggedIn = () => {
    return Boolean(localStorage.getItem("token"));
  };

  const [isFavorite, setIsFavorite] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    return favorites.includes(id);
  });

  const addToCartHandler = async (id) => {
    if (!isLoggedIn()) {
      notification.info({
        message: "Giriş Yapın",
        description: "Sepete ürün eklemek için giriş yapmalısınız.",
        placement: "topRight",
      });
      navigate("/Login");
      return;
    }

    await addToCart(id, navigate); // Servis katmanındaki sepete ekleme fonksiyonu çağrıldı
  };

  const toggleFavoriteHandler = async (id) => {
    if (!isLoggedIn()) {
      notification.info({
        message: "Giriş Yapın",
        description: "Favorilere eklemek için giriş yapmalısınız.",
        placement: "topRight",
      });
      navigate("/Login");
      return;
    }

    await addToFavorites(id, navigate); // Servis katmanındaki favorilere ekleme fonksiyonu çağrıldı
    setIsFavorite(!isFavorite);
  };

  // Stok durumunu kontrol et ve hata durumlarına karşı güvenli hale getir
  const isAvailable =
    stock_state && stock_state.toUpperCase() === "AVAILABLE" && quantity > 0;
  const isUnavailable = !isAvailable && stock_state !== undefined;

  console.log("Stock State:", stock_state); // Hata kaynağını görmek için log eklendi

  return (
    <Card className="ProductCard">
      <button
        className={`favorite-button ${isFavorite ? "active" : ""}`}
        onClick={() => toggleFavoriteHandler(id)}
      >
        {isFavorite ? <HeartFilled /> : <HeartOutlined />}
      </button>

      <CardTitle className="product-title" tag="h3">
        {name}
      </CardTitle>

      <div className="image-container">
        <Image className="image" src={image} />
      </div>

      <CardText className="product-price">Fiyat: {price}</CardText>
      <CardText className="product-info">Açıklama: {description}</CardText>

      {/* Stok Durumu */}
      <CardText
        className={`product-info ${isAvailable ? "available" : "unavailable"}`}
      >
        {isAvailable ? "Stokta Var" : "Stokta Yok"}
      </CardText>

      {/* Kalan Miktar */}
      {isAvailable && (
        <CardText className="product-info">Kalan Miktar: {quantity}</CardText>
      )}

      <div className="product-buttons">
        <Button
          className="SepetButon"
          onClick={() => addToCartHandler(id)}
          disabled={!isAvailable} // Stokta olmayan ürün eklenmesin
        >
          Sepete Ekle
        </Button>
        <Button className="InceleButon" onClick={handleCardClick}>
          İncele
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
