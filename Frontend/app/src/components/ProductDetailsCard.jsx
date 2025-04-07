import React, { useState, useEffect } from "react";
import { Card, Button, Rate, Row, Col, Image, notification } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import "../css/ProductDetailsCard.css";
import { addToCart } from "../services/ProductService/ShoppingCardService";
import {
  addFavorite,
  removeFavorite,
} from "../services/ProductService/FavoriteService";

const ProductDetailsCard = ({ product, images }) => {
  // Prop olarak 'product' ve 'images' alıyoruz
  const [isFavorite, setIsFavorite] = useState(false);

  // Ürün bilgisi geldiğinde favori durumunu güncelle
  useEffect(() => {
    if (product) {
      setIsFavorite(
        product.favorite?.some((fav) => fav.product_id === product.id)
      );
    }
  }, [product]);

  const toggleFavoriteHandler = async () => {
    try {
      let success;
      if (isFavorite) {
        success = await removeFavorite(product.id);
        if (success) setIsFavorite(false);
      } else {
        success = await addFavorite({
          id: product.id,
          categoryId: product.category_id,
          price: product.price,
          name: product.name,
        });
        if (success) setIsFavorite(true);
      }

      if (success) {
        notification.success({
          message: isFavorite
            ? "Favorilerden Kaldırıldı"
            : "Favorilere Eklendi",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Bir hata oluştu.",
        placement: "topRight",
      });
    }
  };

  const addToCartHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        notification.info({
          message: "Giriş Yapın",
          description: "Sepete ürün eklemek için giriş yapmalısınız.",
          placement: "topRight",
        });
        return;
      }

      await addToCart({ product_id: product.id, quantity: 1 });
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

  return (
    <Card className="product-details-card">
      <Row gutter={16}>
        <Col span={10}>
          <Image className="zoom-image" width={400} src={images[0]} />{" "}
          {/* resim listesi eğer varsa */}
        </Col>
        <Col span={14}>
          <h2 className="product-details-title">{product.name}</h2>
          <Rate defaultValue={product.averageRating || 0} />
          <p className="product-details-price">{product.price} TL</p>
          <Button type="primary" size="large" onClick={addToCartHandler}>
            Sepete Ekle
          </Button>
          <button
            className={`favoriteButton ${isFavorite ? "active" : ""}`}
            onClick={toggleFavoriteHandler}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {isFavorite ? (
              <HeartFilled style={{ color: "red", fontSize: "24px" }} />
            ) : (
              <HeartOutlined style={{ fontSize: "24px" }} />
            )}
          </button>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetailsCard;
