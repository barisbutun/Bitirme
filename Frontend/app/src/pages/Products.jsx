import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Products.css";
import ProductCard from "../components/ProductCard";
import FilterComponent from "../components/FilterComponent";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState(null);

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

  // const fetchData = async () => {
  //   const url = "";
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "x-rapidapi-key": "Sign Up for Key",
  //       "x-rapidapi-host": "amazon-product-info2.p.rapidapi.com",
  //     },
  //   };

  //   try {
  //     const response = await fetch(url, options);
  //     const result = await response.json();
  //     console.log(result);
  //     setProducts(result);
  //     setFilteredProducts(result);
  //   } catch (error) {
  //     console.error("veri çekme hatası", error);
  //   }
  // };
  // // useEffect ile bileşen yüklendiğinde API'yi çağırma
  // useEffect(() => {
  //   fetchData(); // bileşen yüklendiğinde veri çekme
  // }, []);

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
      <Sidebar />
      <Layout className="product-layout">
        <Header>
          <FilterComponent onApplyFilter={handleApplyFilter} />
        </Header>
        <div className="content">
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.name}
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
