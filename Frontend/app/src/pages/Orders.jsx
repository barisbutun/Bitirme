import React, { useState } from "react";
import { Layout, Table, Drawer, Button, Typography, Descriptions } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom"; // useNavigate'i ekledik
import "../css/Orders.css";

const Orders = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate(); // navigate fonksiyonunu tanımladık

  // Örnek sipariş verileri
  const orders = [
    {
      key: "1",
      orderId: "1234",
      date: "2024-10-31",
      total: "150 TL",
      status: "Hazırlanıyor",
    },
    {
      key: "2",
      orderId: "5678",
      date: "2024-10-30",
      total: "200 TL",
      status: "Kargoya Verildi",
    },
  ];

  // Sipariş detaylarını göster
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  // Ödeme sayfasına yönlendirme fonksiyonu
  const handleCheckout = (orderId) => {
    navigate(`/Payment?orderId=${orderId}`);
  };

  // Tablo sütunları
  const columns = [
    { title: "Sipariş ID", dataIndex: "orderId", key: "orderId" },
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

        {/* Sipariş Bilgileri Alanı */}
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
                <li>Ürün 1 - 50 TL</li>
                <li>Ürün 2 - 100 TL</li>
              </ul>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </Layout>
  );
};

export default Orders;
