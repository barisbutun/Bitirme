import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  List,
  Typography,
  Divider,
  notification,
  Spin,
} from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Payment.css";
// ... (önceki importlar aynı)
import { fetchProductImages } from "../../services/ProductService/ProductService";

const Payment = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const orderId = searchParams.get("orderId");
  const { Title, Text } = Typography;

  const getToken = () => localStorage.getItem("token");

  const fetchOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8082/api/order/v1/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) throw new Error("Sipariş alınamadı");

      const data = await response.json();

      const productsWithImages = await Promise.all(
        data.orderItems.map(async (item) => {
          let images = [];
          try {
            images = await fetchProductImages(item.product_id);
          } catch (err) {
            images = [];
          }

          return {
            ...item,
            image: images.length > 0 ? images[0] : null,
          };
        })
      );

      setOrder({ ...data, products: productsWithImages });
    } catch (error) {
      console.error("Sipariş verisi alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/user/v1", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error("Kullanıcı bilgileri alınamadı");

      const data = await response.json();
      setUserData(data);

      form.setFieldsValue({
        fullName: data.name,
        address: data.address,
      });

      if (data.balance !== undefined) {
        setWalletBalance(data.balance);
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchUserData();
  }, [orderId]);

  const totalPrice = order?.sum_price || 0;

  const handlePayment = async (values) => {
    if (walletBalance < totalPrice) {
      notification.error({
        message: "Yetersiz Bakiye",
        description:
          "Cüzdan bakiyeniz yetersiz olduğu için siparişiniz iptal edildi.",
      });

      try {
        await fetch(`http://localhost:8082/api/order/v1/${order.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setOrder(null);
      } catch (error) {
        console.error("Sipariş iptal hatası:", error);
      }

      localStorage.removeItem("orderData");
      return;
    }

    const paymentDto = {
      order_id: orderId,
    };

    try {
      const response = await fetch("http://localhost:8082/api/payment/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(paymentDto),
      });

      if (!response.ok) throw new Error("Ödeme gerçekleştirilemedi");

      const data = await response.json();

      // Sipariş durumunu PENDING olarak güncelle
      await fetch(`http://localhost:8082/api/delivery/v1/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          delivery_state: "PENDING",
          updated_at: new Date().toISOString(),
        }),
      });

      notification.success({
        message: "Ödeme Başarılı",
        description: "Ödemeniz alındı. Siparişiniz hazırlanıyor.",
      });

      setWalletBalance(walletBalance - totalPrice);

      // payment_state frontend'de güncelleniyor
      setOrder((prevOrder) => ({
        ...prevOrder,
        payment_state: "SUCCESS",
        delivery: {
          ...prevOrder.delivery,
          delivery_state: "PENDING",
        },
      }));

      localStorage.removeItem("orderData");
      localStorage.removeItem("orderCart");

      navigate("/Homepage");
    } catch (error) {
      console.error("Ödeme hatası:", error);
      notification.error({
        message: "Hata",
        description: "Ödeme sırasında bir sorun oluştu.",
      });
    }
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="payment-layout"
        style={{ marginLeft: collapsed ? 0 : 200 }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout.Content className="payment-content">
          <div className="payment-page-container">
            <Title level={2}>Ödeme Sayfası</Title>
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <p>Ödemeniz yükleniyor...</p>
              </div>
            ) : order ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handlePayment}
                className="payment-form"
              >
                <Title level={4} className="payment-section-title">
                  Müşteri Bilgileri
                </Title>
                <Form.Item
                  label="Adınız Soyadınız"
                  name="fullName"
                  rules={[{ required: true, message: "Lütfen adınızı girin" }]}
                >
                  <Input placeholder="Adınızı girin" />
                </Form.Item>

                <Form.Item
                  label="Adres"
                  name="address"
                  rules={[
                    { required: true, message: "Lütfen adresinizi girin" },
                  ]}
                >
                  <Input placeholder="Adresinizi girin" />
                </Form.Item>

                <Divider />

                <Title level={4} className="payment-section-title">
                  Sipariş Özeti
                </Title>
                <List
                  bordered
                  dataSource={order.products}
                  renderItem={(item) => (
                    <List.Item className="product-list">
                      <div
                        className="product-item"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: 40, marginRight: 10 }}
                          />
                        )}
                        <div>
                          <div>{item.name}</div>
                          <div>
                            {item.price} TL (Adet: {item.quantity}) - Beden:{" "}
                            {item.size}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />

                <Divider />

                <div className="payment-summary">
                  <Text strong className="total-amount">
                    Toplam Tutar: {totalPrice} TL
                  </Text>
                  <br />
                  <Text>Cüzdan Bakiyesi: {userData.balance} TL</Text>
                  <br />
                  {order.payment_state === "SUCCESS" && (
                    <Text type="success">
                      Ödeme durumu: Ödeme tamamlandı ✅
                    </Text>
                  )}
                </div>

                <Form.Item style={{ marginTop: "20px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="payment-button"
                    disabled={walletBalance < totalPrice}
                  >
                    Ödemeyi Tamamla
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Text>Geçerli bir sipariş bulunamadı.</Text>
            )}
          </div>
        </Layout.Content>
        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Payment;
