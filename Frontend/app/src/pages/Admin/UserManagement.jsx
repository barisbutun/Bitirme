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
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { notification } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SafetyOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  deleteUser,
  updateUser,
} from "../../services/UserService/AdminUserService";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const { Title } = Typography;

const UserListWithDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal kontrolü
  const [selectedUser, setSelectedUser] = useState(null); // Seçilen kullanıcı
  const [form] = Form.useForm(); // Form objesi
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
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
        // console.log(response.data);
      } catch (error) {
        console.error("Kullanıcılar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Kullanıcıyı silmek istediğinize emin misiniz?",
      content: "Bu işlem geri alınamaz!",
      okText: "Evet, Sil",
      okType: "danger",
      cancelText: "Vazgeç",
      onOk: async () => {
        try {
          await deleteUser(id);
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          api.success({
            message: "Başarılı",
            description: "Kullanıcı başarıyla silindi.",
            placement: "topRight",
          });
        } catch (error) {
          console.error("Kullanıcı silinirken hata oluştu:", error);
          api.error({
            message: "Hata",
            description: "Kullanıcı silinirken bir hata oluştu.",
            placement: "topRight",
          });
        }
      },
    });
  };

  const handleEdit = (user) => {
    console.log("Düzenlenecek Kullanıcı ID:", user.id);
    setSelectedUser(user); // Seçilen kullanıcıyı ayarla
    form.setFieldsValue({
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
    });
    setIsModalVisible(true); // Modal'ı göster
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(selectedUser.id, values); // Kullanıcıyı güncelleme servisi
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...values } : user
        )
      );
      setIsModalVisible(false); // Modal'ı kapat
    } catch (error) {
      console.error("Güncelleme işlemi sırasında hata:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Modal'ı kapat
  };

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
    {
      title: "İşlemler",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            size="small"
          >
            Güncelle
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.id)}
            size="small"
          >
            Sil
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, position: "relative" }}>
      {contextHolder}
      <Link to="/admin">
        <Button
          icon={<HomeOutlined />}
          onClick={() => navigate("/admin")}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 10,
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

      {/* Modal for editing user */}
      <Modal
        title="Kullanıcıyı Güncelle"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: selectedUser?.name,
            phone: selectedUser?.phone,
            address: selectedUser?.address,
            role: selectedUser?.role,
          }}
        >
          <Form.Item
            name="name"
            label="Ad Soyad"
            rules={[{ required: true, message: "Ad soyad giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true, message: "Telefon numarası giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Adres"
            rules={[{ required: true, message: "Adres giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: "Rol seçiniz!" }]}
          >
            <Select>
              <Select.Option value="USER">Kullanıcı</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserListWithDashboard;
