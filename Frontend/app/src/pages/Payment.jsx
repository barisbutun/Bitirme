import React, { useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Radio,
  Divider,
  List,
  Typography,
  notification,
} from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Payment.css";

const Payment = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { Title, Text } = Typography;

  const handleFinish = (values) => {
    console.log("Ödeme Bilgileri:", values);

    // Ödeme başarılı bildirimi göster
    notification.success({
      message: "Ödeme Başarılı",
      description: "Ödemeniz başarıyla tamamlandı. Teşekkür ederiz!",
      duration: 3,
    });
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="payment-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout.Content className="payment-content">
          <div className="payment-page-container">
            <Title level={2}>Ödeme Sayfası</Title>
            <Form
              layout="vertical"
              onFinish={handleFinish}
              className="payment-form"
            >
              <Title level={4} className="payment-section-title">
                Ödeme Bilgileri
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
                rules={[{ required: true, message: "Lütfen adresinizi girin" }]}
              >
                <Input placeholder="Adresinizi girin" />
              </Form.Item>

              <Form.Item
                label="Ödeme Yöntemi"
                name="paymentMethod"
                rules={[
                  { required: true, message: "Lütfen bir ödeme yöntemi seçin" },
                ]}
              >
                <Radio.Group>
                  <Radio value="creditCard">Kredi Kartı</Radio>
                  <Radio value="paypal">PayPal</Radio>
                  <Radio value="bankTransfer">Banka Transferi</Radio>
                </Radio.Group>
              </Form.Item>

              <Divider />

              <Title level={4} className="payment-section-title">
                Ürün Detayları
              </Title>
              <List
                bordered
                dataSource={[
                  { name: "Ürün 1", price: "100 TL" },
                  { name: "Ürün 2", price: "50 TL" },
                ]}
                renderItem={(item) => (
                  <List.Item className="product-list">
                    {item.name} - {item.price}
                  </List.Item>
                )}
              />

              <Divider />

              <Text strong className="total-amount">
                Toplam Tutar: 150 TL
              </Text>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="payment-button"
                >
                  Ödeme Yap
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Layout.Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Payment;
