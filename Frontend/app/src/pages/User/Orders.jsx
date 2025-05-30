import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [newAddress, setNewAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("orderCart")) || [];
    setCartItems(storedItems);
  }, []);

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
    image:
      Array.isArray(item.product?.images) && item.product.images.length > 0
        ? item.product.images[0]
        : "", // veya bir placeholder url'si
    name: item.product?.name || "Ürün ismi yok",
    quantity: item.quantity,
    size: item.size,
    price: item.product?.price || 0,
    total: item.quantity * (item.product?.price || 0),
    productId: item.product?.id || null,
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
      const orderData = {
        userId,
        address: useSavedAddress ? "Kayıtlı adres" : newAddress,
        is_same_address: useSavedAddress,
        description: "sipariş",
        sumPrice: dataSource.reduce((sum, item) => sum + item.total, 0),
        saleDate: new Date().toISOString(),
        // stockState: "Hazırlanıyor",
        products: dataSource.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
      };

      const response = await createOrder(orderData);

      notification.success({
        message: "Sipariş Oluşturuldu",
        description: "Siparişiniz başarıyla kaydedildi.",
      });

      setIsModalOpen(false);
      navigate("/user/OrdersList");
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", error);
      notification.error({
        message: "Hata",
        description: error.message || "Sipariş sırasında bir hata oluştu.",
      });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="orders-layout"
        style={{
          marginLeft: collapsed ? 20 : 220,
          marginTop: 140,
          marginRight: collapsed ? 20 : 20,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="orders-container">
          <h2>Sipariş Verilen Ürünler</h2>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
          />
          <div className="address-section">
            <h3>Adres Seçimi</h3>
            <Radio.Group
              value={useSavedAddress}
              onChange={(e) => setUseSavedAddress(e.target.value)}
            >
              <Radio value={true}>Kayıtlı adresi kullan</Radio>
              <Radio value={false}>Yeni adres gir</Radio>
            </Radio.Group>
            {!useSavedAddress && (
              <Input.TextArea
                rows={3}
                placeholder="Yeni adresinizi girin..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                style={{ marginTop: 10 }}
              />
            )}

            <Button
              type="primary"
              onClick={handleConfirmOrder}
              style={{ marginTop: 20 }}
            >
              Siparişi Onayla
            </Button>

            <Button
              type="default"
              onClick={() => navigate("/user/OrdersList")}
              style={{ marginTop: 20, marginLeft: 40, marginRight: 10 }}
            >
              Kayıtlı Siparişlerim
            </Button>
          </div>
        </div>
        <Footer>
          <div
            className="pagination-inside-footer"
            style={{ marginTop: 340, marginLeft: collapsed ? 80 : 180 }}
          >
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
        <Modal
          title="Siparişi Onayla"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSubmitOrder}
          okText="Evet, Siparişi Ver"
          cancelText="İptal"
        >
          <p>Siparişi onaylamak istediğinize emin misiniz?</p>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default Orders;
