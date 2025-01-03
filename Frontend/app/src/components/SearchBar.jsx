import React, { useState } from "react";
import { Input, List, Spin } from "antd";
import { debounce } from "lodash";
import "../css/SearchBar.css";
const { Search } = Input;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
            <List.Item>
              <div>
                <strong>{item.name}</strong>
                <p style={{ margin: 0 }}>{item.description}</p>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SearchBar;
