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
  notification,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SafetyOutlined,
  HomeOutlined,
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  MehOutlined,
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0); // eklendi
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:8082/api/admin/v1/users?page=${
            currentPage - 1
          }&size=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.content);
        setFilteredUsers(response.data.content);
        setTotalElements(response.data.totalElements); // eklendi
      } catch (error) {
        console.error("Kullanıcılar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, currentPage]);

  useEffect(() => {
    let filtered = users;
    if (filterStatus === "ACTIVE") {
      filtered = users.filter((user) => !user.isDeleted);
    } else if (filterStatus === "PASSIVE") {
      filtered = users.filter((user) => user.isDeleted);
    }
    setFilteredUsers(filtered);
  }, [filterStatus, users]);

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
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(selectedUser.id, values);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...values } : user
        )
      );
      setIsModalVisible(false);
      api.success({
        message: "Başarılı",
        description: "Kullanıcı başarıyla güncellendi.",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Güncelleme işlemi sırasında hata:", error);

      // Eğer özel hata mesajı varsa kontrol et
      if (
        error.message.includes("duplicate key") &&
        error.message.includes("phone")
      ) {
        api.error({
          message: "Hata",
          description: "Kullanıcı güncellenirken bir hata oluştu.",
          placement: "topRight",
        });
      } else {
        api.error({
          message: "Hata",
          description: "Bu telefon numarası başka bir kullanıcıya ait!",
          placement: "topRight",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => !user.isDeleted).length;
  const passiveUsers = users.filter((user) => user.isDeleted).length;
  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (text, record) => {
        let icon;
        let bgColor;

        switch (record.gender) {
          case "FEMALE":
            icon = <WomanOutlined />;
            bgColor = "#e91e63";
            break;
          case "MALE":
            icon = <ManOutlined />;
            bgColor = "#1890ff";
            break;
          case "OTHER":
            icon = <MehOutlined />;
            bgColor = "#9e9e9e";
            break;
          default:
            icon = <UserOutlined />;
            bgColor = "#bdbdbd";
        }

        return <Avatar style={{ backgroundColor: bgColor }}>{icon}</Avatar>;
      },
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
      dataIndex: "isDeleted",
      key: "status",
      render: (isDeleted) =>
        isDeleted ? (
          <Tag color="red">Pasif</Tag>
        ) : (
          <Tag color="green">Aktif</Tag>
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
          style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}
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
        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            style={{ width: 200 }}
          >
            <Select.Option value="ALL">Tüm Kullanıcılar</Select.Option>
            <Select.Option value="ACTIVE">Aktif Kullanıcılar</Select.Option>
            <Select.Option value="PASSIVE">Pasif Kullanıcılar</Select.Option>
          </Select>
        </div>

        {loading ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        ) : (
          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey={(record) => record.id}
            pagination={{
              current: currentPage,
              total: totalElements,
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
            }}
            bordered
          />
        )}
      </Card>

      <Modal
        title="Kullanıcıyı Güncelle"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
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
            rules={[{ required: true, message: "Telefon giriniz!" }]}
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
