import React, { useState } from "react";
import { Card, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import "../css/ProductCard.css";
function ProductCard({ name, image, price, stock, description }) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate("/ProductDetails");
  };
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const addToCart = () => {
    const product = { name, image, price, stock, description };
    const currentcart = JSON.parse(localStorage.getItem("cart")) || [];

    const newCart = [...currentcart, product];
    localStorage.setItem("cart", JSON.stringify(newCart));

    notification.success({
      message: "Sepete Eklendi",
      description: `${name} başarıyla sepete eklendi!`,
      placement: "topRight",
    });
  };

  return (
    <Card className="ProductCard">
      <h3>{name}</h3>
      <img src={image} />
      <p>Fiyat:{price}</p>
      <p>Açıklama:{description}</p>
      <p>Stok Durumu:{stock}</p>
      <Button className="SepetButon" onClick={addToCart}>
        Sepete Ekle
      </Button>
      <Button className=" InceleButon" onClick={handleCardClick}>
        İncele
      </Button>
    </Card>
  );
}

export default ProductCard;
