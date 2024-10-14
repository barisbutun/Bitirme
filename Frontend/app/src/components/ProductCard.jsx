import React, { useState } from "react";
import { Card, Button, notification, Image } from "antd";
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

  return (
    <Card className="ProductCard">
      <CardTitle tag="h3">{name}</CardTitle>

      <div className="image-container">
        <Image className="image" src={image} />
      </div>

      <CardText className="cardtext">Fiyat:{price}</CardText>
      <CardText className="cardtext">Açıklama:{description}</CardText>
      <CardText className="cardtext">Stok Durumu:{stock}</CardText>

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
