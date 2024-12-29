import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  HeartOutlined,
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
      label: <Link to="/admin/AdminPage">Anasayfaya </Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/admin/UserManagement">Kullanıcı İşlemleri</Link>,
    },

    {
      key: "3",
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/ProductManagement">Ürün İşlemleri</Link>,
      children: [
        { key: 31, label: <Link to="/admin/AddProduct">Ürün Ekle</Link> },
        {
          key: 32,
          label: (
            <Link to="/admin/UpdateProduct">Ürün Bilgileri Güncelleme</Link>
          ),
        },
        { key: 33, label: <Link to="/admin/DeleteProduct">Ürün Silme</Link> },
      ],
    },

    {
      key: "4",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/Orders">Sipariş İşlemleri</Link>,
      children: [
        {
          key: 41,
          label: <Link to="/admin/RegisteredOrders">Kayıtlı Siparişler</Link>,
        },
        { key: 42, label: <Link to="/admin/DeleteOrders">Sipariş Silme</Link> },
      ],
    },
    {
      key: "5",
      icon: <HeartOutlined />,
      label: <Link to="/admin/FavoriteManagement">Favori İşlemleri</Link>,
    },
    {
      key: "6",
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Ayarlar</Link>,
    },

    // {
    //   key: "3",
    //   icon: <AppstoreOutlined />,
    //   label: <Link to="/admin/CategoryManagement">Kategori İşlemleri</Link>,
    // },
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
