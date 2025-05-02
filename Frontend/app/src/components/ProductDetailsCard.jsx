import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Rate,
  Row,
  Col,
  Image,
  notification,
  Tooltip,
  Skeleton,
  Collapse,
} from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import "../css/ProductDetailsCard.css";
import { addToCart } from "../services/ProductService/ShoppingCardService";
import {
  addFavorite,
  removeFavorite,
} from "../services/ProductService/FavoriteService";
import { getReviewCount } from "../services/ProductService/ReviewService";

const { Panel } = Collapse;

const ProductDetailsCard = ({ product, images }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (product) {
      setIsFavorite(
        product.favorite?.some((fav) => fav.product_id === product.id)
      );
    }

    if (product?.id) {
      getReviewCount(product.id)
        .then(setReviewCount)
        .catch((err) =>
          console.error("Yorum sayısı alınırken hata oluştu:", err)
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

  const handleSizeClick = (size, count) => {
    if (count > 0) {
      setSelectedSize(size);
    }
  };

  const getTotalQuantity = (qty) => {
    if (typeof qty === "number") return qty;
    if (typeof qty === "object") {
      return Object.values(qty).reduce((acc, val) => acc + val, 0);
    }
    return 0;
  };

  const isAvailable =
    product?.stock_state?.toUpperCase() === "AVAILABLE" &&
    getTotalQuantity(product?.quantity) > 0;

  return (
    <Card className="product-details-card">
      <Row gutter={16}>
        <Col span={10}>
          {images[0] ? (
            <Image
              className="zoom-image"
              width={400}
              src={images[0]}
              placeholder={
                <Skeleton.Image
                  active
                  style={{ width: 400, height: 400, borderRadius: "8px" }}
                />
              }
              preview={false}
            />
          ) : (
            <Skeleton.Image
              active
              style={{ width: 400, height: 400, borderRadius: "8px" }}
            />
          )}
        </Col>
        <Col span={14}>
          <h2 className="product-details-title">{product.name}</h2>

          <Tooltip title={`${reviewCount} yorum`}>
            <Rate
              allowHalf
              disabled
              defaultValue={product.averageRating || 0}
            />
          </Tooltip>
          <p style={{ marginTop: 4 }}>{reviewCount} yorum</p>

          <p className="product-details-price">{product.price} TL</p>

          {typeof product.quantity === "object" && (
            <div className="product-sizes">
              <h4 style={{ margin: "10px 0 5px" }}>Beden Seçimi</h4>
              <div className="size-boxes">
                {Object.entries(product.quantity).map(([size, count]) => (
                  <div
                    key={size}
                    className={`size-box ${
                      selectedSize === size ? "selected" : ""
                    } ${count === 0 ? "out-of-stock" : ""}`}
                    onClick={() => handleSizeClick(size, count)}
                  >
                    <div className="size-label">{size}</div>
                    {/* Stok bilgisi gösterilmiyor */}
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Açılır/Kapanır Bilgi Alanları */}
          <Collapse className="extra-collapse" bordered={false}>
            <Panel header="Model Bilgileri" key="1">
              <ul className="extra-info-list">
                Modelin Üzerindeki Beden: S, Modelin Ölçüleri: Boy: 175 cm,
                Göğüs: 86 cm, Bel: 60 cm, Basen: 90 cm"
              </ul>
            </Panel>
            <Panel header="Satış Şartları" key="2">
              <ul className="extra-info-list">
                <li>Ücretsiz kargo ile gönderim</li>
                <li>14 gün içinde iade garantisi</li>
                <li>Kapıda ödeme seçeneği mevcut</li>
                <li>Tüm kredi kartlarına taksit imkanı</li>
              </ul>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetailsCard;
