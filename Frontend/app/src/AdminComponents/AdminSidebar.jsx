import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  HeartOutlined,
  FileImageFilled,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import "../css/Sidebar.css";
import { decodeToken } from "../utils/auth";

const { Sider } = Layout;

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = decodeToken();
    setUserRole(role);
  }, []);

  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/AdminPage">Anasayfaya </Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/UserManagement">Kullanıcı İşlemleri</Link>,
    },
    {
      key: "3",
      icon: <AppstoreOutlined />,
      label: <Link to="/CategoryManagement">Kategori İşlemleri</Link>,
    },
    {
      key: "4",
      icon: <AppstoreOutlined />,
      label: <Link to="/ProductManagement">Ürün İşlemleri</Link>,
    },

    {
      key: "5",
      icon: <ShoppingOutlined />,
      label: <Link to="/Orders">Sipariş İşlemleri</Link>,
    },

    {
      key: "6",
      icon: <FileImageFilled />,
      label: <Link to="/ImageManagement">Resim İşlemleri</Link>,
    },

    {
      key: "7",
      icon: <HeartOutlined />,
      label: <Link to="/FavoriteManagement">Favori İşlemleri</Link>,
    },
    {
      key: "8",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Ayarlar</Link>,
    },
  ];

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

export default AdminSidebar;
