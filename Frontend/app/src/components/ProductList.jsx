// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Layout, Card, Row, Col } from "antd";
import "../css/ProductList.css"; // İsteğe bağlı CSS dosyası

const { Content } = Layout;

const ProductList = ({ filteredCategory }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // JSON dosyasından ürünleri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/products.json"); // JSON dosyanızın yolu
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // İlk başta tüm ürünleri göster
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchData();
  }, []);

  // Filtre değiştiğinde ürünleri filtreleme
  useEffect(() => {
    if (filteredCategory) {
      const newFilteredProducts = products.filter(
        (product) => product.name === filteredCategory
      );
      setFilteredProducts(newFilteredProducts);
    } else {
      setFilteredProducts(products); // Filtre yoksa tüm ürünleri göster
    }
  }, [filteredCategory, products]);

  return (
    <Content style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.name}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.image} />}
            >
              <Card.Meta
                title={product.name}
                description={product.description}
              />
              <p>Fiyat: {product.price} TL</p>
              <p>Stok Durumu: {product.stock}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default ProductList;
