import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Tag,
  Select,
  Button,
  Row,
  Col,
  Statistic,
  message,
  Spin,
} from "antd";
import {
  DeliveredProcedureOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  CheckCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deliveryRes, productRes] = await Promise.all([
        axios.get("http://localhost:8082/api/delivery/v1"),
        axios.get("http://localhost:8082/api/product/v1/all"),
      ]);

      const deliveriesWithExtras = deliveryRes.data.map((delivery) => {
        const product = productRes.data.find(
          (p) => p.id === delivery.productId || p.id === delivery.product_id
        );

        return {
          ...delivery,
          userName:
            delivery.user?.name || delivery.user_name || "Bilinmeyen Kullanıcı",
          address: delivery.address || "",
          status:
            delivery.delivery_state === "PENDING"
              ? "preparing"
              : delivery.delivery_state === "SHIPPED"
              ? "shipping"
              : "delivered",
          productName: product?.name || "Ürün Bilgisi Yok",
        };
      });

      setDeliveries(deliveriesWithExtras);
    } catch (error) {
      message.error("Veriler alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (id, status) => {
    setStatusUpdates((prev) => ({ ...prev, [id]: status }));
  };

  const handleUpdateStatus = async (id) => {
    console.log("Gönderilen ID:", id);
    const updatedStatus = statusUpdates[id];
    if (!updatedStatus) {
      message.warning("Lütfen bir durum seçin.");
      return;
    }

    const delivery = deliveries.find((d) => d.id === id);

    const updatedDelivery = {
      company_name: delivery.company_name,
      delivery_date: delivery.delivery_date,
      delivery_state:
        updatedStatus === "preparing"
          ? "PROCESSING"
          : updatedStatus === "shipping"
          ? "SHIPPED"
          : "DELIVERED",
      updated_at: new Date().toISOString(),
    };

    try {
      await axios.put(
        `http://localhost:8082/api/delivery/v1/${id}`,
        updatedDelivery
      );
      message.success("Sipariş durumu güncellendi.");
      fetchData();
    } catch (error) {
      message.error("Güncelleme başarısız.");
    }
  };

  const totalOrders = deliveries.length;
  const preparingCount = deliveries.filter(
    (d) => d.status === "preparing"
  ).length;
  const shippingCount = deliveries.filter(
    (d) => d.status === "shipping"
  ).length;
  const deliveredCount = deliveries.filter(
    (d) => d.status === "delivered"
  ).length;

  const columns = [
    {
      title: "Teslimat ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ürün",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Kullanıcı",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Adres",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let displayText;
        let color;

        switch (status) {
          case "preparing":
            displayText = "Hazırlanıyor";
            color = "orange";
            break;
          case "shipping":
            displayText = "Kargoda";
            color = "blue";
            break;
          case "delivered":
            displayText = "Teslim Edildi";
            color = "green";
            break;
          case "cancelled":
            displayText = "İptal Edildi";
            color = "red";
            break;
          default:
            displayText = "Bilinmiyor";
            color = "gray";
        }

        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    {
      title: "Yeni Durum",
      key: "newStatus",
      render: (_, record) => (
        <div style={{ maxWidth: 300 }}>
          <Select
            value={statusUpdates[record.id] || record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: "100%" }}
            placeholder="Durum Seçiniz"
          >
            <Option value="preparing">🛠 Hazırlanıyor (PROCESSING)</Option>
            <Option value="shipping">🚚 Kargoda (SHIPPED)</Option>
            <Option value="delivered">📦 Teslim Edildi (DELIVERED)</Option>
            <Option value="cancelled">❌ İptal Edildi (CANCELLED)</Option>
          </Select>
        </div>
      ),
    },

    {
      title: "Güncelle",
      key: "update",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleUpdateStatus(record.id)}>
          Güncelle
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>📦 Sipariş Yönetim Paneli</Title>
      <Link to="/admin">
        <Button
          icon={<HomeOutlined />}
          onClick={() => navigate("/admin")}
          style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}
        >
          Anasayfaya Dön
        </Button>
      </Link>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Toplam Sipariş"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hazırlanıyor"
              value={preparingCount}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<DeliveredProcedureOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Kargoda"
              value={shippingCount}
              valueStyle={{ color: "#1890ff" }}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Teslim Edildi"
              value={deliveredCount}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Sipariş Listesi">
        <Spin spinning={loading}>
          <Table
            dataSource={deliveries}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 6 }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default DeliveryDashboard;
