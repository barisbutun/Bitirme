import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Drawer,
  Button,
  Typography,
  Descriptions,
  notification,
  Space,
} from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import "../User/UserCss/Orders.css";
import { getToken } from "../../utils/auth";

const Orders = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8082/api/order/v1", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error("Siparişler alınamadı");
        }

        const data = await response.json();
        console.log("Siparişler:", data);

        // Eğer API'den dönen veri ID içermiyorsa, düzeltme yapalım
        const formattedOrders = data.map((order, index) => ({
          ...order,
          key: order.id || index, // ID yoksa key olarak index kullan
        }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Sipariş verileri alınamadı:", error);
        notification.error({
          message: "Hata",
          description: "Sipariş verileri alınamadı.",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCheckout = (id) => {
    if (!id) {
      notification.error({
        message: "Hata",
        description: "Sipariş ID'si geçersiz!",
      });
      return;
    }
    navigate(`/Payment?orderId=${id}`);
  };

  const viewOrderDetails = async (id) => {
    if (!id) {
      notification.error({
        message: "Hata",
        description: "Sipariş ID'si bulunamadı!",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/api/order/v1/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Sipariş detayları alınamadı");
      }

      const orderDetails = await response.json();
      console.log("Sipariş Detayları:", orderDetails);

      setSelectedOrder(orderDetails);
      setDrawerVisible(true);
    } catch (error) {
      console.error("Sipariş detayları alınamadı:", error);
      notification.error({
        message: "Hata",
        description: "Sipariş detayları alınırken bir hata oluştu.",
        placement: "topRight",
      });
    }
  };

  const columns = [
    {
      title: "Sipariş ID",
      dataIndex: "id",
      key: "id",
      render: (text) => text || "Bilinmiyor",
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Toplam Fiyat",
      dataIndex: "sum_price",
      key: "sum_price",
    },
    {
      title: "Durum",
      dataIndex: "payment_state",
      key: "payment_state",
    },
    {
      title: "İşlemler",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => viewOrderDetails(record.id)}
            disabled={!record.id}
          >
            Görüntüle
          </Button>
          <Button
            type="primary"
            onClick={() => handleCheckout(record.id)}
            disabled={!record.id}
          >
            Sipariş Et
          </Button>
        </Space>
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
            rowKey={(record) => record.key}
            pagination={false}
            loading={loading}
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
        open={isDrawerVisible}
        width={400}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Sipariş ID">
              {selectedOrder.id || "Bilinmiyor"}
            </Descriptions.Item>
            <Descriptions.Item label="Tarih">
              {selectedOrder.date || "Bilinmiyor"}
            </Descriptions.Item>
            <Descriptions.Item label="Toplam Tutar">
              {selectedOrder.total || "Bilinmiyor"}
            </Descriptions.Item>
            <Descriptions.Item label="Durum">
              {selectedOrder.status || "Bilinmiyor"}
            </Descriptions.Item>
            <Descriptions.Item label="Ürünler">
              <ul>
                {selectedOrder.products && selectedOrder.products.length > 0 ? (
                  selectedOrder.products.map((product, index) => (
                    <li key={product.id || index}>
                      {product.name} - {product.price} TL
                    </li>
                  ))
                ) : (
                  <li>Ürün bilgisi bulunamadı</li>
                )}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </Layout>
  );
};

export default Orders;
