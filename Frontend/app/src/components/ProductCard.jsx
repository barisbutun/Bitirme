import React, { useState } from "react";
import { Card, Button, notification, Image } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { CardText, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../css/ProductCard.css";
function ProductCard({
  id,
  name,
  image,
  price,
  stock,
  description,
  image1,
  image2,
  image3,
}) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    const url = `/ProductDetails/${id}`;
    console.log("Navigating to:", url); // URL'yi kontrol etmek için log
    navigate(url);
    // navigate(`/ProductDetails/${id}`);
  };
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isFavorite, setIsFavorite] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    return favorites.includes(id);
  });
  const addToCart = () => {
    const product = {
      id,
      name,
      image,
      price,
      stock,
      description,
      image1,
      image2,
      image3,
    };
    const currentcart = JSON.parse(localStorage.getItem("cart")) || [];

    const newCart = [...currentcart, product];
    localStorage.setItem("cart", JSON.stringify(newCart));

    notification.success({
      message: "Sepete Eklendi",
      description: `${name} başarıyla sepete eklendi!`,
      placement: "topRight",
    });
  };
  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem("favorites");
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    if (isFavorite) {
      favorites = favorites.filter((favId) => favId !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };
  return (
    <Card className="ProductCard">
      <button
        className={`favorite-button ${isFavorite ? "active" : ""}`}
        onClick={toggleFavorite}
      >
        {isFavorite ? <HeartFilled /> : <HeartOutlined />}
      </button>
      {/* <span class="badge">Yeni Ürün</span> */}
      <CardTitle className="product-title" tag="h3">
        {name}
      </CardTitle>

      <div className="image-container">
        <Image className="image" src={image} />
      </div>

      <CardText className="product-price">Fiyat:{price}</CardText>
      <CardText className="product-info">Açıklama:{description}</CardText>
      <CardText className="product-info">Stok Durumu:{stock}</CardText>
      <div className="product-buttons">
        <Button className="SepetButon" onClick={addToCart}>
          Sepete Ekle
        </Button>
        <Button className=" InceleButon" onClick={handleCardClick}>
          İncele
        </Button>
      </div>
    </Card>
  );
}

export default ProductCard;
