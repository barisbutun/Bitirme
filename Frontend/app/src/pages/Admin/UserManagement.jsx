import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Spin,
  Tag,
  Avatar,
  Row,
  Col,
  Statistic,
  Button,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SafetyOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const { Title } = Typography;

const UserListWithDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8082/api/admin/v1/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Kullanıcılar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const passiveUsers = users.filter((user) => user.status !== "ACTIVE").length;
  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: () => (
        <Avatar
          style={{ backgroundColor: "#1890ff" }}
          icon={<UserOutlined />}
        />
      ),
    },
    {
      title: "Ad Soyad",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Adres",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (!role) return <Tag color="default">Bilinmiyor</Tag>;
        const color = role === "ADMIN" ? "geekblue" : "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, position: "relative" }}>
      {/* Anasayfaya dön butonunu sağ üst köşeye konumlandırdık */}
      <Link to="/admin">
        <Button
          icon={<HomeOutlined />}
          onClick={() => navigate("/admin")}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 10, // Butonun diğer öğelerin üstünde olmasını sağlıyor
          }}
        >
          Anasayfaya Dön
        </Button>
      </Link>

      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        👤 Kullanıcı Yönetimi Paneli
      </Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Toplam Kullanıcı"
              value={totalUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Aktif Kullanıcı"
              value={activeUsers}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pasif Kullanıcı"
              value={passiveUsers}
              valueStyle={{ color: "#cf1322" }}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Admin Sayısı"
              value={adminCount}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        ) : (
          <Table
            dataSource={users}
            columns={columns}
            rowKey={(record) => record.id}
            pagination={{ pageSize: 8 }}
            bordered
          />
        )}
      </Card>
    </div>
  );
};

export default UserListWithDashboard;
