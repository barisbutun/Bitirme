import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "../css/ProductCard.css";
function ProductCard({ name, image, price, stock, description }) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate("/ProductDetails");
  };
  return (
    <Card className="ProductCard" onClick={handleCardClick}>
      <h3>{name}</h3>
      <img src={image} />
      <p>Fiyat:{price}</p>
      <p>Açıklama:{description}</p>
      <p>Stok Durumu:{stock}</p>
      <Button> Sepete Ekle</Button>
    </Card>
  );
}

export default ProductCard;
