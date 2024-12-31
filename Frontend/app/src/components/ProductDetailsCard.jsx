import React, { useState } from "react";
import { Card, Button, Rate, Row, Col, Image, notification } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/ProductDetailsCard.css";

const ProductDetailsCard = ({ product, images }) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    return favorites.includes(product.id);
  });

  if (!product) {
    return <p>Yükleniyor...</p>;
  }

  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem("favorites");
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    if (isFavorite) {
      favorites = favorites.filter((favId) => favId !== product.id);
    } else {
      favorites.push(product.id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = [...currentCart, product];
    localStorage.setItem("cart", JSON.stringify(newCart));

    notification.success({
      message: "Sepete Eklendi",
      description: `${product.name} başarıyla sepete eklendi!`,
      placement: "topRight",
    });
  };

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
        {/* Ürün resimleri */}
        <Col span={10}>
          <Slider {...settings}>
            <div className="image-container">
              <Image className="zoom-image" width={400} src={images} />
            </div>
            <div className="image-container">
              <Image className="zoom-image" width={400} src={images} />
            </div>
            <div className="image-container">
              <Image className="zoom-image" width={400} src={images} />
            </div>
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
              onClick={addToCart}
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
