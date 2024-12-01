import React, { useState } from "react";
import { Card, Button, notification, Image } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { CardText, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../css/ProductCard.css";
import { addToCart } from "../services/ProductService/ShoppingCardService";
import {
  addFavorite,
  removeFavorite,
} from "../services/ProductService/FavoriteService";

function ProductCard({
  id,
  name,
  image,
  price,
  quantity,
  stock_state, // 'AVAILABLE' or 'UNAVAILABLE'
  description,
}) {
  const navigate = useNavigate();

  const isLoggedIn = () => Boolean(localStorage.getItem("token"));

  const [isFavorite, setIsFavorite] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    return favorites.includes(id);
  });

  const addToCartHandler = async () => {
    if (!isLoggedIn()) {
      notification.info({
        message: "Giriş Yapın",
        description: "Sepete ürün eklemek için giriş yapmalısınız.",
        placement: "topRight",
      });
      navigate("/Login");
      return;
    }

    const shoppingCartItemDto = { productId: id, quantity: 1 }; // Sepete eklenecek ürün verisi
    try {
      await addToCart(shoppingCartItemDto);
      notification.success({
        message: "Sepete Eklendi",
        description: "Ürün başarıyla sepete eklendi.",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Sepete ekleme sırasında bir sorun oluştu.",
        placement: "topRight",
      });
    }
  };

  const toggleFavoriteHandler = async () => {
    if (!isLoggedIn()) {
      notification.info({
        message: "Giriş Yapın",
        description: "Favorilere eklemek için giriş yapmalısınız.",
        placement: "topRight",
      });
      navigate("/Login");
      return;
    }

    if (isFavorite) {
      try {
        await removeFavorite(id);
        setIsFavorite(false);
        notification.success({
          message: "Favorilerden Çıkarıldı",
          description: "Ürün favorilerden başarıyla çıkarıldı.",
          placement: "topRight",
        });
      } catch (error) {
        notification.error({
          message: "Hata",
          description: "Favorilerden çıkarma sırasında bir sorun oluştu.",
          placement: "topRight",
        });
      }
    } else {
      try {
        const favoriteData = {
          id,
          name,
          price,
          image,
          stock_state,
        };
        await addFavorite(favoriteData, navigate);
        setIsFavorite(true);
      } catch (error) {
        notification.error({
          message: "Hata",
          description: "Favorilere ekleme sırasında bir sorun oluştu.",
          placement: "topRight",
        });
      }
    }
  };

  const isAvailable =
    stock_state && stock_state.toUpperCase() === "AVAILABLE" && quantity > 0;

  return (
    <Card className="ProductCard">
      <button
        className={`favorite-button ${isFavorite ? "active" : ""}`}
        onClick={toggleFavoriteHandler}
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

      <CardText
        className={`product-info ${isAvailable ? "available" : "unavailable"}`}
      >
        {isAvailable ? "Stokta Var" : "Stokta Yok"}
      </CardText>

      {isAvailable && (
        <CardText className="product-info">Kalan Miktar: {quantity}</CardText>
      )}

      <div className="product-buttons">
        <Button
          className="SepetButon"
          onClick={addToCartHandler}
          disabled={!isAvailable}
        >
          Sepete Ekle
        </Button>
        <Button
          className="InceleButon"
          onClick={() => navigate(`/ProductDetails/${id}`)}
        >
          İncele
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
