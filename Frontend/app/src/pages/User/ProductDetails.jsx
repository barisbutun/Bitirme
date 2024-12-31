import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductDetailsCard from "../../components/ProductDetailsCard";
import "../User/UserCss/ProductDetails.css";
import { useParams } from "react-router-dom";
import {
  fetchProducts,
  fetchProductImages,
} from "../../services/ProductService/ProductService";

const ProductDetails = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const { id } = useParams(); // URL parametrelerinden id'yi alıyoruz

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return; // Eğer id yoksa işlem yapma
      try {
        // Ürünleri çekiyoruz
        const products = await fetchProducts();
        console.log("Fetched products:", products); // API'den gelen ürünleri kontrol et

        // id'ye göre ürünü buluyoruz
        const selectedProduct = products.find(
          (product) => product.id === parseInt(id, 10)
        );

        if (selectedProduct) {
          setProduct(selectedProduct);

          // Ürün resmi verilerini alıyoruz
          const productImages = await fetchProductImages(selectedProduct.id);
          console.log("Fetched images:", productImages); // Resimleri kontrol et

          // Eğer resimler Base64 formatında geldiyse doğru şekilde kullan
          const imageUrls = productImages.map((image) => {
            return image.startsWith("data:image")
              ? image
              : `data:image/jpeg;base64,${image}`;
          });

          setImages(imageUrls); // Base64 resimlerini state'e set ediyoruz
        } else {
          console.error("Ürün bulunamadı");
        }
      } catch (error) {
        console.error("Veriler alınırken hata oluştu:", error);
      }
    };

    fetchProductDetails();
  }, [id]); // id değiştiğinde tekrar çalışacak

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="site-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="productdetails-content">
          {product ? (
            <ProductDetailsCard product={product} images={images} />
          ) : (
            <p>Ürün yükleniyor...</p> // Ürün gelene kadar yükleniyor mesajı
          )}
        </div>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProductDetails;
