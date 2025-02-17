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
}) {
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    return favorites.includes(id);
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

      const response = await addToCart(productData);
      if (response) {
        notification.success({
          message: "Sepete Eklendi",
          description: "Ürün başarıyla sepete eklendi.",
          placement: "topRight",
        });
      }
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
      if (!category_id) {
        console.error("Category ID is missing:", { id, category_id });
        showNotification("error", "Hata", "Kategori bilgisi eksik.");
        return;
      }

      const favoriteData = {
        id,
        category_id,
        name,
        price,
        image,
        stock_state,
      };

      console.log("favori eklenecek veri:", favoriteData);

      if (isFavorite) {
        const success = await removeFavorite(id);
        if (success) {
          setIsFavorite(false);
          showNotification(
            "success",
            "Favorilerden Çıkarıldı",
            "Ürün favorilerden başarıyla çıkarıldı."
          );
        }
      } else {
        const success = await addFavorite({
          id: favoriteData.id,
          category_id: favoriteData.category_id,
        });
        if (success) {
          setIsFavorite(true);
          showNotification(
            "success",
            "Favorilere Eklendi",
            "Ürün favorilerinize başarıyla eklendi."
          );
        }
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
