import React from "react";
import {
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  AppstoreOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom"; // Link to for routing
import "../css/Sidebar.css";

const { Sider } = Layout;
const items = [
  {
    key: "1",
    icon: <HomeOutlined />, // Anasayfa ikonu
    label: <Link to="/Homepage">Anasayfaya </Link>, // Anasayfaya yönlendirme
  },
  {
    key: "2",
    icon: <UserOutlined />, // Profilim ikonu
    label: <Link to="/profile">Profilim</Link>, // Profilim sayfasına yönlendirme
  },
  {
    key: "3",
    icon: <LoginOutlined />, // Giriş ikonu
    label: <Link to="/Login">Giriş</Link>, // Giriş sayfasına yönlendirme
  },
  {
    key: "4",
    icon: <AppstoreOutlined />, // Ürünler ikonu
    label: <Link to="/Products">Ürünler</Link>, // Ürünler sayfasına yönlendirme
  },
  {
    key: "5",
    icon: <ShoppingCartOutlined />, // Sepetim ikonu
    label: <Link to="/ShoppingCard">Sepetim</Link>, // Sepetim sayfasına yönlendirme
  },
  {
    key: "6",
    icon: <TruckOutlined />, // Teslimatikonu
    label: <Link to="/Delivery">Alışveriş Bilgileri</Link>, // Alışveriş bilgileri sayfasına yönlendirme
  },
  {
    key: "7",
    icon: <SettingOutlined />, // Ayarlar ikonu
    label: <Link to="/settings">Ayarlar</Link>, // Ayarlar sayfasına yönlendirme
  },
];

const Sidebar = () => (
  <Sider
    breakpoint="lg"
    collapsedWidth="0"
    onBreakpoint={(broken) => {
      console.log(broken);
    }}
    onCollapse={(collapsed, type) => {
      console.log(collapsed, type);
    }}
  >
    <div className="demo-logo-vertical" />
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["4"]}
      items={items}
    />
  </Sider>
);

export default Sidebar;
