import React, { useState } from "react";
import { Layout, theme, Input, Button, Drawer } from "antd";
import "../css/Header.css";
import FilterComponent from "./FilterComponent";

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = ({ onFilterChange }) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState(null);
  // Arama fonksiyonu
  const onSearch = (value) => {
    console.log("Arama sorgusu:", value);
  };

  const handleApplyFilter = (category) => {
    setFilteredCategory(category);
    onFilterChange(category); // Seçilen kategoriyi üst bileşene gönder
  };

  // Drawer açma fonksiyonu
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  // Drawer kapama fonksiyonu
  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      className="site-layout-header"
      style={{ background: colorBgContainer }}
    >
      {/* Arama kutusu */}
      <Search
        className="header-search"
        placeholder="Ara..."
        allowClear
        onSearch={onSearch}
      />

      {/* Filtreleme butonu */}
      <Button
        className="header-filter-button"
        type="primary"
        onClick={showDrawer}
      >
        Filtrele
      </Button>

      {/* Drawer ile filtreleme bileşeni */}
      <Drawer
        title="Ürün Filtreleme"
        placement="right"
        onClose={closeDrawer}
        visible={isDrawerVisible}
      >
        <FilterComponent onApplyFilter={handleApplyFilter} />
      </Drawer>
    </Header>
  );
};

export default HeaderComponent;
