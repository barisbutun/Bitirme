import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  notification,
  Image,
  Rate,
  Tooltip,
  Spin,
  Skeleton,
  Descriptions,
} from "antd";
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
import { getReviewCount } from "../services/ProductService/ReviewService";

function ProductCard({
  id,
  name,
  image,
  price,
  quantity,
  stock_state,
  description,
  category_id,
  categoryId,
  favorite_id,
  favorite = [],
  onFavoriteChange,
}) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(() => {
    return favorite.some((fav) => fav.product_id === id);
  });

  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const reviewCountData = await getReviewCount(id);
        setReviewCount(reviewCountData);

        const averageRatingData = 4.2; // örnek değer
        setAverageRating(averageRatingData);
      } catch (error) {
        console.error("Review verisi alınamadı:", error);
      }
    };

    fetchReviewData();
  }, [id]);

  const addToCartHandler = async () => {
    try {
      const token = getToken();
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

      await addToCart(productData);

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

  const toggleFavoriteHandler = async (e) => {
    e.stopPropagation(); // kart yönlendirmesini engelle
    try {
      const effectiveCategoryId = category_id || categoryId;
      let success;

      if (isFavorite) {
        const favoriteItem = favorite.find((f) => f.product_id === id);
        if (favoriteItem) {
          success = await removeFavorite(favoriteItem.id);
          if (success) setIsFavorite(false);
        }
      } else {
        success = await addFavorite({
          favorite_id: favorite_id,
          categoryId: effectiveCategoryId,
          price: price,
          name: name,
          id: id,
        });
        if (success) setIsFavorite(true);
      }

      if (success && onFavoriteChange) onFavoriteChange();
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

  const getTotalQuantity = (qty) => {
    if (typeof qty === "number") return qty;
    if (typeof qty === "object") {
      return Object.values(qty).reduce((acc, val) => acc + val, 0);
    }
    return 0;
  };

  const isAvailable =
    stock_state?.toUpperCase() === "AVAILABLE" &&
    getTotalQuantity(quantity) > 0;

  const handleCardClick = () => {
    navigate(`/user/ProductDetails/${id}`, {
      state: {
        product: {
          id,
          name,
          image,
          price,
          quantity,
          stock_state,
          description,
          category_id,
          favorite_id,
          favorite,
        },
      },
    });
  };

  return (
    <Card className="ProductCard" onClick={handleCardClick}>
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
        {image ? (
          <Image
            className="image"
            src={image}
            placeholder={<Spin />}
            preview={false}
          />
        ) : (
          <Skeleton.Image active style={{ width: "100%", height: "200px" }} />
        )}
      </div>

      <CardText className="product-price">Fiyat: {price} TL</CardText>
      <CardText className="product-info">Açıklama: {description}</CardText>

      <CardText
        className={`product-info ${isAvailable ? "available" : "unavailable"}`}
      >
        {isAvailable ? "Stokta Var" : "Stokta Yok"}
      </CardText>

      <div style={{ marginTop: "10px" }}>
        <Tooltip title={`${reviewCount} yorum`}>
          <Rate allowHalf disabled defaultValue={averageRating} />
        </Tooltip>
        <p>{reviewCount} yorum</p>
      </div>

      {isAvailable && (
        <>
          <CardText className="product-info">
            Toplam Kalan Miktar: {getTotalQuantity(quantity)}
          </CardText>
        </>
      )}

      <div className="product-buttons">
        <Button
          className="SepetButon"
          onClick={(e) => {
            e.stopPropagation(); // kart tıklamasını engelle
            addToCartHandler();
          }}
          disabled={!isAvailable}
        >
          Sepete Ekle
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
