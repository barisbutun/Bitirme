import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Products.css";
import ProductCard from "../../components/ProductCard";
import FilterComponent from "../../components/FilterComponent";
import {
  fetchProducts,
  fetchProductImages,
} from "../../services/ProductService/ProductService";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        const productsData = await fetchProducts();
        console.log("products.jsx'deki -API'den gelen ham veri:", productsData); // Debug log 1

        // Resimleri ekle
        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            const images = await fetchProductImages(product.id);
            const transformedProduct = {
              ...product,
              images,
              category_id: product.categoryId || product.category_id,
              categoryId: product.categoryId || product.category_id, // Her iki formatı da koruyalım
            };
            console.log(
              "Products.jsx - Dönüştürülmüş ürün:",
              transformedProduct
            ); // Debug log 2
            return transformedProduct;
          })
        );
        console.log("Products.jsx - Final ürün listesi:", productsWithImages); // Debug log 3
        setProducts(productsWithImages);
        setFilteredProducts(productsWithImages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  const handleApplyFilter = (category) => {
    if (category) {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="product-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed}>
          <FilterComponent onApplyFilter={handleApplyFilter} />
        </Header>
        <div className="content">
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.images?.[0] || "default-image-path"} // İlk resmi veya varsayılan resmi göster
                price={product.price}
                description={product.description}
                quantity={product.quantity}
                stock_state={product.stock_state}
                category_id={product.category_id}
                categoryId={product.categoryId}
              />
            ))
          ) : (
            <p>Filtreleme kriterlerine uyan ürün bulunamadı.</p>
          )}
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Products;
