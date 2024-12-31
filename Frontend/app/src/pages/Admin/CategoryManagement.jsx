import React, { useState, useEffect } from "react";
import { Layout, Button, Modal, Form, Input, Table, message } from "antd";
import AdminSidebar from "../../AdminComponents/AdminSidebar";
import AdminHeader from "../../AdminComponents/AdminHeader";
import Footer from "../../components/Footer";
import "../User/UserCss/Homepage.css";
import {
  Categories,
  addCategory,
  deleteCategory,
} from "../../services/ProductService/AdminProductService";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  // Kategorileri çek
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await Categories();
      setCategories(fetchedCategories);
    } catch (error) {
      message.error("Kategoriler yüklenirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Kategori ekle
  const handleAddCategory = async (values) => {
    try {
      await addCategory({ name: values.name });
      message.success("Kategori başarıyla eklendi!");
      setIsAddModalVisible(false);
      form.resetFields();
      fetchCategories(); // Listeyi güncelle
    } catch (error) {
      message.error("Kategori eklenirken bir hata oluştu.");
    }
  };

  // Kategori sil
  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Kategori başarıyla silindi!");
      fetchCategories(); // Listeyi güncelle
    } catch (error) {
      message.error("Kategori silinirken bir hata oluştu.");
    }
  };

  // Tablo kolonları
  const columns = [
    {
      title: "Kategori Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteCategory(record.id)}>
          Sil
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <AdminSidebar />
      <Layout className="homepage-layout">
        <AdminHeader />
        <div className="content">
          <h1>Kategori İşlemleri</h1>
          <Button
            type="primary"
            onClick={() => setIsAddModalVisible(true)}
            style={{ marginBottom: "16px" }}
          >
            Kategori Ekle
          </Button>
          <Table
            dataSource={categories}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />

          {/* Kategori Ekleme Modal */}
          <Modal
            title="Kategori Ekle"
            open={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleAddCategory}
              layout="vertical"
              style={{ marginTop: "16px" }}
            >
              <Form.Item
                name="name"
                label="Kategori Adı"
                rules={[
                  { required: true, message: "Lütfen kategori adı girin!" },
                ]}
              >
                <Input placeholder="Kategori Adı" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Ekle
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default CategoryManagement;
