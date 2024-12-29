import React, { useState } from "react";
import { Layout, theme, Input, Button, Drawer, Menu } from "antd";
import "../css/Header.css";
import FilterComponent from "./FilterComponent";
import { logout } from "../services/UserService/AuthService";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HeartOutlined,
} from "@ant-design/icons";
const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = ({ onFilterChange, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (logout()) {
      navigate("/");
    } else {
      console.error("Çıkış işlemi başarısız.");
    }
  };

  const items = [
    {
      key: "1",
      icon: <UserOutlined />, // Profilim ikonu
      label: <Link to="/">Giriş Yap</Link>, // Profilim sayfasına yönlendirme
      children: [
        { key: "11", label: <Link to="/user/SignUp">Kayıt Ol</Link> },
        { key: "12", label: <Link to="/Login">Giriş Yap</Link> },
        {
          key: "13",
          label: <span onClick={handleLogout}>Çıkış Yap</span>,
        },
      ],
    },
  ];
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  // Arama fonksiyonu
  const onSearch = (value) => {
    console.log("Arama sorgusu:", value);
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
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="toggle-button"
      />

      {/* Arama kutusu */}
      <Search
        className="header-search"
        placeholder="Ara..."
        allowClear
        onSearch={onSearch}
      />

      <div className="headerbuttons">
        <Menu mode="horizontal" defaultSelectedKeys={["2"]} items={items} />

        <Button icon={<ShoppingCartOutlined />}>
          <Link to="/user/ShoppingCard">Sepetim</Link>
        </Button>

        <Button className="header-favorite" icon={<HeartOutlined />}>
          <Link to="/user/Favorites">Favorilerim</Link>
        </Button>

        {/* Filtreleme butonu */}
        <Button
          className="header-filter-button"
          type="primary"
          onClick={showDrawer}
        >
          Filtrele
        </Button>
      </div>

      {/* Drawer ile filtreleme bileşeni */}
      <Drawer
        title="Ürün Filtreleme"
        placement="right"
        open={isDrawerVisible}
        onClose={closeDrawer}
      >
        <FilterComponent onApplyFilter={onFilterChange} />
      </Drawer>
    </Header>
  );
};

export default HeaderComponent;
