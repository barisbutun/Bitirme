import React, { useState, useRef } from "react";
import { Input, List, Spin, message } from "antd";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import "../css/SearchBar.css";

const { Search } = Input;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const lastQueryRef = useRef(""); // aynı sorguya tekrar fetch atmayı engellemek için

  const fetchResults = async (searchQuery) => {
    // if (!searchQuery || searchQuery.length < 2) {
    //   setResults([]);
    //   setLoading(false);
    //   return;
    // }

    if (lastQueryRef.current === searchQuery) return; // aynı sorgu tekrar gönderilmesin
    lastQueryRef.current = searchQuery;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8082/api/productElastic/v1/autocomplete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        }
      );

      if (!response.ok) throw new Error("Arama başarısız");

      const products = await response.json();

      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          try {
            const imageResponse = await fetch(
              `http://localhost:8082/api/image/v1/infos/${product.id}`
            );
            if (!imageResponse.ok) throw new Error("Resim yüklenemedi");

            const imageData = await imageResponse.json();
            const images = imageData.map(
              (base64) => `data:image/jpeg;base64,${base64}`
            );
            return { ...product, image: images[0] || null };
          } catch {
            return { ...product, image: null };
          }
        })
      );

      setResults(productsWithImages);
    } catch (error) {
      console.error("Arama hatası:", error);
      message.error("Arama sırasında bir hata oluştu!");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchResults = useRef(
    debounce((value) => fetchResults(value), 500)
  ).current;

  const handleSearch = async (value) => {
    setQuery(value);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8082/api/productElastic/v1/autocomplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: value }),
        }
      );

      if (!response.ok) throw new Error("Arama başarısız");

      const products = await response.json();

      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          try {
            const imageResponse = await fetch(
              `http://localhost:8082/api/image/v1/infos/${product.id}`
            );
            const imageData = await imageResponse.json();
            const images = imageData.map(
              (base64) => `data:image/jpeg;base64,${base64}`
            );
            return { ...product, image: images[0] || null };
          } catch {
            return { ...product, image: null };
          }
        })
      );

      // Tam eşleşme varsa detay sayfasına yönlendir
      const matchedProduct = productsWithImages.find(
        (product) => product.name.toLowerCase() === value.toLowerCase()
      );

      if (matchedProduct) {
        navigate(`/user/ProductDetails/${matchedProduct.id}`);
      } else {
        navigate("/user/SearchResults", {
          state: { results: productsWithImages },
        });
      }
    } catch (error) {
      console.error("Autocomplete arama hatası:", error);
      message.error("Arama sırasında bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchResults(value); // yazarken debounce ile çalışır
  };

  const handleItemClick = async (id) => {
    setQuery("");
    setResults([]);
    lastQueryRef.current = ""; // yeni aramalar yapılabilsin

    try {
      const response = await fetch(
        `http://localhost:8082/api/product/v1/${id}`
      );
      if (!response.ok) throw new Error("Ürün bulunamadı");

      await response.json(); // Detay gerekiyorsa burada işlenebilir
      navigate(`/user/ProductDetails/${id}`);
    } catch (error) {
      console.error("Ürün kontrol edilirken hata:", error);
      message.error("Ürün bulunamadı!");
      navigate("/user/Products");
    }
  };

  return (
    <div className="search-container">
      <Search
        placeholder="Ürün ara..."
        onChange={handleChange}
        onSearch={handleSearch}
        value={query}
        allowClear
        enterButton="Ara"
        size="large"
      />
      {loading && <Spin className="search-spin" />}
      {results.length > 0 && (
        <List
          className="search-list"
          size="small"
          bordered
          dataSource={results}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleItemClick(item.id)}
              style={{ cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      marginRight: 10,
                    }}
                  />
                )}
                <div>
                  <strong>{item.name}</strong>
                  <p style={{ margin: 0 }}>{item.description}</p>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SearchBar;
