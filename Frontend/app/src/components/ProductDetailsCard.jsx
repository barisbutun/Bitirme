import React from "react";
import { Card, Button, Rate, Row, Col, Image, notification } from "antd";
import "../css/ProductDetailsCard.css";

const ProductDetailsCard = ({ product }) => {
  if (!product) {
    return <p>Yükleniyor...</p>;
  }
  const addToCart = () => {
    const currentcart = JSON.parse(localStorage.getItem("cart")) || [];

    const newCart = [...currentcart, product];
    localStorage.setItem("cart", JSON.stringify(newCart));

    notification.success({
      message: "Sepete Eklendi",
      description: `${product.name} başarıyla sepete eklendi!`,
      placement: "topRight",
    });
  };
  return (
    <Card className="product-details-card">
      <Row gutter={16}>
        {/* Ürün resmi ve küçük resimler */}
        <Col span={10}>
          <Image width={400} src={product.image1} />
          <Row gutter={16} className="product-details-row">
            <Col span={6}>
              <Image src={product.image2} />
            </Col>
            <Col span={6}>
              <Image src={product.image3} />
            </Col>
          </Row>
        </Col>

        {/* Ürün bilgileri */}
        <Col span={14}>
          <h2 className="product-details-title">{product.name}</h2>
          <Rate defaultValue={4} />
          <p className="product-details-price">{product.price} TL</p>
          <p className="product-details-description">{product.description}</p>

          <Button
            type="primary"
            size="large"
            className="product-details-button"
            onClick={addToCart}
          >
            Sepete Ekle
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetailsCard;
