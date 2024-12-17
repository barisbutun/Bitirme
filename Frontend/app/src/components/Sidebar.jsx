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
  // Rol durumuna göre filtrelenmiş menü öğeleri
  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/user/Homepage">Anasayfaya </Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/user/Profile">Profilim</Link>,
    },
    {
      key: "3",
      icon: <LoginOutlined />,
      label: "Giriş/Kayıt",
      children: [
        { key: "31", label: <Link to="/user/SignUp">Kayıt Ol</Link> },
        { key: "32", label: <Link to="/Login">Giriş</Link> },
      ],
    },
    {
      key: "4",
      icon: <AppstoreOutlined />,
      label: <Link to="/user/Products">Ürünler</Link>,
    },
    {
      key: "5",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/user/ShoppingCard">Sepetim</Link>,
    },
    {
      key: "7",
      icon: <ShoppingOutlined />,
      label: <Link to="/user/Orders">Siparişlerim</Link>,
    },
    {
      key: "8",
      icon: <CreditCardFilled />,
      label: <Link to="/user/Payment">Ödeme Bilgileri</Link>,
    },
    {
      key: "9",
      icon: <SettingOutlined />,
      label: <Link to="/user/settings">Ayarlar</Link>,
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
