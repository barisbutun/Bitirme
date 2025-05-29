import { Modal, Card, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { fetchProductImages } from "../services/ProductService/ProductService";

const ProductListModal = ({ isOpen, setIsOpen }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchProductsAndImages = async () => {
        try {
          const res = await fetch("http://localhost:8082/api/product/v1/all");
          if (!res.ok) throw new Error("Ürünler alınamadı");
          const productsData = await res.json();

          const productsWithImages = await Promise.all(
            productsData.map(async (product) => {
              try {
                const images = await fetchProductImages(product.id);
                return { ...product, images };
              } catch {
                return { ...product, images: [] };
              }
            })
          );

          setProducts(productsWithImages);
        } catch (err) {
          console.error(err);
        }
      };

      fetchProductsAndImages();
    }
  }, [isOpen]);

  return (
    <Modal
      title="Tüm Ürünler"
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      width={1000}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        {products.map((product) => (
          <Tooltip
            key={product.id}
            placement="right"
            mouseEnterDelay={0.2}
            overlayInnerStyle={{
              maxWidth: 320,
              padding: 16,
              backgroundColor: "#fff",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              color: "#333",
              fontSize: 13,
              lineHeight: 1.4,
            }}
            title={
              <div>
                <p
                  style={{
                    fontWeight: "700",
                    marginBottom: 8,
                    fontSize: 14,
                    color: "#1890ff",
                  }}
                >
                  {product.name}
                </p>
                <p>
                  <strong>Açıklama:</strong> {product.description}
                </p>
                <p>
                  <strong>Satış:</strong> {product.saleCount}
                </p>
                <p>
                  <strong>Stok Durumu:</strong> {product.stock_state}
                </p>
                <p>
                  <strong>Fiyat:</strong>{" "}
                  <span style={{ color: "#52c41a", fontWeight: "600" }}>
                    {product.price} ₺
                  </span>
                </p>
                <p>
                  <strong>Ortalama Puan:</strong> {product.averageRating}
                </p>
                <p>
                  <strong>Favorilenme Sayısı:</strong> {product.favouriteCount}
                </p>
                <p>
                  <strong>Değerlendirme Sayısı:</strong> {product.reviewCount}
                </p>
              </div>
            }
          >
            <Card
              hoverable
              style={{
                width: "100%", // grid sütunu genişliğine uyacak şekilde
                padding: 8,
                borderRadius: 8,
                textAlign: "center",
                fontSize: 12,
              }}
              cover={
                product.images && product.images.length > 0 ? (
                  <img
                    alt={product.name}
                    src={product.images[0]}
                    style={{
                      height: 100,
                      width: "100%",
                      objectFit: "contain",
                      borderRadius: 6,
                    }}
                  />
                ) : null
              }
            >
              <p className="font-semibold truncate">{product.name}</p>
              <p style={{ fontWeight: "bold", color: "#1890ff" }}>
                {product.price} ₺
              </p>
            </Card>
          </Tooltip>
        ))}
      </div>
    </Modal>
  );
};

export default ProductListModal;
