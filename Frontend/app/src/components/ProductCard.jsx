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

  const addToCartHandler = async (id) => {
    // Kullanıcının giriş yapıp yapmadığını kontrol et
    if (!isLoggedIn()) {
      notification.info({
        message: "Giriş Yapın",
        description: "Sepete ürün eklemek için giriş yapmalısınız.",
        placement: "topRight",
      });
      navigate("/Login"); // Giriş sayfasına yönlendir
      return;
    }

    // Sepete eklenecek ürün verisini doğrudan oluşturuyoruz
    const productData = {
      id,
      quantity,
    };

    try {
      // Sepete ekleme işlemini servisteki fonksiyona gönderiyoruz
      await addToCart(productData);
      notification.success({
        message: "Sepete Eklendi",
        description: "Ürün başarıyla sepete eklendi.",
        placement: "topRight",
      });
    } catch (error) {
      // Hata durumunda bildirim göster
      notification.error({
        message: "Hata",
        description: "Sepete ekleme sırasında bir sorun oluştu.",
        placement: "topRight",
      });
    }
  };

  const toggleFavoriteHandler = async () => {
    try {
      if (isFavorite) {
        const success = await removeFavorite(id); // Servis üzerinden silme
        if (success) {
          setIsFavorite(false);
          notification.success({
            message: "Favorilerden Çıkarıldı",
            description: "Ürün favorilerden başarıyla çıkarıldı.",
            placement: "topRight",
          });
        }
      } else {
        const success = await addFavorite({
          id,
          name,
          price,
          image,
          stock_state,
        }); // Servis üzerinden ekleme
        if (success) {
          setIsFavorite(true);
          notification.success({
            message: "Favorilere Eklendi",
            description: "Ürün favorilerinize başarıyla eklendi.",
            placement: "topRight",
          });
        }
      }
    } catch (error) {
      notification.error({
        message: "Hata",
        description: error.message || "Bir hata oluştu.",
        placement: "topRight",
      });

      if (error.message === "Giriş yapmalısınız.") {
        navigate("/user/login");
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
          onClick={() => navigate(`user/ProductDetails/${id}`)}
        >
          İncele
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
