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
import { isAuthenticated, getToken } from "../utils/auth";
function ProductCard({
  id,
  name,
  image,
  price,
  quantity,
  stock_state, // 'AVAILABLE' or 'UNAVAILABLE'
  description,
  category_id,
  categoryId,
  favorites = [],
  onFavoriteChange,
}) {
  console.log("ProductCard props:", {
    id,
    category_id,
  });

  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(() => {
    // Favori durumunu backend'den gelen veriye göre kontrol et
    return favorites.some((fav) => fav.product_id === id);
  });

  const addToCartHandler = async () => {
    try {
      const token = getToken();
      console.log("Token mevcut mu:", !!token);

      if (!token) {
        notification.info({
          message: "Giriş Yapın",
          description: "Sepete ürün eklemek için giriş yapmalısınız.",
          placement: "topRight",
        });
        navigate("/Login");
        return;
      }

      const productData = {
        product_id: id,
        quantity: 1,
      };

      console.log("Sepete eklenecek veri:", productData);

      const result = await addToCart(productData);

      // Başarılı veya boş response durumunda başarılı bildirimi göster
      notification.success({
        message: "Başarılı",
        description: "Ürün sepete eklendi.",
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
    try {
      const effectiveCategoryId = category_id || categoryId;

      let success;
      if (isFavorite) {
        success = await removeFavorite(id);
        if (success) {
          setIsFavorite(false);
        }
      } else {
        success = await addFavorite({
          id: id,
          categoryId: effectiveCategoryId,
          price: price,
          name: name,
        });
        if (success) {
          setIsFavorite(true);
        }
      }

      // Başarılı işlem sonrası callback'i çağır
      if (success && onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      showNotification("error", "Hata", error.message || "Bir hata oluştu.");
      if (error.message === "Giriş yapmalısınız.") {
        navigate("/user/login");
      }
    }
  };
  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
    });
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
          onClick={() => navigate(`user/ProductDetails/${id}`)}
        >
          İncele
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
