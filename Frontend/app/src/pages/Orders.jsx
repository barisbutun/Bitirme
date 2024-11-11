import React, { useState, useEffect } from "react";
import { Layout, Table, Drawer, Button, Typography, Descriptions } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../css/Orders.css";

const Orders = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); //Admin kontrolü için
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı-Admin Kontrolü
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);

    fetch("/Orders.json")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) =>
        console.error("Sipariş verileri alınırken hata oluştu:", error)
      );
  }, []);

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  const handleCheckout = (orderId) => {
    navigate(`/Payment?orderId=${orderId}`);
  };

  const columns = [
    ...(isAdmin
      ? [{ title: "Sipariş ID", dataIndex: "orderId", key: "orderId" }]
      : []),
    { title: "Tarih", dataIndex: "date", key: "date" },
    { title: "Toplam Tutar", dataIndex: "total", key: "total" },
    { title: "Durum", dataIndex: "status", key: "status" },
    {
      title: "Detaylar",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showOrderDetails(record)}>
            Görüntüle
          </Button>
          <Button type="primary" onClick={() => handleCheckout(record.orderId)}>
            Sipariş Et
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="Orders-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="orders-content">
          <Typography.Title level={2}>Siparişlerim</Typography.Title>
          <Table
            columns={columns}
            dataSource={orders}
            pagination={false}
            className="order-table"
          />
        </div>

        <Footer />
      </Layout>

      {/* Sipariş Detayları Drawer */}
      <Drawer
        title="Sipariş Detayları"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={400}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Sipariş ID">
              {selectedOrder.orderId}
            </Descriptions.Item>
            <Descriptions.Item label="Tarih">
              {selectedOrder.date}
            </Descriptions.Item>
            <Descriptions.Item label="Toplam Tutar">
              {selectedOrder.total}
            </Descriptions.Item>
            <Descriptions.Item label="Durum">
              {selectedOrder.status}
            </Descriptions.Item>
            <Descriptions.Item label="Ürünler">
              <ul>
                {selectedOrder.products.map((product, index) => (
                  <li key={index}>
                    {product.name} - {product.price} TL
                  </li>
                ))}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </Layout>
  );
};

export default Orders;
