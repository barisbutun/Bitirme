import React, { useState, useEffect } from "react";
import { Card, Button, Rate, Row, Col, Image, notification } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/ProductDetailsCard.css";
import { addToCart } from "../services/ProductService/ShoppingCardService";
import { addFavorite } from "../services/ProductService/FavoriteService";

const ProductDetailsCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Favori durumu için localStorage kontrolü
  useEffect(() => {
    if (product) {
      const savedFavorites = localStorage.getItem("favorites");
      const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      setIsFavorite(favorites.includes(product.id));
    }
  }, [product]);

  if (!product) {
    return <p>Yükleniyor...</p>;
  }

  const isLoggedIn = () => {
    return Boolean(localStorage.getItem("token"));
  };

  const toggleFavorite = async () => {
    if (!isLoggedIn()) {
      notification.info({
        message: "Giriş Yapın",
        description: "Favorilere eklemek için giriş yapmalısınız.",
        placement: "topRight",
      });
      navigate("/Login");
      return;
    }

    await addFavorite(product.id, navigate);
    setIsFavorite(!isFavorite);
  };

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

    await addToCart(product.id, navigate);

    notification.success({
      message: "Sepete Eklendi",
      description: `${product.name} başarıyla sepete eklendi!`,
      placement: "topRight",
    });
  };

  // Slider resimlerini bir liste olarak ayarlama
  const images = [product.image1, product.image2, product.image3].filter(
    Boolean
  );

  // Slider ayarları
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };

  return (
    <Card className="product-details-card">
      <Row gutter={16}>
        {/* Ürün resmi ve küçük resimler */}
        <Col span={10}>
          <Slider {...settings}>
            {images.map((src, index) => (
              <div key={index} className="image-container">
                <Image className="small-image" width={400} src={src} />
              </div>
            ))}
          </Slider>
        </Col>

        {/* Ürün bilgileri */}
        <Col span={14}>
          <h2 className="product-details-title">{product.name}</h2>
          <Rate defaultValue={product.rating} />
          <p className="product-details-price">{product.price} TL</p>
          <p className="product-details-description">{product.description}</p>
          <div className="buttons">
            <Button
              type="primary"
              size="large"
              className="product-details-button"
              onClick={addToCartHandler}
            >
              Sepete Ekle
            </Button>

            <button
              className={`favoriteButton ${isFavorite ? "active" : ""}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? <HeartFilled /> : <HeartOutlined />}
            </button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetailsCard;
