import React, { useState } from "react";
import { Layout, theme, Button, Drawer, Menu } from "antd";
import "../css/Header.css";
import FilterComponent from "./FilterComponent";
import SearchBar from "./SearchBar"; // SearchBar bileşenini import ettik
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
      icon: <UserOutlined />,
      label: <Link to="/">Giriş Yap</Link>,
      children: [
        {
          key: "11",
          label: <Link to="/user/EmailVerification">Kayıt Ol</Link>,
        },
        { key: "12", label: <Link to="/Login">Giriş Yap</Link> },
        {
          key: "13",
          label: <span onClick={handleLogout}>Çıkış Yap</span>,
        },
      ],
    },
  ];

  const [isDrawerVisible, setDrawerVisible] = useState(false);

  // Drawer açma fonksiyonu
  const showDrawer = () => {
    setDrawerVisible(true);
  };

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

      {/* SearchBar bileşenini buraya entegre ettik */}
      <SearchBar />

      <div className="headerbuttons">
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          className="header-menu"
        />

        <Button icon={<ShoppingCartOutlined />}>
          <Link to="/user/ShoppingCard">Sepetim</Link>
        </Button>

        <Button className="header-favorite" icon={<HeartOutlined />}>
          <Link to="/user/Favorites">Favorilerim</Link>
        </Button>

        <Button
          className="header-filter-button"
          type="primary"
          onClick={showDrawer}
        >
          Filtrele
        </Button>
      </div>

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
