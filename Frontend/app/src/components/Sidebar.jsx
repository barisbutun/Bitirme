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
    label: <Link to="/Profile">Profilim</Link>, // Profilim sayfasına yönlendirme
  },
  {
    key: "3",
    icon: <LoginOutlined />, // Giriş ikonu
    label: "Giriş/Kayıt", // Giriş sayfasına yönlendirme
    children: [
      { key: "31", label: <Link to="/SignUp">Kayıt Ol</Link> },
      { key: "32", label: <Link to="/Login">Giriş</Link> },
    ],
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
  // {
  //   key: "6",
  //   icon: <TruckOutlined />, // Teslimatikonu
  //   label: <Link to="/Delivery">Alışveriş Bilgileri</Link>, // Alışveriş bilgileri sayfasına yönlendirme
  // },
  {
    key: "7",
    icon: <SettingOutlined />, // Ayarlar ikonu
    label: <Link to="/settings">Ayarlar</Link>, // Ayarlar sayfasına yönlendirme
  },
  // {
  //   key: "8",
  //   // icon: <SettingOutlined />, // Ayarlar ikonu
  //   label: <Link to="/AdminPage">Admin</Link>, // Ayarlar sayfasına yönlendirme
  // },
];

const Sidebar = ({ collapsed, setCollapsed }) => (
  <Sider
    collapsible
    collapsed={collapsed}
    trigger={null}
    // onCollapse={(value) => setCollapsed(value)}
    breakpoint="lg"
    collapsedWidth="0"
    onBreakpoint={(broken) => {
      console.log(broken);
    }}
  >
    <div className="demo-logo-vertical" />
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["7"]}
      items={items}
    />
  </Sider>
);

export default Sidebar;
