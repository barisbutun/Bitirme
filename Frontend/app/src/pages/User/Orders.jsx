import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Button,
  Modal,
  notification,
  Space,
  Input,
  Radio,
  Table,
} from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Orders.css";
import { createOrder } from "../../services/ProductService/OrdersService";
import { getUserIdFromToken } from "../../utils/auth";

const Orders = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { state: cartItems = [] } = useLocation();
  const navigate = useNavigate();

  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [newAddress, setNewAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = getUserIdFromToken();

  const columns = [
    {
      title: "Ürün Görseli",
      dataIndex: "image",
      render: (src) => (
        <img
          style={{ width: 60, height: 60, objectFit: "cover" }}
          src={src}
          alt="ürün"
        />
      ),
    },
    { title: "Ürün Adı", dataIndex: "name" },
    { title: "Adet", dataIndex: "quantity" },
    { title: "Beden", dataIndex: "size" },
    {
      title: "Birim Fiyat",
      dataIndex: "price",
      render: (p) => `${p.toFixed(2)} ₺`,
    },
    {
      title: "Toplam",
      dataIndex: "total",
      render: (t) => `${t.toFixed(2)} ₺`,
    },
  ];

  const dataSource = cartItems.map((item, idx) => ({
    key: idx,
    image: item.product.images?.[0] || "",
    name: item.product.name,
    quantity: item.quantity,
    size: item.size,
    price: item.product.price,
    total: item.quantity * item.product.price,
  }));

  const handleConfirmOrder = () => {
    if (!useSavedAddress && !newAddress.trim()) {
      notification.warning({
        message: "Adres Gerekli",
        description: "Yeni adres alanı boş bırakılamaz.",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitOrder = async () => {
    try {
      const orderDto = {
        description: "sipariş",
        is_same_address: useSavedAddress,
        address: useSavedAddress ? null : newAddress.trim(),
      };

      const created = await createOrder(orderDto);

      notification.success({ message: "Sipariş başarıyla oluşturuldu" });

      navigate("/user/Payment", { state: { cartItems, order: created } });
    } catch (err) {
      notification.error({
        message: "Hata",
        description: err.message || "Sipariş oluşturulurken hata oluştu",
      });
    }
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 0 : 200 }}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div style={{ padding: 24 }}>
          <h2>Sipariş Onayı</h2>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
            style={{ marginBottom: 24 }}
          />

          <Radio.Group
            onChange={(e) => setUseSavedAddress(e.target.value)}
            value={useSavedAddress}
          >
            <Space direction="vertical">
              <Radio value={true}>Kayıtlı adresi kullan</Radio>
              <Radio value={false}>Yeni adres gir</Radio>
            </Space>
          </Radio.Group>

          {!useSavedAddress && (
            <Input.TextArea
              rows={4}
              placeholder="Yeni adresinizi girin"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              style={{ marginTop: 12 }}
            />
          )}

          <Button
            type="primary"
            onClick={handleConfirmOrder}
            style={{ marginTop: 20 }}
          >
            Siparişi Onayla
          </Button>

          <Modal
            title="Sipariş Özeti"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleSubmitOrder}
            okText="Tamamla"
            cancelText="İptal"
            width={800}
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              bordered
            />
          </Modal>
        </div>
        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Orders;
