import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  AppstoreOutlined,
  CreditCardFilled,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import "../css/Sidebar.css";
import { decodeToken } from "../utils/auth";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [userRole, setUserRole] = useState("null");

  useEffect(() => {
    const userRole = decodeToken();
    setUserRole(userRole);
  }, []);

  // Rol durumuna göre filtrelenmiş menü öğeleri
  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/Homepage">Anasayfaya </Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/Profile">Profilim</Link>,
    },
    {
      key: "3",
      icon: <LoginOutlined />,
      label: "Giriş/Kayıt",
      children: [
        { key: "31", label: <Link to="/SignUp">Kayıt Ol</Link> },
        { key: "32", label: <Link to="/Login">Giriş</Link> },
      ],
    },
    {
      key: "4",
      icon: <AppstoreOutlined />,
      label: <Link to="/Products">Ürünler</Link>,
    },
    {
      key: "5",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/ShoppingCard">Sepetim</Link>,
    },
    {
      key: "7",
      icon: <ShoppingOutlined />,
      label: <Link to="/Orders">Siparişlerim</Link>,
    },
    {
      key: "8",
      icon: <CreditCardFilled />,
      label: <Link to="/Payment">Ödeme Bilgileri</Link>,
    },
    {
      key: "9",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Ayarlar</Link>,
    },
    // Sadece admin kullanıcılar için görünür olan "Admin" menü öğesi
    userRole === "admin" && {
      key: "10",
      icon: <SettingOutlined />,
      label: <Link to="/AdminPage">Admin</Link>,
    },
  ].filter(Boolean); // undefined değerleri kaldırmak için filter(Boolean) kullanın

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
