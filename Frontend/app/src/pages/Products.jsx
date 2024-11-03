import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Products.css";
import ProductCard from "../components/ProductCard";
import FilterComponent from "../components/FilterComponent";
// import { fetchProducts } from "../services/ProductService/ProductService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  // useEffect(() => {
  //   const getProducts = async () => {
  //     try {
  //       const data = await fetchProducts(); // Verileri servis ile çek
  //       setProducts(data);
  //       setFilteredProducts(data);
  //     } catch (error) {
  //       console.error("Ürünler yüklenirken hata:", error);
  //     }
  //   };
  //   getProducts();
  // }, []);

  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
      });
  }, []);

  // Kategoriye göre filtreleme
  const handleApplyFilter = (category) => {
    setFilteredCategory(category);
    if (category) {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Kategori seçilmezse tüm ürünler gösterilir
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
                image={product.image}
                price={product.price}
                description={product.description}
                stock={product.stock}
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
