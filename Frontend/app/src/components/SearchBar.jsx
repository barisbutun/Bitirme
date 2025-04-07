import React, { useState } from "react";
import { Input, List, Spin } from "antd";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom"; // yönlendirme için
import "../css/SearchBar.css";

const { Search } = Input;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchResults = debounce(async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

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

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Arama işlemi sırasında hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = (value) => {
    setQuery(value);
    fetchResults(value);
  };

  const handleItemClick = (id) => {
    console.log("Seçilen ürün ID:", id); // kontrol için
    setQuery(""); // arama kutusunu temizle
    setResults([]); // sonuç listesini kapat
    navigate(`/user/ProductDetails/${id}`); // ürün detay sayfasına yönlendir
  };

  return (
    <div className="search-container">
      <Search
        placeholder="Ürün ara..."
        onChange={(e) => handleSearch(e.target.value)}
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
